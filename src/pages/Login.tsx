import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, Eye, EyeOff, Loader2, Shield, LogIn, PhoneCall, Bell, Wifi, Activity } from "lucide-react";

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

  // Live telemetry stream state
  const [telemetry, setTelemetry] = useState([
    { id: 1, type: "rfid", message: "RFID Swiped: Albie (Grade 5)", time: "Just now", status: "success" },
    { id: 2, type: "call", message: "Calling Parent: Dad (+1-555-0192)", time: "2m ago", status: "pending" },
    { id: 3, type: "device", message: "Station Gate 2: Online", time: "5m ago", status: "active" },
  ]);

  // Periodic simulated alerts for eye-catching visualization
  useEffect(() => {
    const eventPool = [
      { type: "rfid", message: "RFID Swiped: Sarah Vance (Grade 3)", status: "success" },
      { type: "call", message: "Calling Parent: Mom (+1-555-0248)", status: "success" },
      { type: "rfid", message: "RFID Swiped: James Carter (Grade 6)", status: "success" },
      { type: "device", message: "Station Main Entry: Online", status: "active" },
      { type: "call", message: "Parent Notified: Lucas (Grade 2)", status: "success" },
      { type: "call", message: "Calling Parent: Dad (+1-555-0811)", status: "pending" },
      { type: "rfid", message: "RFID Swiped: Emma Stone (Grade 4)", status: "success" },
      { type: "device", message: "Station Play Area: Connected", status: "active" },
    ];

    const interval = setInterval(() => {
      const nextEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      setTelemetry(prev => {
        const newEvent = {
          id: Date.now(),
          type: nextEvent.type,
          message: nextEvent.message,
          time: "Just now",
          status: nextEvent.status
        };
        const updatedPrev = prev.map(item => {
          let nextTime = item.time;
          if (item.time === "Just now") {
            nextTime = "1m ago";
          } else if (item.time.includes("m ago")) {
            const mins = parseInt(item.time);
            nextTime = `${mins + 1}m ago`;
          }
          return { ...item, time: nextTime };
        });
        return [newEvent, ...updatedPrev.slice(0, 2)];
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

  const fillDemo = (role: 'admin' | 'teacher') => {
    if (role === 'admin') {
      setEmail("admin@spcs.com");
      setPassword("Admin@123");
      addToast("success", "Filled credentials for School Admin");
    } else {
      setEmail("teacher1@spcs.com");
      setPassword("Teacher@123");
      addToast("success", "Filled credentials for Teacher");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Decorative floating blobs (right pane background area) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none hidden lg:block animate-float" />
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none hidden lg:block animate-float-reverse" />

      {/* Left Column - Branding & Telemetry (Visible only on lg viewport) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        
        {/* Tech Grid Background Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]" 
        />
        
        {/* Glow blob behind left side */}
        <div className="absolute top-[20%] left-[-20%] w-80 h-80 bg-primary-500/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-20%] w-80 h-80 bg-accent-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Section: Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <PhoneCall size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-widest uppercase text-slate-400">
                IMPACT ARROWS
              </h3>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
                Calling System
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-3xl font-black tracking-tight leading-tight text-white animate-fade-in">
              Smart Parent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Calling Panel
              </span>
            </h1>
            <p className="text-sm text-slate-450 mt-4 leading-relaxed font-medium">
              Bridge the distance and ensure seamless student pickup coordination. Swiping cards automatically pages parents instantly.
            </p>
          </div>
        </div>

        {/* Middle Section: Active Calling Pulsing Waves & Mock Telemetry */}
        <div className="relative z-10 my-auto py-6">
          
          {/* Animated concentric rings */}
          <div className="relative flex items-center justify-center py-6 mb-8">
            <div className="absolute w-44 h-44 rounded-full bg-primary-500/5 animate-ping duration-3000" />
            <div className="absolute w-32 h-32 rounded-full bg-accent-500/5 animate-pulse duration-2000" />
            <div className="absolute w-40 h-40 rounded-full border border-dashed border-slate-800 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-28 h-28 rounded-full border border-dashed border-primary-500/30 animate-[spin_20s_linear_infinite_reverse]" />
            
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-0.5 shadow-lg shadow-primary-500/20">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-primary-400">
                <PhoneCall size={24} className="animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Telemetry Alerts */}
          <div className="space-y-3 max-w-xs mx-auto">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Calling Gateway
            </div>
            
            <div className="space-y-2.5">
              {telemetry.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:bg-slate-850/80 animate-slide-up"
                >
                  <div className={`p-1.5 rounded-lg ${
                    item.type === 'rfid' ? 'bg-primary-500/10 text-primary-400' :
                    item.type === 'call' ? 'bg-accent-500/10 text-accent-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {item.type === 'rfid' ? <Activity size={14} /> :
                     item.type === 'call' ? <PhoneCall size={14} /> :
                     <Wifi size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.message}</p>
                    <span className="text-[9px] font-bold text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Metrics info */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-center">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Pickup Speed</p>
              <p className="text-base font-black text-white mt-1">2.4m</p>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Alert Rate</p>
              <p className="text-base font-black text-white mt-1">99.8%</p>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Gateway</p>
              <p className="text-xs font-black text-green-400 mt-1.5 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ONLINE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form Card */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex items-center justify-center p-6 md:p-12 relative bg-slate-50/50 dark:bg-slate-950">
        
        {/* Extra floating glow for smaller screens */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none lg:hidden" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none lg:hidden" />

        <div className="w-full max-w-md z-10 animate-slide-up">
          
          {/* Main Card */}
          <div className="backdrop-blur-md bg-white/85 dark:bg-slate-900/80 p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-primary-500/5 dark:hover:shadow-primary-500/2">
            
            {/* Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-sm mb-4">
                <div className="w-4 h-4 rounded-full bg-accent-500/10 dark:bg-accent-500/20 flex items-center justify-center text-accent-600 dark:text-accent-400">
                  <Shield size={10} className="stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  <span className="text-accent-500 dark:text-accent-400">IMPACT ARROWS</span>
                  <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                  <span>Console Access</span>
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5">
                Sign in to manage RFIDs, Parents, & Calling terminals
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r transition-all duration-200 rounded-l-xl ${
                    emailFocused 
                      ? 'text-primary-500 bg-primary-50/50 dark:bg-primary-950/20 border-primary-500' 
                      : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
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
                        ? 'border-primary-500 ring-2 ring-primary-500/10' 
                        : 'border-slate-200/80 dark:border-slate-800'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
                    placeholder="name@school.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r transition-all duration-200 rounded-l-xl ${
                    passwordFocused 
                      ? 'text-primary-500 bg-primary-50/50 dark:bg-primary-950/20 border-primary-500' 
                      : 'text-slate-400 dark:text-slate-550 bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
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
                        ? 'border-primary-500 ring-2 ring-primary-500/10' 
                        : 'border-slate-200/80 dark:border-slate-800'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
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
                  className="h-4 w-4 rounded border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-850 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-white dark:focus:ring-offset-slate-900 cursor-pointer"
                />
                <label htmlFor="remember_me" className="ml-2.5 block text-[10px] font-extrabold text-slate-450 dark:text-slate-550 select-none cursor-pointer uppercase tracking-widest">
                  Remember this browser
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 active:scale-[0.98] rounded-xl text-sm font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="stroke-[2.5]" />
                    <span>Access Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Filler */}
            <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800/60">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-center text-slate-400 dark:text-slate-500 mb-3">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-primary-50/40 dark:hover:bg-primary-950/10 hover:border-primary-500/50 dark:hover:border-primary-500/40 transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 group-hover:text-primary-500 transition-colors">
                    School Admin
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-full">
                    admin@spcs.com
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => fillDemo('teacher')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-accent-50/40 dark:hover:bg-accent-950/10 hover:border-accent-500/50 dark:hover:border-accent-500/40 transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 group-hover:text-accent-500 transition-colors">
                    Teacher Panel
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-full">
                    teacher1@spcs.com
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="flex justify-center items-center gap-3 mt-6 text-[8px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              <span>Secure Connection</span>
              <span className="w-1 h-1 rounded-full bg-accent-500" />
              <span>TLS 1.3</span>
              <span className="w-1 h-1 rounded-full bg-accent-500" />
              <span>SPCS v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

