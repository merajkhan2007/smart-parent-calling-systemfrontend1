import React from "react";
import { Cpu, Wifi, Battery, Signal, RefreshCw } from "lucide-react";

interface Device {
  id: number;
  device_id: string;
  name: string;
  location?: string;
  classroom?: string;
  wifi_signal?: number;
  battery_status?: number;
  sim_network?: string;
  status: string; // online, offline
  current_status_message: string; // RFID Waiting, Card Scanned, Calling, Connected, Call Ended, Offline
  mac_address?: string;
}

interface LiveStatusGridProps {
  devices: Device[];
  onRestart: (deviceId: string) => void;
  loading?: boolean;
}

export const LiveStatusGrid: React.FC<LiveStatusGridProps> = ({ devices, onRestart, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="saas-card bg-white dark:bg-slate-900 p-6 shimmer-bg animate-pulse h-40"></div>
        ))}
      </div>
    );
  }

  const getStatusColor = (msg: string) => {
    const formatted = msg?.toLowerCase();
    if (formatted === "calling") {
      return "bg-warning-55 bg-amber-50 text-warning-600 border border-warning-100/50 dark:bg-warning-950/20 dark:border-warning-900/30 dark:text-warning-450";
    }
    if (formatted === "connected") {
      return "bg-success-50 text-success-600 border border-success-100/50 dark:bg-success-950/20 dark:border-success-900/30 dark:text-success-400 animate-pulse";
    }
    if (formatted === "card scanned") {
      return "bg-primary-50 text-primary-600 border border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30 dark:text-primary-400";
    }
    if (formatted === "call ended") {
      return "bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
    }
    if (formatted === "rfid waiting") {
      return "bg-primary-50 text-primary-500 border border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30 dark:text-primary-400";
    }
    return "bg-danger-50 text-danger-600 border border-danger-100/50 dark:bg-danger-950/20 dark:border-danger-900/30 dark:text-danger-400";
  };

  const getWifiIcon = (signal?: number) => {
    if (!signal) return <Wifi size={12} className="text-slate-300" />;
    if (signal > -50) return <Wifi size={12} className="text-success-500" />;
    if (signal > -70) return <Wifi size={12} className="text-primary-500" />;
    return <Wifi size={12} className="text-warning-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-850 dark:text-slate-100 tracking-tight uppercase">Live Hardware Status</h3>
        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md">
          Live Gateway Connections
        </span>
      </div>

      {devices.length === 0 ? (
        <div className="saas-card bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-xs font-semibold">
          No ESP32 Devices registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className={`saas-card bg-white dark:bg-slate-900 p-5 transition-all duration-200 ${
                dev.status === "offline" ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${dev.status === "online" ? "bg-primary-50 text-primary-500 border-primary-100 dark:bg-primary-950/20 dark:border-primary-900/30" : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700"}`}>
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{dev.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{dev.classroom || "No classroom"}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusColor(dev.current_status_message)}`}>
                  {dev.current_status_message}
                </span>
              </div>

              {/* Hardware diagnostics metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 mb-3 text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  {getWifiIcon(dev.wifi_signal)}
                  <span className="text-slate-650 dark:text-slate-350">{dev.wifi_signal ? `${dev.wifi_signal} dBm` : "No WiFi"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Battery size={12} className={dev.battery_status && dev.battery_status < 20 ? "text-danger-500" : "text-slate-400"} />
                  <span className="text-slate-650 dark:text-slate-350">{dev.battery_status !== undefined ? `${dev.battery_status}%` : "No Batt"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Signal size={12} className="text-slate-400" />
                  <span className="truncate text-slate-650 dark:text-slate-350">{dev.sim_network || "No LTE"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold truncate">MAC: {dev.mac_address || "N/A"}</span>
                {dev.status === "online" && (
                  <button
                    onClick={() => onRestart(dev.device_id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 dark:border-slate-750 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw size={10} />
                    <span>Restart</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
