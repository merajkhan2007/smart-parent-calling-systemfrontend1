import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Download, Phone, CheckCircle, XCircle, FileSpreadsheet } from "lucide-react";

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(utcStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

const formatDuration = (seconds: number) => {
  if (seconds === undefined || seconds === null) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export const CallHistory: React.FC = () => {
  const { apiFetch } = useAuth();

  const [calls, setCalls] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const url = `/api/call/?page=${page}&limit=${limit}&student_query=${search}&status=${statusFilter}`;
      const data = await apiFetch(url);
      setCalls(data.calls || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setCalls([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (path: string, fileName: string) => {
    try {
      const response = await apiFetch(path, {
        method: "GET"
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      alert("Failed to download export file: " + err.message);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [page, statusFilter]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCalls();
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Call Log Transcripts</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">View chronological logs of all calls routed through LTE modules.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport("/api/call/export/pdf", "call_history_report.csv")}
            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={12} />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => handleExport("/api/call/export/excel", "call_history.xlsx")}
            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={12} />
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="saas-card bg-white dark:bg-slate-900 p-5">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Student..."
              className="premium-input pl-9 text-xs py-2"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="premium-input text-xs py-2 cursor-pointer bg-white dark:bg-slate-900"
            >
              <option value="">All Call States</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary text-xs py-2 w-full font-bold uppercase tracking-wider cursor-pointer"
          >
            Filter Logs
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="saas-card bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Call ID</th>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Parent Called</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">ESP32 Device</th>
                <th className="px-6 py-3.5">Start Time</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading call history...</td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400 font-bold">No call history logs found.</td>
                </tr>
              ) : (
                calls.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-400">#{c.id}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{c.student?.name}</span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 capitalize">{c.parent_type}</td>
                    <td className="px-6 py-3.5 font-bold text-primary-500 dark:text-primary-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={10} />
                        <span>{c.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400">{c.device?.name || "Gate A Entrance"}</td>
                    <td className="px-6 py-3.5 text-slate-400 dark:text-slate-500 font-semibold">{formatDateTime(c.call_start)}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-650 dark:text-slate-350">{formatDuration(c.duration)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase inline-flex items-center gap-1 border ${
                        c.status === "completed" 
                          ? "bg-primary-50 text-primary-600 border-primary-100/40 dark:bg-primary-950/20 dark:text-primary-400" 
                          : "bg-danger-50 text-danger-600 border-danger-100/45 dark:bg-danger-950/20 dark:text-danger-400"
                      }`}>
                        {c.status === "completed" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        <span>{c.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
