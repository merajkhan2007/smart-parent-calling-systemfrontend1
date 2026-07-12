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
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">System Users & Roles</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Assign console privileges to teachers, operators and school admins.</p>
        </div>

        {user?.role === "Super Admin" && (
          <button
            onClick={openCreateModal}
            className="btn-primary text-[11px] py-1.5 px-3.5 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={12} />
            <span>Add Administrator</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider gap-2">
          <Loader2 className="animate-spin text-primary-500" size={15} />
          <span>Loading operators database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usersList.map((u) => (
            <div key={u.id} className="saas-card bg-white dark:bg-slate-900 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-950/20 dark:text-primary-400 flex items-center justify-center border border-primary-100/50 dark:border-primary-900/30">
                    <Shield size={16} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      u.role?.name === "Super Admin" ? "bg-purple-50 text-purple-650 border border-purple-100 dark:bg-purple-950/20" : u.role?.name === "School Admin" ? "bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-950/20" : "bg-slate-50 text-slate-600 border border-slate-205 dark:bg-slate-800"
                    }`}>
                      {u.role?.name || "User"}
                    </span>
                    {user?.role === "Super Admin" && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary-500 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 size={11} />
                        </button>
                        {u.email !== user?.email && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-danger-550 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{u.full_name || "Unnamed User"}</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">{u.email}</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                <span>Access Status</span>
                <span className={u.is_active ? "text-success-500 font-bold" : "text-danger-500 font-bold"}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD/EDIT PRIVILEGED USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100">
                {formMode === "create" ? "Add System Operator" : "Edit System Operator"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Connor"
                  className="premium-input text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="operator@spcs.com"
                  className="premium-input text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">
                  System Password {formMode === "edit" && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="premium-input text-xs py-2"
                  required={formMode === "create"}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Access Role</label>
                <select
                  value={formRoleId}
                  onChange={(e) => setFormRoleId(e.target.value)}
                  disabled={selectedUser?.email === user?.email}
                  className="premium-input text-xs py-2 cursor-pointer bg-white dark:bg-slate-900 disabled:opacity-60"
                >
                  <option value="1">Super Admin</option>
                  <option value="2">School Admin</option>
                  <option value="3">Teacher</option>
                </select>
              </div>

              {formMode === "edit" && (
                <div>
                  <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Status</label>
                  <select
                    value={formIsActive ? "true" : "false"}
                    onChange={(e) => setFormIsActive(e.target.value === "true")}
                    disabled={selectedUser?.email === user?.email}
                    className="premium-input text-xs py-2 cursor-pointer bg-white dark:bg-slate-900 disabled:opacity-60"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
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
