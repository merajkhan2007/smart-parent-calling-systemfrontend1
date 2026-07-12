import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Cpu, RefreshCw, ArrowUpCircle, Wifi, Battery, Signal, Plus, X, Edit2, Trash2 } from "lucide-react";

export const Devices: React.FC = () => {
  const { apiFetch, user } = useAuth();
  const { addToast } = useToast();

  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Register / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"register" | "edit">("register");
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  // Form Fields
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceLoc, setDeviceLoc] = useState("");
  const [deviceClassroom, setDeviceClassroom] = useState("");

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/device/");
      setDevices(data || []);
    } catch (e: any) {
      setDevices([]);
      addToast("error", e.message || "Failed to load registered gates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRestart = async (id: string) => {
    try {
      await apiFetch(`/api/device/restart/${id}`, { method: "POST" });
      addToast("success", `Restart command transmitted to ${id}`);
      fetchDevices();
    } catch (e: any) {
      addToast("error", `Could not trigger restart: ${e.message}`);
    }
  };

  const handleOta = async (id: string) => {
    if (!window.confirm("Do you want to transmit OTA firmware update payload? This might restart the scanner.")) return;
    try {
      await apiFetch(`/api/device/ota/${id}`, { method: "POST" });
      addToast("info", `OTA instruction pushed to ${id}`);
    } catch (e: any) {
      addToast("error", `Firmware transmit failed: ${e.message}`);
    }
  };

  const openRegisterModal = () => {
    setModalMode("register");
    setSelectedDevice(null);
    setDeviceName("");
    setDeviceId("");
    setDeviceLoc("");
    setDeviceClassroom("");
    setIsModalOpen(true);
  };

  const openEditModal = (d: any) => {
    setModalMode("edit");
    setSelectedDevice(d);
    setDeviceName(d.name);
    setDeviceId(d.device_id);
    setDeviceLoc(d.location || "");
    setDeviceClassroom(d.classroom || "");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !deviceId) {
      addToast("warning", "Specify device identifier and name");
      return;
    }

    try {
      if (modalMode === "register") {
        await apiFetch("/api/device/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            name: deviceName,
            location: deviceLoc,
            classroom: deviceClassroom
          })
        });
        addToast("success", "Device successfully registered!");
      } else {
        await apiFetch(`/api/device/${selectedDevice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            name: deviceName,
            location: deviceLoc,
            classroom: deviceClassroom
          })
        });
        addToast("success", "Device configurations updated");
      }
      setIsModalOpen(false);
      fetchDevices();
    } catch (err: any) {
      addToast("error", err.message || "Failed to update gateway registry");
    }
  };

  const handleDeleteDevice = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this hardware node from database?")) return;
    try {
      await apiFetch(`/api/device/${id}`, { method: "DELETE" });
      addToast("success", "Device successfully unregistered");
      fetchDevices();
    } catch (e: any) {
      addToast("error", "Failed to remove hardware node");
    }
  };

  const getWifiIcon = (signal?: number) => {
    if (!signal) return <Wifi size={13} className="text-slate-300" />;
    if (signal > -50) return <Wifi size={13} className="text-success-500" />;
    if (signal > -70) return <Wifi size={13} className="text-primary-500" />;
    return <Wifi size={13} className="text-warning-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ESP32 Hardware Gates</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Monitor hardware diagnostics, transmit OTA firmware, and restart remote calling gateways.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchDevices}
            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Sync Hardware</span>
          </button>
          {(user?.role === "Super Admin" || user?.role === "School Admin") && (
            <button
              onClick={openRegisterModal}
              className="btn-primary text-[11px] py-1.5 px-3.5 flex items-center gap-1.5"
            >
              <Plus size={12} />
              <span>Register Gateway</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="saas-card p-6 h-48 shimmer-bg animate-pulse"></div>
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="saas-card bg-white dark:bg-slate-900 border border-dashed p-10 text-center text-slate-400 font-semibold text-xs uppercase tracking-wider">
          No hardware gates registered in this school profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((d) => (
            <div key={d.id} className="saas-card bg-white dark:bg-slate-900 p-6 flex flex-col justify-between relative">
              <div>
                <div className="flex items-start justify-between gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${d.status === "online" ? "bg-primary-50 border-primary-100/50 text-primary-500 dark:bg-primary-950/20 dark:border-primary-900/30" : "bg-slate-50 border-slate-100 text-slate-450 dark:bg-slate-800 dark:border-slate-700"}`}>
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-850 dark:text-slate-200">{d.name}</h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Class: {d.classroom || "N/A"}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    d.status === "online" ? "bg-success-50 text-success-600 border border-success-100/50 dark:bg-success-950/20 dark:text-success-400" : "bg-danger-50 text-danger-600 border border-danger-100/50 dark:bg-danger-950/20 dark:text-danger-400"
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 text-2xs text-slate-400 dark:text-slate-500 font-bold mb-4 uppercase tracking-wider">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold text-slate-400/80 tracking-widest">Signal</span>
                    <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350">
                      {getWifiIcon(d.wifi_signal)}
                      <span>{d.wifi_signal ? `${d.wifi_signal} dBm` : "Offline"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-x border-slate-200/55 dark:border-slate-800/60 px-3">
                    <span className="text-[8px] font-bold text-slate-400/80 tracking-widest">Battery</span>
                    <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350">
                      <Battery size={13} className="text-slate-400" />
                      <span>{d.battery_status !== undefined ? `${d.battery_status}%` : "No Batt"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pl-1">
                    <span className="text-[8px] font-bold text-slate-400/80 tracking-widest">LTE Band</span>
                    <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350">
                      <Signal size={13} className="text-slate-400" />
                      <span className="truncate max-w-[50px]">{d.sim_network || "No LTE"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-2xs text-slate-500 dark:text-slate-400 font-semibold mb-4 border-b border-slate-100 dark:border-slate-800/85 pb-4">
                  <div className="flex justify-between">
                    <span>Hardware Node ID:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{d.device_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MAC Address:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{d.mac_address || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firmware version:</span>
                    <span className="font-bold text-primary-500">{d.firmware_version || "1.0.0"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(d)}
                  className="flex-1 btn-secondary py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} />
                  <span>Configure</span>
                </button>
                {d.status === "online" && (
                  <>
                    <button
                      onClick={() => handleRestart(d.device_id)}
                      className="flex-1 btn-secondary py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer text-warning-600 hover:bg-warning-50 hover:border-warning-100 border-warning-100/50 dark:border-warning-900/30"
                    >
                      <RefreshCw size={11} />
                      <span>Restart</span>
                    </button>
                    <button
                      onClick={() => handleOta(d.device_id)}
                      className="flex-1 btn-primary py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowUpCircle size={11} />
                      <span>OTA Push</span>
                    </button>
                  </>
                )}
                {user?.role === "Super Admin" && (
                  <button
                    onClick={() => handleDeleteDevice(d.id)}
                    className="p-1.5 rounded-lg border border-danger-100 bg-danger-50 hover:bg-danger-100 text-danger-500 dark:bg-danger-950/20 dark:border-danger-900/30 transition-colors cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100">{modalMode === "register" ? "Register calling gateway" : "Configure Calling Node"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Gateway Nickname</label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="e.g. Entrance Gate A Dialer"
                  className="premium-input text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">ESP32 Device Identifier</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="ESP32_DIALER_01"
                  className="premium-input text-xs py-2"
                  disabled={modalMode === "edit"}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Installation Location</label>
                <input
                  type="text"
                  value={deviceLoc}
                  onChange={(e) => setDeviceLoc(e.target.value)}
                  placeholder="e.g. North Wing Entrance"
                  className="premium-input text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold mb-1.5">Assigned Classroom</label>
                <input
                  type="text"
                  value={deviceClassroom}
                  onChange={(e) => setDeviceClassroom(e.target.value)}
                  placeholder="e.g. 5-A, Common Area"
                  className="premium-input text-xs py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 cursor-pointer font-bold"
                >
                  {modalMode === "register" ? "Register Node" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
