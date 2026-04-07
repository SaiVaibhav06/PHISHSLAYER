import ContentAnalyzer from "../components/analyzer/ContentAnalyzer";
import { Search } from "lucide-react";

export default function PhishingAnalyzer() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Search className="w-8 h-8 text-indigo-400" />
          Phishing Analyzer
        </h1>
        <p className="text-slate-400">Deep content inspection using heuristic signatures to detect social engineering and scam vectors.</p>
      </div>
      
      <ContentAnalyzer />
      
      <div className="mt-8 glass-panel p-5">
         <h3 className="font-semibold text-sm mb-3">How it works</h3>
         <p className="text-sm text-slate-400 leading-relaxed">
            The platform inspects input text using a case-insensitive multi-vector NLP-like signature analyzer. 
            Words expressing false urgency ("urgent", "action required"), suspicious finance requests ("wire transfer", "crypto"), 
            or generic phishing attempts ("verify account") are logged and scored. 
         </p>
         <div className="grid grid-cols-3 gap-4 mt-6 text-xs font-mono text-slate-500">
            <div className="border border-white/10 rounded pb-2 p-3 bg-black/20 text-center">
               <span className="text-success block mb-1">0-30</span>
               SAFE
            </div>
            <div className="border border-white/10 rounded pb-2 p-3 bg-black/20 text-center">
               <span className="text-warning block mb-1">31-60</span>
               SUSPICIOUS
            </div>
            <div className="border border-white/10 rounded pb-2 p-3 bg-black/20 text-center">
               <span className="text-danger block mb-1">61-100</span>
               SCAM
            </div>
         </div>
      </div>
    </div>
  );
}
