import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, Eye, EyeOff, Loader2, Shield, LogIn, PhoneCall, CreditCard, Wifi, Users, BarChart2 } from "lucide-react";
import schoolBg from "../assets/school_bg.png";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF8F5] dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300 relative">
      
      {/* Left Column - Branding & Features (School Background) */}
      <div 
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-cover bg-center text-white p-12 flex-col justify-between relative overflow-hidden pb-32"
        style={{ backgroundImage: `url(${schoolBg})` }}
      >
        {/* Dark Slate/Blue Overlay */}
        <div className="absolute inset-0 bg-slate-950/85 z-0" />
        
        {/* Logo and Brand Title */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-md">
              <PhoneCall size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-widest text-white uppercase leading-none">
                IMPACT ARROWS
              </h3>
              <span className="text-[9px] text-slate-400 font-bold tracking-wider block mt-1 uppercase">
                Smart Calling System
              </span>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Smart Parent <br />
              <span className="text-orange-500">Calling Panel</span>
            </h1>
            {/* Orange bar indicator */}
            <div className="w-16 h-1.5 bg-orange-500 mt-4 rounded-full" />
            <p className="text-sm text-slate-300 mt-6 leading-relaxed font-medium">
              Bridge the distance and ensure seamless student pickup coordination. Swiping cards automatically pages parents instantly.
            </p>
          </div>
        </div>

        {/* Feature List (Vertical) */}
        <div className="space-y-6 mt-6 z-10 relative">
          
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1E293B] border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <CreditCard size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">RFID Smart Check-In</h4>
              <p className="text-xs text-slate-400 mt-0.5">Students check in using RFID cards</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1E293B] border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <PhoneCall size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Instant Parent Calling</h4>
              <p className="text-xs text-slate-400 mt-0.5">Parents are called automatically</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1E293B] border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Wifi size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Live System Status</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time updates and gateway status</p>
            </div>
          </div>
        </div>

        {/* Bottom solid orange stats banner */}
        <div className="bg-[#ea580c] text-white p-6 absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-4 border-t border-orange-700/20 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-orange-100">Pickup Speed</p>
              <p className="text-sm font-black text-white mt-0.5">2.4m</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
              <BarChart2 size={18} />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-orange-100">Alert Rate</p>
              <p className="text-sm font-black text-white mt-0.5">99.8%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
              <Wifi size={18} />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-orange-100">Gateway</p>
              <p className="text-xs font-black text-emerald-300 mt-0.5 flex items-center gap-1">
                ONLINE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login form with abstract curves */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-7 flex items-center justify-center p-6 md:p-12 relative bg-[#FAF8F5] dark:bg-slate-950 min-h-screen">
        
        {/* Curved abstract orange waves in bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-full max-w-lg h-96 pointer-events-none z-0 opacity-40">
          <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M 150 500 Q 300 350 500 400" fill="none" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.25" />
            <path d="M 100 500 Q 280 320 500 360" fill="none" stroke="#F97316" strokeWidth="1" strokeOpacity="0.2" />
            <path d="M 50 500 Q 260 290 500 320" fill="none" stroke="#F97316" strokeWidth="1.2" strokeOpacity="0.15" />
            <path d="M 0 500 Q 240 260 500 280" fill="none" stroke="#F97316" strokeWidth="1" strokeOpacity="0.1" />
          </svg>
        </div>

        <div className="w-full max-w-md z-10 animate-slide-up">
          
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300">
            
            {/* Top lock icon circle badge */}
            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ea580c] mx-auto shadow-sm mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <Lock size={18} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Welcome
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5">
                Sign in to manage RFIDs, Parents & Calling terminals
              </p>

              {/* Line separator with orange dot */}
              <div className="flex items-center justify-center gap-3 my-5">
                <span className="h-[1px] w-full bg-slate-100 dark:bg-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                <span className="h-[1px] w-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all overflow-hidden bg-white dark:bg-slate-950">
                  <div className="w-12 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none focus:ring-0 placeholder-slate-400"
                    placeholder="name@school.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all overflow-hidden bg-white dark:bg-slate-950">
                  <div className="w-12 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-400 shrink-0">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 px-3.5 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none focus:ring-0 placeholder-slate-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center text-xs mt-4">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-orange-600 focus:ring-orange-500/20 cursor-pointer"
                />
                <label htmlFor="remember_me" className="ml-2 block text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                  Remember this browser
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ea580c] hover:bg-orange-700 text-white py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] rounded-xl text-sm font-bold shadow-md shadow-orange-500/10 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Accessing Console...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="stroke-[2.5]" />
                    <span>Access Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom secure layout connection banner */}
            <div className="flex justify-center items-center gap-2 mt-8 text-[10px] text-slate-400 font-medium">
              <Shield size={11} className="text-slate-400" />
              <span>Secure Connection</span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span>TLS 1.3</span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span>SPCS v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
