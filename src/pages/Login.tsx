import React, { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Decorative background grid and flows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      
      {/* Left side wavy outlines */}
      <svg className="absolute -left-10 bottom-0 w-96 h-96 text-primary-500/10 dark:text-primary-500/5 pointer-events-none hidden md:block" viewBox="0 0 200 200">
        <path d="M 0,200 C 40,160 80,180 120,140 C 160,100 180,120 200,80" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 0,210 C 40,170 80,190 120,150 C 160,110 180,130 200,90" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 0,220 C 40,180 80,200 120,160 C 160,120 180,140 200,100" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      
      {/* Right side wavy outlines */}
      <svg className="absolute -right-10 bottom-0 w-96 h-96 text-accent-500/10 dark:text-accent-500/5 pointer-events-none hidden md:block" viewBox="0 0 200 200">
        <path d="M 200,200 C 160,160 120,180 80,140 C 40,100 20,120 0,80" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 200,210 C 160,170 120,190 80,150 C 40,110 20,130 0,90" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 200,220 C 160,180 120,200 80,160 C 40,120 20,140 0,100" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      {/* Background Dot Grids */}
      <div className="absolute left-10 top-16 opacity-20 dark:opacity-10 pointer-events-none hidden lg:block text-slate-400">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor">
          <circle cx="5" cy="5" r="1.5" /><circle cx="20" cy="5" r="1.5" /><circle cx="35" cy="5" r="1.5" /><circle cx="50" cy="5" r="1.5" />
          <circle cx="5" cy="15" r="1.5" /><circle cx="20" cy="15" r="1.5" /><circle cx="35" cy="15" r="1.5" /><circle cx="50" cy="15" r="1.5" />
          <circle cx="5" cy="25" r="1.5" /><circle cx="20" cy="25" r="1.5" /><circle cx="35" cy="25" r="1.5" /><circle cx="50" cy="25" r="1.5" />
          <circle cx="5" cy="35" r="1.5" /><circle cx="20" cy="35" r="1.5" /><circle cx="35" cy="35" r="1.5" /><circle cx="50" cy="35" r="1.5" />
        </svg>
      </div>
      <div className="absolute right-10 top-16 opacity-20 dark:opacity-10 pointer-events-none hidden lg:block text-slate-400">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor">
          <circle cx="5" cy="5" r="1.5" /><circle cx="20" cy="5" r="1.5" /><circle cx="35" cy="5" r="1.5" /><circle cx="50" cy="5" r="1.5" />
          <circle cx="5" cy="15" r="1.5" /><circle cx="20" cy="15" r="1.5" /><circle cx="35" cy="15" r="1.5" /><circle cx="50" cy="15" r="1.5" />
          <circle cx="5" cy="25" r="1.5" /><circle cx="20" cy="25" r="1.5" /><circle cx="35" cy="25" r="1.5" /><circle cx="50" cy="25" r="1.5" />
          <circle cx="5" cy="35" r="1.5" /><circle cx="20" cy="35" r="1.5" /><circle cx="35" cy="35" r="1.5" /><circle cx="50" cy="35" r="1.5" />
        </svg>
      </div>

      {/* Floating Decorative Circle - Telephone (Left) */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-primary-50/60 to-primary-100/20 dark:from-primary-950/20 dark:to-primary-900/5 border border-primary-100/30 dark:border-primary-900/10 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-primary-100/40 dark:bg-primary-900/20 flex items-center justify-center text-primary-400 dark:text-primary-500">
          <PhoneCall size={28} className="animate-pulse" />
        </div>
      </div>

      {/* Floating Decorative Circle - Parent/Child (Right) */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-accent-50/60 to-accent-100/20 dark:from-accent-950/20 dark:to-accent-900/5 border border-accent-100/30 dark:border-accent-900/10 shadow-xs">
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-accent-400 dark:text-accent-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="35" r="10" />
          <path d="M20,68 C20,53 30,48 40,48 C50,48 60,53 60,68" />
          <circle cx="68" cy="48" r="7" />
          <path d="M54,75 C54,64 61,60 68,60 C75,60 82,64 82,75" />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-xl z-10 animate-slide-up">
        <div className="saas-card bg-white dark:bg-slate-900 p-10 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 shadow-sm mb-4">
              <div className="w-5 h-5 rounded-full bg-accent-500/10 dark:bg-accent-500/20 flex items-center justify-center text-accent-600 dark:text-accent-400">
                <Shield size={12} className="stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                <span className="text-accent-500 dark:text-accent-400">IMPACT ARROWS</span>
                <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
                <span>SPCS Gateway</span>
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Smart Parent Calling
            </h1>
            
            {/* Design Line Separator */}
            <div className="flex items-center justify-center gap-3 mt-4 mb-2">
              <span className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-primary-500" />
              <span className="w-2 h-2 rounded-full bg-accent-500 shadow-xs" />
              <span className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-primary-500" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-primary-500 dark:text-primary-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 rounded-l-xl">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input !pl-16 !py-3.5 rounded-xl text-sm border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-primary-500 dark:text-primary-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 rounded-l-xl">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input !pl-16 pr-12 !py-3.5 rounded-xl text-sm border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-white dark:focus:ring-offset-slate-900 cursor-pointer"
              />
              <label htmlFor="remember_me" className="ml-2.5 block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 select-none cursor-pointer uppercase tracking-widest">
                Remember my console
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 active:scale-[0.98] rounded-xl text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} className="stroke-[2.5]" />
                  <span>Access Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Divider Badge */}
          <div className="relative flex items-center justify-center my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800/60" />
            </div>
            <div className="relative w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 flex items-center justify-center text-primary-500 shadow-xs">
              <Shield size={12} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="flex justify-center items-center gap-4 text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            <span>Secure</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            <span>Reliable</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
