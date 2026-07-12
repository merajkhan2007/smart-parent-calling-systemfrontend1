import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string; // bg-primary-500 etc
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "bg-primary-500",
  trend,
  loading = false,
  progress
}) => {
  if (loading) {
    return (
      <div className="saas-card bg-white dark:bg-slate-900 p-6 shimmer-bg animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20"></div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        </div>
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-16 mb-2"></div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
      </div>
    );
  }

  // Map backend color classes to premium SaaS style
  let iconStyle = "text-primary-500 bg-primary-50 dark:bg-primary-950/30 border border-primary-100/50 dark:border-primary-900/30";
  if (color.includes("emerald") || color.includes("success")) {
    iconStyle = "text-success-500 bg-success-50 dark:bg-success-950/30 border border-success-100/50 dark:border-success-900/30";
  } else if (color.includes("amber") || color.includes("warning")) {
    iconStyle = "text-warning-500 bg-warning-50 dark:bg-warning-950/30 border border-warning-100/50 dark:border-warning-900/30";
  } else if (color.includes("rose") || color.includes("danger") || color.includes("red")) {
    iconStyle = "text-danger-500 bg-danger-50 dark:bg-danger-950/30 border border-danger-100/50 dark:border-danger-900/30";
  } else if (color.includes("indigo") || color.includes("blue")) {
    iconStyle = "text-primary-500 bg-primary-50 dark:bg-primary-950/30 border border-primary-100/50 dark:border-primary-900/30";
  } else if (color.includes("orange") || color.includes("accent")) {
    iconStyle = "text-accent-500 bg-accent-50 dark:bg-accent-950/30 border border-accent-100/50 dark:border-accent-900/30";
  }

  const renderSparkline = (isPositive: boolean) => {
    const strokeColor = isPositive ? "text-success-500" : "text-danger-500";
    const path = isPositive
      ? "M0,8 Q5,2 10,6 T20,3 T30,8 T40,2"
      : "M0,2 Q5,8 10,4 T20,7 T30,2 T40,8";
    return (
      <svg className={`w-14 h-6 ${strokeColor} opacity-80 shrink-0`} viewBox="0 0 40 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    );
  };

  return (
    <div className="saas-card bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</span>
        <div className={`w-9.5 h-9.5 rounded-xl ${iconStyle} flex items-center justify-center shrink-0`}>
          <Icon size={18} />
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">{value}</span>
      </div>
      
      {trend ? (
        <div className="flex items-center justify-between gap-1.5 mt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`px-1.5 py-0.5 rounded-md ${
              trend.isPositive 
                ? "text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-950/30" 
                : "text-danger-600 bg-danger-50 dark:text-danger-400 dark:bg-danger-950/30"
            }`}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-2xs font-semibold">from last week</span>
          </div>
          {renderSparkline(trend.isPositive)}
        </div>
      ) : progress !== undefined ? (
        <div className="mt-4">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="h-6 flex items-center justify-between">
          <span className="text-2xs text-slate-400 dark:text-slate-500 font-semibold">Stable activity logs</span>
          <svg className="w-14 h-6 text-slate-300 dark:text-slate-600 opacity-60 shrink-0" viewBox="0 0 40 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0,5 L10,5 L15,2 L25,8 L30,5 L40,5" />
          </svg>
        </div>
      )}
    </div>
  );
};
