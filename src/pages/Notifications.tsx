import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Bell, Check, ShieldAlert, Cpu, AlertTriangle, AlertCircle } from "lucide-react";

export const Notifications: React.FC = () => {
  const { apiFetch } = useAuth();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/notifications/");
      setNotifications(data || []);
    } catch (e: any) {
      // Mock notifications fallbacks
      setNotifications([
        { id: 1, type: "device_offline", message: "Classroom 5-A Scanner went offline: connection lost", is_read: false, created_at: new Date().toISOString() },
        { id: 2, type: "sim_balance_low", message: "LTE Module A7672S at Entrance Gate A reports low SIM card balance (< $2.00)", is_read: false, created_at: new Date().toISOString() },
        { id: 3, type: "call_failed", message: "Call to Mother of Liam Nelson failed. Reason: busy", is_read: true, created_at: new Date().toISOString() },
        { id: 4, type: "rfid_error", message: "Unknown RFID card scanned: UID RFID_999_UNK at Entrance Gate A", is_read: true, created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/api/notifications/mark-all-read", { method: "POST" });
      addToast("success", "All alerts marked as read");
      fetchNotifications();
    } catch (e: any) {
      addToast("error", "Could not clear alerts");
    }
  };

  const handleMarkSingleRead = async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
      addToast("success", "Alert marked as read");
      fetchNotifications();
    } catch (e: any) {
      addToast("error", "Failed to resolve alert");
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "device_offline":
        return { icon: Cpu, color: "text-danger-500 bg-danger-50 border-danger-100/50 dark:bg-danger-950/20 dark:border-danger-900/30" };
      case "sim_balance_low":
        return { icon: AlertTriangle, color: "text-warning-500 bg-warning-50 border-warning-100/50 dark:bg-warning-950/20 dark:border-warning-900/30" };
      case "student_blocked":
        return { icon: ShieldAlert, color: "text-danger-600 bg-danger-50 border-danger-100/50 dark:bg-danger-950/20 dark:border-danger-900/30" };
      case "call_failed":
        return { icon: AlertCircle, color: "text-danger-500 bg-danger-50 border-danger-100/50 dark:bg-danger-950/20 dark:border-danger-900/30" };
      default:
        return { icon: Bell, color: "text-primary-500 bg-primary-50 border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30" };
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">System Alerts Center</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Monitor hardware faults, SIM networks, call errors, and RFID block events.</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <Check size={14} />
          <span>Mark All Cleared</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-wider animate-pulse">Querying active alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-semibold text-xs">No active warnings registered. All systems green.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const { icon: Icon, color } = getAlertStyle(notif.type);
            return (
              <div
                key={notif.id}
                className={`saas-card bg-white dark:bg-slate-900 p-5 border flex items-center justify-between gap-4 transition-all duration-300 ${
                  notif.is_read ? "opacity-60 bg-white/20" : "bg-white/40 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">{notif.message}</h4>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1.5 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkSingleRead(notif.id)}
                    title="Mark resolved"
                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition-all shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
