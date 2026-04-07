import { useAlertStore } from "../../store/useAlertStore";
import { Badge } from "../ui/Badge";
import { ShieldAlert, Activity } from "lucide-react";

export default function LiveAlertsPanel() {
  const alerts = useAlertStore((state) => state.alerts);

  return (
    <div className="glass-panel flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-danger" />
          Live Threat Feed
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
          </span>
          Monitoring
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <Activity className="w-8 h-8 mb-2 opacity-20" />
             <p>No active threats detected.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{alert.type}</span>
                <Badge variant={alert.severity}>{alert.severity.toUpperCase()}</Badge>
              </div>
              <p className="text-xs text-slate-400 mb-2">{alert.message}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>SRC: {alert.ip}</span>
                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
