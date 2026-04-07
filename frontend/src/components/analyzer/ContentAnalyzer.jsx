import { useState } from "react";
import { api } from "../../services/api";
import { Search, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "../ui/Badge";

export default function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await api.analyzeContent(content);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-400" />
        AI Phishing Analyzer
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Paste suspicious emails, SMS messages, or URLs to analyze them for social engineering patterns and scam signatures.
      </p>
      
      <textarea
        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm flex-1 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        placeholder="Dear user, your account has been temporarily suspended. Kindly click here to verify your identity and restore access..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <button
        onClick={handleAnalyze}
        disabled={loading || !content.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? "Analyzing Context & Signatures..." : "Analyze Content"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              {result.risk_score > 50 ? <AlertTriangle className="w-4 h-4 text-warning" /> : <CheckCircle className="w-4 h-4 text-success" />}
              Analysis Complete
            </h3>
            <Badge variant={result.risk_level}>{result.risk_level.toUpperCase()}</Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Risk Score</span>
              <span className="font-mono text-white">{result.risk_score}/100</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${result.risk_score > 70 ? 'bg-danger' : result.risk_score > 30 ? 'bg-warning' : 'bg-success'}`}
                 style={{ width: `${result.risk_score}%` }}
               />
            </div>
          </div>
          
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">
            {result.explanation}
          </p>
          
          {result.detected_keywords && result.detected_keywords.length > 0 && (
             <div>
                <span className="text-xs text-slate-500 block mb-2 uppercase tracking-wide">Detected Flags</span>
                <div className="flex flex-wrap gap-2">
                  {result.detected_keywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 bg-danger/20 text-danger-400 border border-danger/30 rounded text-[10px] uppercase font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
