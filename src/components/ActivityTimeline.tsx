import React from "react";
import { Phone, CreditCard, PhoneOff, CheckCircle } from "lucide-react";

interface Activity {
  id: string;
  type: string; // call, scan, alert
  time: string;
  title: string;
  subtitle: string;
  tag: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, loading = false }) => {
  if (loading) {
    return (
      <div className="saas-card bg-white dark:bg-slate-900 p-6 shimmer-bg animate-pulse">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-36 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (type: string, tag: string) => {
    const formattedTag = tag?.toLowerCase();
    if (type === "scan") {
      return { icon: CreditCard, color: "bg-primary-50 text-primary-500 border-primary-100 dark:bg-primary-950/20 dark:border-primary-900/30" };
    }
    if (formattedTag === "completed" || formattedTag === "success") {
      return { icon: CheckCircle, color: "bg-success-50 text-success-500 border-success-100 dark:bg-success-950/20 dark:border-success-900/30" };
    }
    if (formattedTag === "failed" || formattedTag === "rejected" || formattedTag === "error") {
      return { icon: PhoneOff, color: "bg-danger-50 text-danger-500 border-danger-100 dark:bg-danger-950/20 dark:border-danger-900/30" };
    }
    return { icon: Phone, color: "bg-accent-50 text-accent-500 border-accent-100 dark:bg-accent-950/20 dark:border-accent-900/30" };
  };

  return (
    <div className="saas-card bg-white dark:bg-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight uppercase">Activity Logs</h3>
        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50 rounded">
          Real-time feed
        </span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 font-medium">No activity recorded today yet.</div>
      ) : (
        <div className="relative border-l border-slate-100 dark:border-slate-850 pl-6 ml-4 space-y-6">
          {activities.map((act) => {
            const { icon: Icon, color } = getIcon(act.type, act.tag);
            return (
              <div key={act.id} className="relative group">
                {/* Bullet indicator */}
                <div className={`absolute -left-[37px] top-0 w-8 h-8 rounded-full border flex items-center justify-center ${color} bg-white dark:bg-slate-900 shadow-xs transition-transform duration-200 group-hover:scale-110 z-10`}>
                  <Icon size={12} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 transition-colors group-hover:text-primary-500">
                    {act.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-md w-max">
                    {act.time}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                  {act.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
