import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Cpu,
  PhoneCall,
  BarChart3,
  Bell,
  Settings,
  Shield,
  School as SchoolIcon,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Volume2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, selectedSchoolId, changeSchool, apiFetch, logout } = useAuth();
  const { isConnected } = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("spcs_sidebar_collapsed") === "true";
  });
  
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [activeSettings, setActiveSettings] = useState<any>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/students?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch("");
    }
  };

  // Fetch settings dynamically to obtain current school name & logo
  const fetchSettings = () => {
    apiFetch("/api/settings/")
      .then((data) => {
        setActiveSettings(data);
      })
      .catch(() => setActiveSettings(null));
  };

  // Fetch schools list if Super Admin
  useEffect(() => {
    if (user?.role === "Super Admin") {
      apiFetch("/api/schools/")
        .then((data) => setSchools(data || []))
        .catch(() => setSchools([]));
    }
  }, [user]);

  // Fetch dynamic details on school context mount/change
  useEffect(() => {
    fetchSettings();
    apiFetch("/api/notifications/?unread_only=true")
      .then((data) => {
        // Map to timeline logs
        const mapped = (data || []).slice(0, 5).map((n: any) => ({
          id: n.id,
          message: n.message,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setUnreadNotifications(mapped);
      })
      .catch(() => setUnreadNotifications([]));
  }, [selectedSchoolId]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("spcs_sidebar_collapsed", String(next));
      return next;
    });
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Students", path: "/students", icon: Users },
    { name: "Parents", path: "/parents", icon: UserCheck },
    { name: "RFID Cards", path: "/rfids", icon: CreditCard },
    { name: "ESP32 Devices", path: "/devices", icon: Cpu },
    { name: "Call History", path: "/calls", icon: PhoneCall },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Users", path: "/users", icon: Shield, roleLimit: ["Super Admin", "School Admin"] },
    { name: "School Profile", path: "/school", icon: SchoolIcon, roleLimit: ["Super Admin", "School Admin"] }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentSchoolName = activeSettings?.school_name || "Smart Parent Calling System";

  return (
    <div className="min-h-screen flex bg-bg-base text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 z-20 transition-all duration-300 shrink-0 ${isCollapsed ? "w-20" : "w-64"}`}>
        {/* Brand Logo & Header */}
        {!isCollapsed ? (
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-sm shadow-primary-500/20 shrink-0">
                <Volume2 size={16} />
              </div>
              <div className="transition-all duration-200">
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight truncate max-w-[120px] block">
                  {currentSchoolName.split(" ")[0]} SPCS
                </span>
                <p className="text-[8px] text-slate-400 font-bold tracking-wider -mt-0.5 uppercase">Enterprise Dialer</p>
              </div>
            </Link>
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-sm shadow-primary-500/20">
              <Volume2 size={16} />
            </div>
            <button
              onClick={toggleCollapse}
              className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-sm z-30 cursor-pointer"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems
            .filter((item) => !item.roleLimit || (user && item.roleLimit.includes(user.role)))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-sm shadow-primary-500/10"
                      : "text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/30 font-semibold"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-danger-500 hover:text-danger-600 font-bold text-xs hover:bg-danger-500/5 cursor-pointer"
          >
            <LogOut size={14} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 animate-slide-right">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-tight">SPCS Roster</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-sm shadow-primary-500/10"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 font-medium"
                    }`}
                  >
                    <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-danger-550 hover:text-danger-600 font-bold text-xs hover:bg-danger-500/5 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu size={18} />
            </button>

            {/* Search Bar */}
            <form onSubmit={handleGlobalSearch} className="relative max-w-xs w-full hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </div>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs placeholder-slate-450 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all font-medium text-slate-700 dark:text-slate-200"
                placeholder="Search database..."
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Hardware Connectivity state */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-[10px] font-bold border border-emerald-100/40 dark:border-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 animate-fade-in">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-ping"}`}></span>
              <span>
                {isConnected ? "LTE Server Online" : "Reconnecting Link"}
              </span>
            </div>

            {/* School Profile Selector Dropdown */}
            {user?.role === "Super Admin" ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{currentSchoolName}</span>
                  <ChevronDown size={11} className="text-slate-400 transition-transform group-hover:rotate-180 duration-150" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50 p-1">
                  {schools.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => changeSchool(s.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] mb-0.5 cursor-pointer block ${
                        s.id === selectedSchoolId
                          ? "bg-primary-50 dark:bg-primary-950/20 font-bold text-primary-500"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs font-bold text-slate-750 dark:text-slate-350 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                <span>{currentSchoolName}</span>
              </div>
            )}

            {/* Quick Actions CTA button */}
            <Link
              to="/students"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-primary-500/10 transition-all cursor-pointer animate-fade-in"
            >
              <Plus size={12} />
              <span>Register Student</span>
            </Link>

            {/* Reload Panel Trigger */}
            <button
              onClick={() => window.location.reload()}
              title="Refresh State"
              className="p-2 rounded-xl text-slate-450 hover:text-slate-750 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-455 hover:text-slate-800 dark:text-slate-550 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer"
              >
                <Bell size={15} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-2 animate-slide-up">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Alerts & Incidents</span>
                    <button
                      onClick={() => setUnreadNotifications([])}
                      className="text-[10px] text-primary-500 hover:text-primary-650 font-bold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {unreadNotifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-semibold">All systems green.</p>
                    ) : (
                      unreadNotifications.map((n) => (
                          <div
                            key={n.id}
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg transition-colors mb-0.5 cursor-pointer"
                          >
                            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-normal">{n.message}</p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 block">{n.time}</span>
                          </div>
                      ))
                    )}
                  </div>
                  <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block text-center w-full py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-lg"
                    >
                      View Logs
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-bold text-[10px] flex items-center justify-center uppercase shadow-sm shadow-primary-500/10 shrink-0">
                  {user?.name?.slice(0, 2) || "AD"}
                </div>
                <ChevronDown size={13} className="text-slate-455" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-1.5 animate-slide-up">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || "SPCS User"}</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold truncate">{user?.email || "admin@spcs.com"}</p>
                    <p className="text-[9px] text-slate-350 dark:text-slate-500 font-bold uppercase mt-0.5">{user?.role || "Staff"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-danger-550 hover:bg-danger-500/5 font-bold text-xs transition-colors mt-1 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Inner Container with light background */}
        <main className="flex-1 p-6 overflow-y-auto bg-bg-base dark:bg-slate-950 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
