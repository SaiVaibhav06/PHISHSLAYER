import { useEffect, useState } from "react";
import { useAlertStore } from "../../store/useAlertStore";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import { api } from "../../services/api";

export default function NetworkActivity() {
  const stats = useAlertStore((state) => state.stats);
  const setStats = useAlertStore((state) => state.setStats);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        if(data.status === 'success') {
           setStats(data.stats);
        }
      } catch(e) {
        // ignore
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [setStats]);

  return (
    <div className="glass-panel p-5">
       <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Network Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Metric 1 */}
           <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
              <Activity className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold font-mono">{stats.total_packets_analyzed.toLocaleString()}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Packets Sniffed</span>
           </div>
           
           {/* Metric 2 */}
           <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-success mb-2" />
              <span className="text-2xl font-bold font-mono">{stats.threats_blocked.toLocaleString()}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Threats Blocked</span>
           </div>
           
           {/* Metric 3 */}
           <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
              <Zap className="w-6 h-6 text-warning mb-2 relative z-10" />
              <span className="text-2xl font-bold font-mono relative z-10 text-warning animate-pulse">{stats.active_connections}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 relative z-10">Active WS Conns</span>
           </div>
        </div>
    </div>
  );
}
