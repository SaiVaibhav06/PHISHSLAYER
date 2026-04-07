import { LayoutDashboard, ShieldAlert, Activity, GitCommit } from "lucide-react";
import { useAlertStore } from "../store/useAlertStore";
import { Badge } from "../components/ui/Badge";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";

export default function Dashboard() {
  const alerts = useAlertStore((state) => state.alerts);
  const stats = useAlertStore((state) => state.stats);
  
  // Calculate top threats
  const highSeverity = alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;
  const mediumSeverity = alerts.filter(a => a.severity === 'medium').length;
  const lowSeverity = alerts.filter(a => a.severity === 'low').length;

  const pieData = [
    { name: 'High/Critical', value: highSeverity, color: '#ef4444' },
    { name: 'Medium', value: mediumSeverity, color: '#f59e0b' },
    { name: 'Low/Info', value: lowSeverity, color: '#3b82f6' }
  ].filter(d => d.value > 0);
  
  // Basic mock time series using alerts (if empty, empty chart)
  const timeData = useMemo(() => {
    if (alerts.length === 0) return [];
    
    // Group by minute
    const grouped = {};
    alerts.forEach(a => {
       const key = new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
       grouped[key] = (grouped[key] || 0) + 1;
    });
    
    return Object.keys(grouped).reverse().map(time => ({
       time,
       Threats: grouped[time]
    })).slice(-10); // last 10 minutes
  }, [alerts]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" /> SOC Overview
        </h1>
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
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-warning/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 w-full h-[50px] bg-black/20 rounded-lg overflow-hidden relative">
               {/* Custom progress bar visually representing severity ratio */}
               <div className="absolute inset-0 flex rounded overflow-hidden opacity-50">
                  <div style={{width: `${(lowSeverity/Math.max(alerts.length,1))*100}%`}} className="bg-blue-500 h-full"></div>
                  <div style={{width: `${(mediumSeverity/Math.max(alerts.length,1))*100}%`}} className="bg-warning h-full"></div>
                  <div style={{width: `${(highSeverity/Math.max(alerts.length,1))*100}%`}} className="bg-danger h-full"></div>
               </div>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Risk Saturation</p>
          <h3 className="text-lg font-bold text-slate-300">
             {Math.round(((highSeverity*3 + mediumSeverity*2 + lowSeverity*1) / Math.max(alerts.length*3, 1)) * 100)}%
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
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-panel p-5 h-[300px]">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Detection Frequency</h3>
              {timeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={timeData}>
                    <defs>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b'}} itemStyle={{color: '#c7d2fe'}} />
                    <Area type="monotone" dataKey="Threats" stroke="#818cf8" fillOpacity={1} fill="url(#colorThreats)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">Waiting for incoming telemetry...</div>
              )}
           </div>
        </div>
        
        <div className="glass-panel p-5 flex flex-col h-[300px]">
           <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Severity Distribution</h3>
           {pieData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b'}} itemStyle={{color: '#e2e8f0'}} />
                </PieChart>
             </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-slate-500 text-sm">No significant threat data.</div>
           )}
        </div>
      </div>
    </div>
  );
}
