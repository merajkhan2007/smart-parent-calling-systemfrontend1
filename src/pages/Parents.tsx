import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Search, UserCheck, Shield, Phone } from "lucide-react";

export const Parents: React.FC = () => {
  const { apiFetch } = useAuth();
  const { addToast } = useToast();

  const [parents, setParents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/parents/?query=${search}`);
      setParents(data || []);
    } catch (e: any) {
      // Mock fallback
      setParents([
        { id: 1, father_name: "David Nelson", father_mobile: "+15550100", mother_name: "Emily Nelson", mother_mobile: "+15550101", emergency_contact: "+15550999" },
        { id: 2, father_name: "Michael Smith", father_mobile: "+15550200", mother_name: "Sarah Smith", mother_mobile: "+15550201", emergency_contact: "+15550999" },
        { id: 3, father_name: "James Williams", father_mobile: "+15550300", mother_name: "Emma Williams", mother_mobile: "+15550301", emergency_contact: "+15550999" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParents();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Parent Profiles</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Manage family relationships and dialer configurations.</p>
      </div>

      {/* Search Filter */}
      <div className="saas-card p-5">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search father, mother name or phone..."
              className="premium-input pl-9 text-xs py-2.5"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider"
          >
            Search Contacts
          </button>
        </form>
      </div>

      {/* Grid of Profiles */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-wider animate-pulse">Loading parent directory...</div>
      ) : parents.length === 0 ? (
        <div className="text-center py-12 text-slate-450 font-semibold text-xs">No parent profiles found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parents.map((p) => (
            <div key={p.id} className="saas-card bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-950/20 dark:text-primary-400 flex items-center justify-center border border-primary-100/50 dark:border-primary-900/30">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Family Profile #{p.id}</h3>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Primary Contacts</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Father */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Father</span>
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-350">{p.father_name || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mobile</span>
                      <p className="font-bold text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1.5 justify-end">
                        <Phone size={10} />
                        <span>{p.father_mobile || "N/A"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Mother */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mother</span>
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-350">{p.mother_name || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mobile</span>
                      <p className="font-bold text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1.5 justify-end">
                        <Phone size={10} />
                        <span>{p.mother_mobile || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                  <Shield size={10} className="text-danger-500" />
                  <span>Emergency Line</span>
                </span>
                <span className="font-bold text-slate-650 dark:text-slate-300">{p.emergency_contact || p.father_mobile}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
