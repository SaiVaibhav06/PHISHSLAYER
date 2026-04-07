import { useAlertStore } from "../store/useAlertStore";
import { Badge } from "../components/ui/Badge";
import { Clock, Download, MapPin, Activity } from "lucide-react";
import ThreatDetailsModal from "../components/alerts/ThreatDetailsModal";
import { useState } from "react";

export default function History() {
  const alerts = useAlertStore(state => state.alerts);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const exportToCSV = () => {
    if (alerts.length === 0) return;
    
    const headers = ['Timestamp', 'Source IP', 'ISP', 'Country', 'Type', 'Categories', 'Severity', 'Status', 'Message'];
    const csvRows = alerts.map(alert => [
      new Date(alert.timestamp).toISOString(),
      alert.ip,
      alert.geo_location?.isp || 'Unknown',
      alert.geo_location?.country || 'Unknown',
      `"${alert.type.replace(/"/g, '""')}"`,
      `"${alert.categories ? alert.categories.join(' | ') : ''}"`,
      alert.severity,
      alert.status || 'Active',
      `"${alert.message.replace(/"/g, '""')}"`
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alerts_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            Alert History
          </h1>
          <p className="text-slate-400">Chronological log of all recorded security events.</p>
        </div>
        
        <button 
           onClick={exportToCSV}
           disabled={alerts.length === 0}
           className={`bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-400 flex items-center gap-2 transition-colors ${alerts.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10 hover:text-white cursor-pointer"}`}
        >
           <Download className="w-4 h-4" />
           Export CSV
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-slate-400 uppercase bg-black/40 border-b border-white/10">
                  <tr>
                     <th className="px-6 py-4 font-medium">Timestamp</th>
                     <th className="px-6 py-4 font-medium">Source / Geo</th>
                     <th className="px-6 py-4 font-medium">Threat Intelligence</th>
                     <th className="px-6 py-4 font-medium">Severity</th>
                     <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {alerts.map((alert) => (
                     <tr 
                       key={alert.id} 
                       onClick={() => setSelectedAlert(alert.id)}
                       className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                     >
                        <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">{new Date(alert.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-mono text-slate-300">{alert.ip}</span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                 <MapPin className="w-3 h-3" /> {alert.geo_location?.country || 'Unknown'} - {alert.geo_location?.isp || 'Unknown'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-200 mb-1">{alert.type}</div>
                           <div className="flex flex-wrap gap-1">
                              {alert.categories?.map((c, i) => (
                                 <span key={i} className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 whitespace-nowrap">
                                    {c}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4"><Badge variant={alert.severity}>{alert.severity.toUpperCase()}</Badge></td>
                        <td className="px-6 py-4">
                           <span className={`text-xs px-2 py-1 rounded-full border ${alert.status === 'blocked' ? 'bg-danger/20 text-danger border-danger/30' : 'bg-warning/20 text-warning border-warning/30'} flex items-center gap-1 w-max capitalize`}>
                              <Activity className="w-3 h-3" /> {alert.status || 'Active'}
                           </span>
                        </td>
                     </tr>
                  ))}
                  {alerts.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No telemetry recorded yet.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {selectedAlert && <ThreatDetailsModal alertId={selectedAlert} onClose={() => setSelectedAlert(null)} />}
    </div>
  );
}
