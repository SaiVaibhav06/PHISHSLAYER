import { Activity, ShieldAlert, Crosshair, Loader2 } from "lucide-react";
import NetworkActivity from "../components/network/NetworkActivity";
import LiveAlertsPanel from "../components/alerts/LiveAlertsPanel";
import { api } from "../services/api";
import { useState } from "react";

export default function NetworkMonitor() {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.simulateAttack();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
         <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-primary w-8 h-8" />
            Network Monitor
          </h1>
          <p className="text-slate-400">Live traffic visualization and automated threat detection.</p>
        </div>
        
        <button 
          onClick={handleSimulate}
          disabled={isSimulating}
          className="bg-danger/35 hover:bg-danger/20 text-danger border border-danger/20 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity - 100"
        >
          {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
          Simulate Attack
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
         <div className="lg:col-span-7 flex flex-col gap-6">
            <NetworkActivity />
            <div className="glass-panel p-5 flex-1 relative overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                 <ShieldAlert className="w-5 h-5 text-warning" />
                 Intrusion Detection System
              </h3>
              <div className="h-[200px] flex items-center justify-center border-t border-white/10 relative">
                 <div className="w-full text-center">
                    <Activity className="w-16 h-16 text-primary/20 animate-pulse mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-mono">Analyzing ingress packets on standard ports...</p>
                 </div>
                 
                 {/* Visual effect line */}
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/20 -translate-y-1/2 overflow-hidden">
                    <div className="w-1/4 h-full bg-primary/80 animate-[slide_2s_ease-in-out_infinite] glow"></div>
                 </div>
              </div>
            </div>
         </div>
         
         <div className="lg:col-span-5 relative">
            <LiveAlertsPanel />
         </div>
      </div>
    </div>
  );
}
