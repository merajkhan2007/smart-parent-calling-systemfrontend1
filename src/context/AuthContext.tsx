import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  role: "Super Admin" | "School Admin" | "Teacher";
  school_id: number | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  selectedSchoolId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  changeSchool: (id: number | null) => void;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user & school context from storage
  useEffect(() => {
    const savedToken = localStorage.getItem("spcs_token") || sessionStorage.getItem("spcs_token");
    const savedUser = localStorage.getItem("spcs_user") || sessionStorage.getItem("spcs_user");
    const savedSchool = localStorage.getItem("spcs_school_id") || sessionStorage.getItem("spcs_school_id");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedSchool) {
        setSelectedSchoolId(parseInt(savedSchool));
      }
    }
    setIsLoading(false);
  }, []);

  const changeSchool = (id: number | null) => {
    setSelectedSchoolId(id);
    const savedToken = localStorage.getItem("spcs_token");
    const storage = savedToken ? localStorage : sessionStorage;
    if (id !== null) {
      storage.setItem("spcs_school_id", String(id));
    } else {
      storage.removeItem("spcs_school_id");
    }
    // Reload state or trigger path refresh
    window.location.reload();
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (!response.ok) {
        let errorMsg = "Authentication failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) {
          errorMsg = `Server error (${response.status}): Make sure the backend server is running at http://localhost:8000.`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const userPayload: User = {
        email: data.email,
        name: data.name,
        role: data.role,
        school_id: data.school_id || null,
      };

      setToken(data.access_token);
      setUser(userPayload);
      setSelectedSchoolId(data.school_id || null);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("spcs_token", data.access_token);
      storage.setItem("spcs_refresh", data.refresh_token);
      storage.setItem("spcs_user", JSON.stringify(userPayload));
      
      if (data.school_id !== undefined && data.school_id !== null) {
        storage.setItem("spcs_school_id", String(data.school_id));
      } else {
        storage.removeItem("spcs_school_id");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSelectedSchoolId(null);
    localStorage.removeItem("spcs_token");
    localStorage.removeItem("spcs_refresh");
    localStorage.removeItem("spcs_user");
    localStorage.removeItem("spcs_school_id");
    sessionStorage.removeItem("spcs_token");
    sessionStorage.removeItem("spcs_refresh");
    sessionStorage.removeItem("spcs_user");
    sessionStorage.removeItem("spcs_school_id");
  };

  // Wrapper for authenticated API requests that attaches headers and handles refreshments
  const apiFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    let currentToken = token || localStorage.getItem("spcs_token") || sessionStorage.getItem("spcs_token");
    const activeSchoolId = selectedSchoolId || localStorage.getItem("spcs_school_id") || sessionStorage.getItem("spcs_school_id");

    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${currentToken}`,
    };

    // Automatically append school_id query parameter if set
    let targetUrl = url;
    if (activeSchoolId) {
      try {
        const urlObj = new URL(url, window.location.origin);
        if (!urlObj.searchParams.has("school_id")) {
          urlObj.searchParams.append("school_id", String(activeSchoolId));
        }
        targetUrl = urlObj.pathname + urlObj.search;
      } catch (e) {
        // relative URL string check
        const delimiter = url.includes("?") ? "&" : "?";
        if (!url.includes("school_id=")) {
          targetUrl = `${url}${delimiter}school_id=${activeSchoolId}`;
        }
      }
    }

    let response = await fetch(targetUrl, { ...options, headers });

    if (response.status === 401) {
      const rToken = localStorage.getItem("spcs_refresh") || sessionStorage.getItem("spcs_refresh");
      if (rToken) {
        try {
          const refreshRes = await fetch(`/api/auth/refresh?refresh_token=${rToken}`, {
            method: "POST",
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setToken(data.access_token);
            const rememberMe = !!localStorage.getItem("spcs_refresh");
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem("spcs_token", data.access_token);
            storage.setItem("spcs_refresh", data.refresh_token);

            // Retry request
            headers["Authorization"] = `Bearer ${data.access_token}`;
            response = await fetch(targetUrl, { ...options, headers });
          } else {
            logout();
            throw new Error("Session expired. Please log in again.");
          }
        } catch (e) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "An error occurred" }));
      throw new Error(err.detail || "Request failed");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedSchoolId,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changeSchool,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
