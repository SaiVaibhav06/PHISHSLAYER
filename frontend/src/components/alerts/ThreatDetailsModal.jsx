import { useState, useEffect } from 'react';
import { X, ShieldAlert, MapPin, Activity, CheckCircle, BrainCircuit, ShieldBan } from 'lucide-react';
import { useAlertStore } from '../../store/useAlertStore';
import { api } from '../../services/api';

export default function ThreatDetailsModal({ alertId, onClose }) {
  const alert = useAlertStore(state => state.alerts.find(a => a.id === alertId));
  const updateAlert = useAlertStore(state => state.updateAlert);
  const [activeTab, setActiveTab] = useState('details'); // details, timeline, ai
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);

  if (!alert) return null;

  const handleBlock = async () => {
     setIsSimulatingAction(true);
     try {
       // Assuming we added /api/alerts/action route
       await api.takeAction?.(alert.id, 'block_ip'); 
       // For mock purposes if backend not updated, just do local state update
       updateAlert(alert.id, { 
          status: 'blocked', 
          timeline: [...(alert.timeline || []), { step: 'Blocked IP via Firewall', time: new Date().toISOString() }] 
       });
     } catch (e) {
       console.error("Failed to block", e);
     }
     setIsSimulatingAction(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`p-4 border-b border-white/10 flex justify-between items-center ${alert.severity === 'critical' || alert.severity === 'high' ? 'bg-danger/10 max-h-16' : 'bg-white/5'}`}>
          <div className="flex items-center gap-3">
             <ShieldAlert className={`w-6 h-6 ${alert.severity === 'critical' || alert.severity === 'high' ? 'text-danger' : 'text-warning'}`} />
             <h2 className="text-xl font-bold">{alert.type}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10 px-4 pt-4 gap-4 text-sm font-medium text-slate-400">
           <button onClick={() => setActiveTab('details')} className={`pb-3 border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent hover:text-slate-200'}`}>Overview</button>
           <button onClick={() => setActiveTab('timeline')} className={`pb-3 border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent hover:text-slate-200'}`}>Timeline Sequence</button>
           <button onClick={() => setActiveTab('ai')} className={`pb-3 border-b-2 transition-colors ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent hover:text-slate-200'} flex items-center gap-1`}>
              <BrainCircuit className="w-4 h-4" /> SysAI Analysis
           </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[400px] overflow-y-auto bg-black/20">
           {activeTab === 'details' && (
              <div className="space-y-6">
                 <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Source Intelligence</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-indigo-400 mt-0.5" />
                          <div>
                             <p className="text-xs text-slate-400">IP & GeoLocation</p>
                             <p className="font-mono text-lg">{alert.ip}</p>
                             <p className="text-sm text-slate-300">{alert.geo_location?.country || 'Unknown'} - {alert.geo_location?.isp || 'Unknown ISP'}</p>
                          </div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-start gap-3">
                          <Activity className="w-5 h-5 text-success-400 mt-0.5" />
                          <div>
                             <p className="text-xs text-slate-400">Status</p>
                             <p className="font-medium text-lg capitalize flex items-center gap-2">
                                {alert.status === 'blocked' && <ShieldBan className="w-4 h-4 text-danger" />}
                                {alert.status || 'Active'}
                             </p>
                             <p className="text-sm text-slate-400 font-mono mt-1">ID: {alert.id.split('-')[0]}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Payload Message</h3>
                    <div className="bg-black/50 p-4 rounded-lg border border-white/10 font-mono text-sm text-red-200/80">
                       {alert.message}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Classification Tags</h3>
                    <div className="flex flex-wrap gap-2">
                       {alert.categories ? alert.categories.map((c, i) => (
                           <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">
                              {c}
                           </span>
                       )) : (
                           <span className="text-slate-500 text-sm">No advanced tags available</span>
                       )}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'timeline' && (
              <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Automated Processing Timeline</h3>
                 <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-white/10">
                    {(alert.timeline || [
                       {step: 'Detection', time: alert.timestamp},
                       {step: 'Initial Classification', time: alert.timestamp}
                    ]).map((entry, i) => (
                       <div key={i} className="relative">
                          <CheckCircle className="absolute -left-[30px] top-1 w-4 h-4 text-primary bg-background rounded-full" />
                          <p className="text-sm font-medium text-slate-200">{entry.step}</p>
                          <p className="text-xs text-slate-500 font-mono">{new Date(entry.time).toLocaleString()}</p>
                       </div>
                    ))}
                 </div>
                 
                 {alert.status !== 'blocked' && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                       <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Manual Action Simulation</p>
                       <button 
                         onClick={handleBlock}
                         disabled={isSimulatingAction}
                         className="bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 px-4 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto"
                       >
                         {isSimulatingAction ? 'Processing...' : 'Simulate Auto-Response: Block IP & Drop Connection'}
                       </button>
                    </div>
                 )}
              </div>
           )}

           {activeTab === 'ai' && (
              <div className="space-y-4">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                       <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-sm text-slate-300 leading-relaxed bg-primary/5 p-4 rounded-lg border border-primary/10 rounded-tl-none">
                          Based on the intelligence gathered, this is considered a <strong className="text-white">{alert.severity}</strong> severity threat. 
                          <br/><br/>
                          <strong>Why is this a threat?</strong><br/>
                          The payload indicates patterns consistent with `<span className="font-mono text-xs">{alert.type}</span>`. 
                          {alert.categories?.includes('Suspicious Traffic') && " The packet size or protocol behavior deviates from baseline normal operations."}
                          {alert.categories?.includes('Phishing') && " The content heavily relies on social engineering, urgency, or deceptive domains."}
                          <br/><br/>
                          <strong>Recommended Fix:</strong><br/>
                          If this traffic was not expected, we recommend blacklisting the source IP (`<span className="font-mono text-xs">{alert.ip}</span>`) at the boundary firewall. 
                          If this is an internal scan, verify with the networking team.
                       </p>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
