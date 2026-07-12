import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CreditCard, PowerOff, ShieldAlert, Clock, RefreshCw, X, Link2, Edit2, Trash2 } from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(utcStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return "Never";
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(utcStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export const RfidCards: React.FC = () => {
  const { apiFetch, user } = useAuth();
  const { addToast } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Assign Modal State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignRfidUid, setAssignRfidUid] = useState("");
  const [assignStudentId, setAssignStudentId] = useState("");
  const [studentsList, setStudentsList] = useState<any[]>([]);

  // Edit Card Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [editRfidUid, setEditRfidUid] = useState("");
  const [editStatus, setEditStatus] = useState("active");

  const fetchRfidData = async () => {
    setLoading(true);
    try {
      const cardList = await apiFetch("/api/rfid/");
      const historyList = await apiFetch("/api/rfid/scan-history");
      const studentsData = await apiFetch("/api/students/?limit=100");
      
      setCards(cardList || []);
      setHistory(historyList || []);
      setStudentsList(studentsData.students || []);
    } catch (e: any) {
      setCards([]);
      setHistory([]);
      addToast("error", e.message || "Failed to load RFID directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfidData();
  }, []);

  const openAssignModal = () => {
    setAssignRfidUid("");
    setAssignStudentId("");
    setIsAssignOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingCard(c);
    setEditRfidUid(c.uid);
    setEditStatus(c.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRfidUid || !editingCard) {
      addToast("warning", "Card UID is required");
      return;
    }

    try {
      await apiFetch(`/api/rfid/${editingCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: editRfidUid, status: editStatus })
      });
      addToast("success", "Card configurations updated successfully");
      setIsEditOpen(false);
      fetchRfidData();
    } catch (err: any) {
      addToast("error", err.message || "Failed to update RFID card");
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignRfidUid || !assignStudentId) {
      addToast("warning", "Fill all fields to map RFID key");
      return;
    }

    try {
      await apiFetch("/api/rfid/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: assignRfidUid,
          student_id: parseInt(assignStudentId),
          status: "active"
        })
      });
      addToast("success", "RFID card mapped to student successfully!");
      setIsAssignOpen(false);
      fetchRfidData();
    } catch (err: any) {
      addToast("error", err.message || "RFID Registration failed");
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!window.confirm("Block this RFID card? Blocked cards trigger visual alerts when scanned.")) return;
    try {
      await apiFetch(`/api/rfid/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "blocked" })
      });
      addToast("success", "RFID card access blocked");
      fetchRfidData();
    } catch (e: any) {
      addToast("error", e.message || "Deactivation failed");
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!window.confirm("Unlink and delete this card mapping?")) return;
    try {
      await apiFetch(`/api/rfid/${id}`, { method: "DELETE" });
      addToast("success", "RFID card association removed");
      fetchRfidData();
    } catch (e: any) {
      addToast("error", "Delete request rejected");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">RFID Keys Manager</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Map RFID credentials to student admission records, monitor active gateways, and block lost credentials.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchRfidData}
            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Reload Logs</span>
          </button>
          <button
            onClick={openAssignModal}
            className="btn-primary text-[11px] py-1.5 px-3.5 flex items-center gap-1.5"
          >
            <Link2 size={12} />
            <span>Assign Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFID Inventory Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="saas-card bg-white dark:bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Assigned Keys Registry</span>
              <span className="text-[10px] bg-primary-50 dark:bg-primary-950/30 text-primary-500 font-bold px-2 py-0.5 rounded border border-primary-100/50 dark:border-primary-900/30">
                {cards.length} Keys mapped
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-slate-50/20">
                    <th className="px-5 py-3">Card UID</th>
                    <th className="px-5 py-3">Mapped Student</th>
                    <th className="px-5 py-3">Register Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading Registry...</td>
                    </tr>
                  ) : cards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-slate-400 font-bold">No active RFID keys assigned.</td>
                    </tr>
                  ) : (
                    cards.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-slate-400" />
                            <span className="font-bold text-slate-700 dark:text-slate-350">{c.uid}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{c.student_name}</div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Adm: {c.student_admission_number}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-semibold">{formatDate(c.assigned_at)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            c.status === "active" ? "bg-success-50 text-success-600 border border-success-100/50 dark:bg-success-950/20 dark:text-success-400" : "bg-danger-50 text-danger-600 border border-danger-100/50 dark:bg-danger-950/20 dark:text-danger-400"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(c)}
                              title="Edit key configuration"
                              className="p-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 transition-colors cursor-pointer"
                            >
                              <Edit2 size={11} />
                            </button>
                            {c.status === "active" && (
                              <button
                                onClick={() => handleDeactivate(c.id)}
                                title="Block Card Access"
                                className="p-1 rounded-md bg-warning-50 hover:bg-warning-100 border border-warning-100 text-warning-600 dark:bg-warning-950/20 dark:border-warning-900/30 transition-colors cursor-pointer"
                              >
                                <PowerOff size={11} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCard(c.id)}
                              title="Delete card mapping"
                              className="p-1 rounded-md bg-danger-50 hover:bg-danger-100 border border-danger-100 text-danger-500 dark:bg-danger-950/20 dark:border-danger-900/30 transition-colors cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Scan Log History Timeline */}
        <div className="space-y-4">
          <div className="saas-card bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Live Scan Feed</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 px-2 py-0.5 rounded-full uppercase">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-6 text-slate-400 font-bold uppercase tracking-wider animate-pulse text-[10px]">Loading Scan Feed...</div>
              ) : history.length === 0 ? (
                <p className="text-center text-slate-400 dark:text-slate-500 text-xs py-4">No card scans logged today.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 border border-slate-200/50 dark:border-slate-800/80 rounded-xl transition-all flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={12} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-700 dark:text-slate-350 truncate">{h.rfid_uid}</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">Student: {h.student_name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Class: {h.class_section} | Scanner: {h.gateway_name}</p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        h.status === "success" 
                          ? "bg-success-50 text-success-600 border border-success-100/40 dark:bg-success-950/20" 
                          : h.status === "blocked" 
                            ? "bg-danger-50 text-danger-600 border border-danger-100/40 dark:bg-danger-950/20" 
                            : "bg-warning-50 text-warning-600 border border-warning-100/40 dark:bg-warning-950/20"
                      }`}>
                        {h.status}
                      </span>
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold flex items-center gap-1">
                        <Clock size={10} />
                        <span>{formatTime(h.timestamp)}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAPPING CARD ASSIGN MODAL --- */}
      {isAssignOpen && (
        <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100">Register & Assign RFID Key</h3>
              <button onClick={() => setIsAssignOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">RFID Card Physical UID</label>
                <input
                  type="text"
                  value={assignRfidUid}
                  onChange={(e) => setAssignRfidUid(e.target.value)}
                  placeholder="UID Format (e.g. 04:A2:3B:5C)"
                  className="premium-input text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Assign to Student Profile</label>
                <select
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  className="premium-input text-xs py-2 cursor-pointer bg-white dark:bg-slate-900"
                  required
                >
                  <option value="">Choose Student from registry</option>
                  {studentsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} (Adm ID: {st.admission_number} | Class: {st.class_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="btn-secondary text-xs py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 cursor-pointer font-bold"
                >
                  Assign Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT CARD CONFIG MODAL --- */}
      {isEditOpen && editingCard && (
        <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100">Edit RFID Card configuration</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Card UID</label>
                <input
                  type="text"
                  value={editRfidUid}
                  onChange={(e) => setEditRfidUid(e.target.value)}
                  className="premium-input text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Access Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="premium-input text-xs py-2 cursor-pointer bg-white dark:bg-slate-900"
                >
                  <option value="active">Active (Granted Access)</option>
                  <option value="blocked">Blocked (Denied Access / Trigger Alarm)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="btn-secondary text-xs py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 cursor-pointer font-bold"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
