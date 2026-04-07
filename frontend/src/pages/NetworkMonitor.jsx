import { Activity, ShieldAlert, Crosshair, Loader2, Link } from "lucide-react";
import NetworkActivity from "../components/network/NetworkActivity";
import LiveAlertsPanel from "../components/alerts/LiveAlertsPanel";
import { api } from "../services/api";
import { useState, useEffect } from "react";
import { useAlertStore } from "../store/useAlertStore";

export default function NetworkMonitor() {
  const [isSimulating, setIsSimulating] = useState(false);
  const alerts = useAlertStore((state) => state.alerts);
  const [idsFlashing, setIdsFlashing] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      setIdsFlashing(true);
      const timer = setTimeout(() => setIdsFlashing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.simulateAttack();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsSimulating(false), 800);
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
          className="bg-danger/30 hover:bg-danger/40 text-red-200 border border-danger/40 px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
          {isSimulating ? 'Sending Exploit Packets...' : 'Simulate External Attack'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
         <div className="lg:col-span-7 flex flex-col gap-6">
            <NetworkActivity />
            <div className={`glass-panel p-5 flex-1 relative overflow-hidden min-h-[300px] transition-colors duration-500 border ${idsFlashing ? 'border-danger bg-danger/5 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-slate-300">
                 <Link className="w-3 h-3 text-success" /> Socket Listen
              </div>

              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                 <ShieldAlert className={`w-5 h-5 ${idsFlashing ? 'text-danger animate-pulse' : 'text-primary'}`} />
                 Intrusion Detection System
              </h3>
              
              <div className="h-[200px] flex items-center justify-center border-t border-white/10 relative">
                 <div className="w-full text-center relative z-10">
                    <Activity className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${idsFlashing ? 'text-danger scale-125 vibrate' : 'text-primary/20 animate-pulse'}`} />
                    <p className={`text-sm font-mono transition-colors ${idsFlashing ? 'text-danger font-bold uppercase' : 'text-slate-500'}`}>
                       {idsFlashing ? 'THREAT SIGNATURE DETECTED IN INGRESS TRAFFIC' : 'Analyzing ingress packets on standard ports...'}
                    </p>
                 </div>
                 
                 {/* Visual effect line */}
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/20 -translate-y-1/2 overflow-hidden pointer-events-none">
                    <div className={`h-full ${idsFlashing ? 'w-full bg-danger animate-ping' : 'w-1/4 bg-primary/80 animate-[slide_2s_ease-in-out_infinite] glow'}`}></div>
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
