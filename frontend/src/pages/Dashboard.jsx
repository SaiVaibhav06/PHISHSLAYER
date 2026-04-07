import { LayoutDashboard, ShieldAlert, Activity, GitCommit } from "lucide-react";
import NetworkActivity from "../components/network/NetworkActivity";
import { useAlertStore } from "../store/useAlertStore";
import { Badge } from "../components/ui/Badge";

export default function Dashboard() {
  const alerts = useAlertStore((state) => state.alerts);
  const stats = useAlertStore((state) => state.stats);
  
  // Calculate top threats
  const highSeverity = alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SOC Overview</h1>
        <p className="text-slate-400">High-level view of your security posture across the network.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Alerts</p>
          <h3 className="text-3xl font-bold font-mono">{alerts.length}</h3>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-danger/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-danger/10 text-danger rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            {highSeverity > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Severe Threats</p>
          <h3 className="text-3xl font-bold font-mono text-danger-400">{highSeverity}</h3>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-success/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Active Monitoring</p>
          <h3 className="text-lg font-bold text-success-400 flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            Online
          </h3>
        </div>

        {/* Card 4 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <GitCommit className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Threats Mitigated</p>
          <h3 className="text-3xl font-bold font-mono text-blue-400">{stats.threats_blocked.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <NetworkActivity />
        </div>
        
        <div className="glass-panel p-5 flex flex-col h-full">
           <h3 className="text-lg font-semibold border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
              Recent Activity
              <span className="text-xs px-2 py-1 bg-white/5 rounded-md font-mono">{alerts.length}</span>
           </h3>
           <div className="flex-1 overflow-auto space-y-3">
              {alerts.slice(0, 5).map(alert => (
                 <div key={alert.id} className="flex gap-3 text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <Badge variant={alert.severity} className="shrink-0 mt-0.5">{alert.severity.toUpperCase()[0]}</Badge>
                    <div>
                       <p className="font-medium text-slate-200">{alert.type}</p>
                       <p className="text-xs text-slate-500 line-clamp-1">{alert.message}</p>
                    </div>
                 </div>
              ))}
              {alerts.length === 0 && (
                 <p className="text-sm text-slate-500 text-center py-8">No recent alerts</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
