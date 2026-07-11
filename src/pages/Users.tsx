import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Shield, Plus, X, Trash2, Edit2, Loader2 } from "lucide-react";

export const Users: React.FC = () => {
  const { apiFetch, user } = useAuth();
  const { addToast } = useToast();

  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Form Fields
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState("3"); // default: Teacher
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/users/");
      setUsersList(data || []);
    } catch (e: any) {
      addToast("error", e.message || "Failed to load users database");
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedUser(null);
    setFormEmail("");
    setFormName("");
    setFormPassword("");
    setFormRoleId("3");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setFormMode("edit");
    setSelectedUser(u);
    setFormEmail(u.email);
    setFormName(u.full_name || "");
    setFormPassword(""); // blank by default for editing
    setFormRoleId(String(u.role_id));
    setFormIsActive(u.is_active);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail || !formName || (formMode === "create" && !formPassword)) {
      addToast("warning", "Please fill in all required fields");
      return;
    }

    const payload: any = {
      email: formEmail,
      full_name: formName,
      role_id: parseInt(formRoleId),
      is_active: formIsActive
    };

    if (formPassword) {
      payload.password = formPassword;
    }

    try {
      if (formMode === "create") {
        await apiFetch("/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        addToast("success", `User profile registered: ${formName}`);
      } else {
        await apiFetch(`/api/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        addToast("success", `User profile updated: ${formName}`);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      addToast("error", err.message || "Failed to submit user record");
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (user?.email === email) {
      addToast("error", "You cannot delete your own account");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
      addToast("success", "User account deleted");
      fetchUsers();
    } catch (err: any) {
      addToast("error", err.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Users & Roles</h1>
          <p className="text-sm text-slate-400 font-semibold">Assign console privileges to teachers, operators and school admins.</p>
        </div>

        {user?.role === "Super Admin" && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus size={14} />
            <span>Add Administrator</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm font-semibold gap-2">
          <Loader2 className="animate-spin text-primary-500" size={18} />
          <span>Loading operators database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usersList.map((u) => (
            <div key={u.id} className="rounded-3xl glass p-6 border dark:bg-slate-900/40 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-extrabold shadow-sm">
                    <Shield size={20} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      u.role?.name === "Super Admin" ? "bg-purple-100 text-purple-800" : u.role?.name === "School Admin" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {u.role?.name || "User"}
                    </span>
                    {user?.role === "Super Admin" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-blue-500 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={12} />
                        </button>
                        {u.email !== user?.email && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200">{u.full_name || "Unnamed User"}</h4>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{u.email}</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100/50 dark:border-slate-800/50 text-[10px] text-slate-400 font-bold uppercase">
                <span>Access Status</span>
                <span className={u.is_active ? "text-emerald-500" : "text-rose-500"}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD/EDIT PRIVILEGED USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm">
                {formMode === "create" ? "Add System Operator" : "Edit System Operator"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Connor"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="operator@spcs.com"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">
                  System Password {formMode === "edit" && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required={formMode === "create"}
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Access Role</label>
                <select
                  value={formRoleId}
                  onChange={(e) => setFormRoleId(e.target.value)}
                  disabled={selectedUser?.email === user?.email}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-60"
                >
                  <option value="1">Super Admin</option>
                  <option value="2">School Admin</option>
                  <option value="3">Teacher</option>
                </select>
              </div>

              {formMode === "edit" && (
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Status</label>
                  <select
                    value={formIsActive ? "true" : "false"}
                    onChange={(e) => setFormIsActive(e.target.value === "true")}
                    disabled={selectedUser?.email === user?.email}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-60"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase rounded-xl shadow-md transition-all duration-200"
              >
                {formMode === "create" ? "Register Account" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
