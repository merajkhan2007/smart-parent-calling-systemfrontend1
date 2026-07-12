import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";
import { useToast } from "../context/ToastContext";
import { StatCard } from "../components/StatCard";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { LiveStatusGrid } from "../components/LiveStatusGrid";
import { 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  Scan, 
  Cpu,
  RefreshCw,
  XCircle,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";

const formatTimelineTime = (dateStr: string) => {
  if (!dateStr) return "";
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(utcStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

const formatDuration = (seconds: number) => {
  if (seconds === undefined || seconds === null) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export const Dashboard: React.FC = () => {
  const { apiFetch, selectedSchoolId } = useAuth();
  const { lastEvent } = useWebSocket();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [activeSettings, setActiveSettings] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    total_students: 0,
    today_calls: 0,
    successful_calls: 0,
    rejected_calls: 0,
    call_duration_today: 0,
    rfid_scans_today: 0,
    online_devices: 0,
    offline_devices: 0,
    activity_timeline: [],
    recent_calls: [],
    daily_calls: []
  });
  
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch("/api/reports/call-statistics"); // backend stats
      const devData = await apiFetch("/api/device/status"); // device lists
      const dbStats = await apiFetch("/api/rfid/scan-history"); // scan count
      const callData = await apiFetch("/api/call/?limit=5"); // latest calls
      const studentsData = await apiFetch("/api/students/?limit=1"); // total students
      const settingsData = await apiFetch("/api/settings/"); // dynamic branding
      
      setActiveSettings(settingsData);

      // Parse scans for timeline
      const timelineScans = (dbStats || []).map((s: any) => {
        const utcStr = s.timestamp && !s.timestamp.endsWith("Z") ? `${s.timestamp}Z` : s.timestamp;
        return {
          id: `scan-${s.id}`,
          type: "scan",
          time: formatTimelineTime(s.timestamp),
          title: `RFID Scanned - ${s.student_name}`,
          subtitle: `Class: ${s.class_section} | Card: ${s.rfid_uid}`,
          tag: s.status,
          rawTime: utcStr ? new Date(utcStr).getTime() : 0
        };
      });

      // Parse calls for timeline
      const timelineCalls = (callData.calls || []).map((c: any) => {
        const utcStr = c.call_start && !c.call_start.endsWith("Z") ? `${c.call_start}Z` : c.call_start;
        return {
          id: `call-${c.id}`,
          type: "call",
          time: formatTimelineTime(c.call_start),
          title: `Call to {c.parent_type} of {c.student?.name}`,
          subtitle: `Status: ${c.status} | Duration: ${formatDuration(c.duration)}`,
          tag: c.status,
          rawTime: utcStr ? new Date(utcStr).getTime() : 0
        };
      });

      // Sort and slice combined timeline
      const combinedTimeline = [...timelineScans, ...timelineCalls]
        .sort((a: any, b: any) => b.rawTime - a.rawTime)
        .slice(0, 5);

      setStats({
        total_students: studentsData.total || 0,
        today_calls: data.daily_calls[data.daily_calls.length - 1]?.value || 0,
        successful_calls: data.status_distribution.find((d: any) => d.label === "completed")?.value || 0,
        rejected_calls: data.status_distribution.find((d: any) => d.label === "failed" || d.label === "rejected")?.value || 0,
        call_duration_today: Math.round(data.call_duration_average * (data.daily_calls[data.daily_calls.length - 1]?.value || 0)),
        rfid_scans_today: dbStats.length || 0,
        online_devices: devData.online_count ?? 0,
        offline_devices: devData.offline_count ?? 0,
        activity_timeline: combinedTimeline,
        recent_calls: [],
        daily_calls: data.daily_calls || []
      });
      
      setDevices(devData.devices || []);
    } catch (err: any) {
      setStats({
        total_students: 0,
        today_calls: 0,
        successful_calls: 0,
        rejected_calls: 0,
        call_duration_today: 0,
        rfid_scans_today: 0,
        online_devices: 0,
        offline_devices: 0,
        activity_timeline: [],
        recent_calls: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedSchoolId]);

  // Handle incoming live websocket notifications
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.event === "rfid_scanned") {
      if (lastEvent.status === "success") {
        addToast("success", `RFID Scanned: ${lastEvent.student_name} (${lastEvent.class})`);
      } else if (lastEvent.status === "blocked") {
        addToast("error", `BLOCKED Student card scanned: ${lastEvent.student_name}`);
      } else {
        addToast("warning", `Unknown card scanned: UID ${lastEvent.uid}`);
      }
      fetchDashboardData();
    }

    if (lastEvent.event === "call_started") {
      addToast("info", `Call Started to ${lastEvent.parent_type} of ${lastEvent.student_name}`);
      fetchDashboardData();
    }

    if (lastEvent.event === "call_connected") {
      addToast("success", `Call Answered by parent of ${lastEvent.student_name}`);
      fetchDashboardData();
    }

    if (lastEvent.event === "call_ended") {
      const type = lastEvent.status === "completed" ? "success" : "error";
      addToast(type, `Call ended for ${lastEvent.student_name}. Status: ${lastEvent.status}`);
      fetchDashboardData();
    }

    if (lastEvent.event === "device_status_changed") {
      fetchDashboardData();
    }
  }, [lastEvent]);

  const handleRestartDevice = async (deviceId: string) => {
    try {
      await apiFetch(`/api/device/restart/${deviceId}`, { method: "POST" });
      addToast("info", `Restart command sent to ${deviceId}`);
    } catch (e: any) {
      addToast("error", `Could not trigger restart: ${e.message}`);
    }
  };

  const currentSchoolName = activeSettings?.school_name || "Calling Gateway";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top dashboard summary header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{currentSchoolName} Console</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Smart calling gate and live RFID diagnostic center.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchDashboardData}
            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh State</span>
          </button>
          <Link
            to="/students"
            className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
          >
            <UserPlus size={12} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total_students}
          icon={Users}
          color="bg-primary-500"
          loading={loading}
        />
        <StatCard
          title="Today's Calls"
          value={stats.today_calls}
          icon={PhoneCall}
          color="bg-primary-500"
          loading={loading}
          trend={{ value: 12.4, isPositive: true }}
        />
        <StatCard
          title="Successful Calls"
          value={stats.successful_calls}
          icon={CheckCircle2}
          color="bg-emerald-500"
          loading={loading}
          progress={stats.today_calls > 0 ? (stats.successful_calls / stats.today_calls) * 100 : 70}
        />
        <StatCard
          title="Call Duration Today"
          value={`${Math.round(stats.call_duration_today / 60)} min`}
          icon={Clock}
          color="bg-warning-500"
          loading={loading}
        />
      </div>

      {/* Device hardware and RFID status stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="RFID Scans Today"
          value={stats.rfid_scans_today}
          icon={Scan}
          color="bg-primary-500"
          loading={loading}
        />
        <StatCard
          title="Online Devices"
          value={stats.online_devices}
          icon={Cpu}
          color="bg-emerald-500"
          loading={loading}
        />
        <StatCard
          title="Offline Devices"
          value={stats.offline_devices}
          icon={Cpu}
          color="bg-danger-500"
          loading={loading}
        />
        <StatCard
          title="Rejected Calls"
          value={stats.rejected_calls}
          icon={XCircle}
          color="bg-danger-500"
          loading={loading}
        />
      </div>

      {/* Graph and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom drawn high-end SVG Chart Widget */}
        <div className="lg:col-span-2 saas-card bg-white dark:bg-slate-900 p-6 flex flex-col justify-between min-h-[350px] relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-100 uppercase">Weekly Call Trends</h3>
              <p className="text-2xs text-slate-400 dark:text-slate-500 font-semibold">Daily calling traffic volume (last 7 days)</p>
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
              Live Feed
            </span>
          </div>

          <div className="relative flex-grow flex items-end justify-between h-48 gap-3 pt-6 border-b border-slate-100 dark:border-slate-850">
            {/* Grid lines */}
            <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full h-0"></div>
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full h-0"></div>
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full h-0"></div>
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full h-0"></div>
            </div>
            
            {(() => {
              const maxVal = Math.max(...(stats.daily_calls || []).map((d: any) => d.value), 5);
              return (stats.daily_calls || []).map((col: any, idx: number) => {
                const heightPercent = (col.value / maxVal) * 85;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end z-10">
                    <div className="flex items-end gap-1.5 w-full justify-center h-[90%]">
                      {/* Calls bar */}
                      <div 
                        className="w-5 bg-gradient-to-t from-primary-500 to-primary-600 rounded-t-[4px] group-hover:from-accent-500 group-hover:to-accent-600 transition-all duration-200 relative"
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-md font-bold">
                          Calls: {col.value}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold select-none">{col.label}</span>
                  </div>
                );
              });
            })()}
          </div>

          <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-primary-500"></span>
              <span>Total Voice Calls</span>
            </div>
          </div>
        </div>

        {/* Timeline Widget */}
        <ActivityTimeline activities={stats.activity_timeline} loading={loading} />
      </div>

      {/* Live Device Status Monitor Grid */}
      <LiveStatusGrid devices={devices} onRestart={handleRestartDevice} loading={loading} />
    </div>
  );
};
