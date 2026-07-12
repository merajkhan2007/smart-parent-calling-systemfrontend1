import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, Eye, EyeOff, Loader2, Landmark } from "lucide-react";

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

  const handleForgotPassword = async () => {
    if (!email) {
      addToast("warning", "Please enter your email first");
      return;
    }
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        addToast("info", "Password reset instructions sent (simulated)");
      } else {
        addToast("error", "Email not registered");
      }
    } catch (e) {
      addToast("error", "Network error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-base dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Decorative luxury gradient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="saas-card bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
          {/* School branding header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center text-primary-500 dark:text-primary-400 mx-auto mb-4 border border-primary-100/50 dark:border-primary-900/50">
              <Landmark size={26} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Smart Parent Calling</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-wider">Oakridge SPCS Gateway</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input pl-10"
                  placeholder="admin@spcs.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-bold transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-450 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-white dark:focus:ring-offset-slate-900 cursor-pointer"
              />
              <label htmlFor="remember_me" className="ml-2 block text-2xs font-bold text-slate-400 dark:text-slate-500 select-none cursor-pointer uppercase tracking-wider">
                Remember my session
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Access Console</span>
              )}
            </button>
          </form>

          {/* Credentials tips */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Demo Credentials</span>
            <div className="flex justify-center gap-4 mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-455">
              <div>
                <span>Email: </span>
                <span className="font-bold text-slate-700 dark:text-slate-350">admin@spcs.com</span>
              </div>
              <div>
                <span>Password: </span>
                <span className="font-bold text-slate-700 dark:text-slate-350">Admin@123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
