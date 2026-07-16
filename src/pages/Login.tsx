import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, Eye, EyeOff, Loader2, Shield, LogIn, PhoneCall } from "lucide-react";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // High-Tech Console Logs state
  const [logs, setLogs] = useState([
    { time: "23:20:11", tag: "SYS", message: "SPCS Secure Gateway booting up...", type: "system" },
    { time: "23:20:12", tag: "RFID", message: "Listening for card scanner heartbeats", type: "info" },
    { time: "23:20:14", tag: "GATEWAY", message: "Connection established with Twilio Node", type: "success" },
  ]);

  // Periodic simulated alerts and log events
  useEffect(() => {
    const logPool = [
      { tag: "RFID", message: "Card read: ID_E89B10FC (Sarah Vance - Gr 3)", type: "info" },
      { tag: "GATEWAY", message: "SMS status: DISPATCHED to parent Mom", type: "success" },
      { tag: "RFID", message: "Card read: ID_B21A93D0 (James Carter - Gr 6)", type: "info" },
      { tag: "NODE", message: "Station Gate 1 terminal status: ACTIVE", type: "system" },
      { tag: "GATEWAY", message: "Paging parent: Dad (+1-555-0811)", type: "info" },
      { tag: "SYS", message: "Automated network health check completed", type: "system" },
      { tag: "RFID", message: "Card read: ID_C43D8A29 (Emma Stone - Gr 4)", type: "info" },
      { tag: "NODE", message: "Playground checkout node online", type: "success" }
    ];

    const interval = setInterval(() => {
      const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      setLogs(prev => {
        const newLog = {
          time: timeStr,
          tag: nextLog.tag,
          message: nextLog.message,
          type: nextLog.type
        };
        return [...prev.slice(1), newLog];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("warning", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      addToast("success", "Welcome to SPCS Calling Panel!");
      navigate("/");
    } catch (err: any) {
      addToast("error", err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#030712] font-sans overflow-hidden transition-colors duration-300 relative text-white">
      
      {/* Styles Injection for Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer-sweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes laser-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes laser-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
        .animate-shimmer-sweep {
          background-size: 200% 200%;
          animation: shimmer-sweep 4s ease infinite;
        }
        .laser-h {
          animation: laser-horizontal 8s linear infinite;
        }
        .laser-v {
          animation: laser-vertical 8s linear infinite;
        }
      `}</style>

      {/* Futuristic Laser-Grid Background */}
      <div className="absolute inset-0 bg-[#030712] pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full stroke-slate-900/60 opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cyber-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        </svg>

        {/* Laser streaks */}
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 laser-h" style={{ animationDelay: '0s', animationDuration: '7s' }} />
        <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/70 to-transparent opacity-40 laser-h" style={{ animationDelay: '2.5s', animationDuration: '9s' }} />
        <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-50 laser-h" style={{ animationDelay: '4.5s', animationDuration: '6s' }} />
        
        <div className="absolute top-0 left-[25%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/70 to-transparent opacity-40 laser-v" style={{ animationDelay: '1.2s', animationDuration: '8s' }} />
        <div className="absolute top-0 left-[70%] w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-30 laser-v" style={{ animationDelay: '3.2s', animationDuration: '9s' }} />
      </div>

      {/* Decorative colored blobs for ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-primary-500/5 blur-[130px] pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[-10%] right-[15%] w-[45%] h-[45%] rounded-full bg-accent-500/5 blur-[130px] pointer-events-none hidden lg:block" />

      {/* Left Column - Branding & Radar Telemetry */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-slate-950/80 backdrop-blur-md p-12 flex-col justify-between relative overflow-hidden border-r border-slate-900 z-10">
        
        {/* Top Branding Section */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-accent-500 p-[1px] shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center text-cyan-400">
                <PhoneCall size={18} />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-xs tracking-widest uppercase text-slate-400">
                IMPACT ARROWS
              </h3>
              <p className="text-[9px] text-slate-600 tracking-wider font-bold uppercase">
                SPCS TERMINAL
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h1 className="text-3xl font-black tracking-tight leading-tight text-white animate-fade-in">
              Secured Parent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-accent-400">
                Calling Console
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
              Next-generation centralized gateway for automated RFID student checkouts and real-time parent messaging.
            </p>
          </div>
        </div>

        {/* Middle Section: Rotating sweep radar */}
        <div className="my-auto py-8">
          
          <div className="relative w-52 h-52 mx-auto flex items-center justify-center mb-10">
            {/* Circular guides */}
            <div className="absolute inset-0 rounded-full border border-slate-900 bg-slate-950/40" />
            <div className="absolute w-40 h-40 rounded-full border border-slate-900/80" />
            <div className="absolute w-28 h-28 rounded-full border border-slate-900/60" />
            <div className="absolute w-16 h-16 rounded-full border border-slate-850" />
            
            {/* Radar sweep beam */}
            <div className="absolute inset-0 animate-scan origin-center pointer-events-none">
              <div 
                className="w-1/2 h-full border-r border-cyan-500/20 bg-gradient-to-l from-cyan-500/10 to-transparent" 
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 50%)' }} 
              />
            </div>

            {/* Radar active nodes */}
            <div className="absolute top-[16%] left-[28%] flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-40 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              <span className="absolute text-[7px] font-mono text-cyan-500 mt-4 tracking-tighter">GATE_01</span>
            </div>
            
            <div className="absolute bottom-[22%] left-[22%] flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-40 animate-ping" style={{ animationDelay: '0.8s' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="absolute text-[7px] font-mono text-emerald-500 mt-4 tracking-tighter">PLAY_STN</span>
            </div>

            <div className="absolute top-[40%] right-[18%] flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-40 animate-ping" style={{ animationDelay: '1.6s' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              <span className="absolute text-[7px] font-mono text-indigo-500 mt-4 tracking-tighter">MAIN_HALL</span>
            </div>

            {/* Central station dot */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-slate-955 border border-slate-900 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <PhoneCall size={14} className="animate-pulse" />
            </div>
          </div>

          {/* Console stream log window */}
          <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 font-mono text-[9px] text-slate-500 space-y-2 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 text-slate-600">
              <span className="tracking-widest">CONSOLE LOGS</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span>LIVE</span>
              </span>
            </div>
            <div className="space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-slate-700">{log.time}</span>
                  <span className={`font-extrabold ${
                    log.type === 'info' ? 'text-cyan-400' :
                    log.type === 'success' ? 'text-green-400' :
                    'text-indigo-400'
                  }`}>[{log.tag}]</span>
                  <span className="text-slate-350 truncate">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Net stats */}
        <div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-6 text-center">
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Response Speed</p>
              <p className="text-sm font-black text-slate-300 mt-1">2.4m</p>
            </div>
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Card Pings</p>
              <p className="text-sm font-black text-slate-300 mt-1">99.8%</p>
            </div>
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Console TLS</p>
              <p className="text-xs font-black text-green-400 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                1.3 SEC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login card */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex items-center justify-center p-6 md:p-12 relative z-10 bg-slate-950/20">
        
        {/* Extra back glow for smaller screens */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none lg:hidden" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-500/5 rounded-full blur-3xl pointer-events-none lg:hidden" />

        <div className="w-full max-w-md z-10 animate-slide-up">
          
          {/* Neon Border Glow Wrap */}
          <div className="relative p-[1.5px] rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800/40">
            {/* Spinning background conic gradient */}
            <div className="absolute -inset-[150px] bg-[conic-gradient(from_0deg,transparent_30%,#6366f1_45%,#06b6d4_55%,transparent_70%)] animate-spin-slow opacity-30 pointer-events-none" />
            
            {/* Inner Content Card */}
            <div className="relative backdrop-blur-xl bg-slate-950/70 p-8 md:p-10 rounded-[23px]">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-850 shadow-sm mb-4">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Shield size={10} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                    <span className="text-cyan-400">SECURITY PROTOCOL</span>
                    <span className="mx-1.5 text-slate-700">•</span>
                    <span>GATEWAY ENTRANCE</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white mt-1">
                  Console Access
                </h2>
                <p className="text-xs text-slate-500 mt-1.5">
                  Establish a secure connection session
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Session Email
                  </label>
                  <div className="relative flex items-center">
                    <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r transition-all duration-200 rounded-l-xl ${
                      emailFocused 
                        ? 'text-cyan-400 bg-cyan-950/10 border-cyan-500/50' 
                        : 'text-slate-500 bg-slate-950/30 border-slate-850'
                    }`}>
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className={`premium-input !pl-16 !py-3 rounded-xl text-sm transition-all duration-200 ${
                        emailFocused 
                          ? 'border-cyan-500/60 ring-2 ring-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                          : 'border-slate-850'
                      } bg-slate-950/50 text-slate-100 placeholder-slate-600`}
                      placeholder="session@school.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Access Cryptokey
                  </label>
                  <div className="relative flex items-center">
                    <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r transition-all duration-200 rounded-l-xl ${
                      passwordFocused 
                        ? 'text-cyan-400 bg-cyan-950/10 border-cyan-500/50' 
                        : 'text-slate-500 bg-slate-950/30 border-slate-850'
                    }`}>
                      <Lock size={15} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className={`premium-input !pl-16 pr-12 !py-3 rounded-xl text-sm transition-all duration-200 ${
                        passwordFocused 
                          ? 'border-cyan-500/60 ring-2 ring-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                          : 'border-slate-850'
                      } bg-slate-955/50 text-slate-100 placeholder-slate-600`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-slate-500 hover:text-slate-350 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-slate-955 cursor-pointer"
                  />
                  <label htmlFor="remember_me" className="ml-2.5 block text-[9px] font-extrabold text-slate-500 select-none cursor-pointer uppercase tracking-widest">
                    Persist Key Session
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-shimmer-sweep text-white py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] rounded-xl text-sm font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Initializing...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} className="stroke-[2.5]" />
                      <span>Establish Connection</span>
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Security Footer */}
              <div className="flex justify-center items-center gap-3 mt-8 text-[8px] font-extrabold tracking-widest text-slate-600 uppercase">
                <span>TLS 1.3 SECURE CONNECTION</span>
                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                <span>SPCS-CONSOLE v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
