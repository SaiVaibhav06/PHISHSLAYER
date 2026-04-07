import { useState, useRef } from "react";
import { api } from "../../services/api";
import { Search, Loader2, AlertTriangle, CheckCircle, UploadCloud, X } from "lucide-react";
import { Badge } from "../ui/Badge";

export default function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleAnalyze = async () => {
    if (!content.trim() && !file) return;
    setLoading(true);
    setResult(null);
    try {
      const mockExtractedText = file ? `[File Content Extraction Mock for ${file.name}]\nhas_macro script ${content}` : content;
      const data = await api.analyzeContent(mockExtractedText, file?.name);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
     if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
     }
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-400" />
        AI Phishing & Attachment Analyzer
      </h2>
      <p className="text-sm text-slate-400 mb-4 flex-1">
        Scan suspicious emails, SMS messages, URLs, or attachments (PDF, Word, PNG) for social engineering patterns and malware signatures.
      </p>
      
      <div className="mb-4 space-y-3">
        <textarea
          className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono"
          placeholder="Paste message, email body, or URLs here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          {!file ? (
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/20 rounded-lg p-4 text-sm text-slate-400 hover:border-primary/50 hover:text-slate-200 transition-colors flex flex-col items-center justify-center gap-2"
             >
                <UploadCloud className="w-6 h-6" />
                Upload File (PDF, DOCX, IMG)
             </button>
          ) : (
             <div className="w-full bg-primary/10 border border-primary/30 rounded-lg p-3 flex justify-between items-center text-sm">
                <span className="font-mono text-primary-200 truncate pr-4">{file.name}</span>
                <button onClick={() => setFile(null)} className="p-1 hover:bg-white/10 rounded">
                   <X className="w-4 h-4 text-slate-400" />
                </button>
             </div>
          )}
        </div>
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={loading || (!content.trim() && !file)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? "Analyzing Signatures..." : "Run Deep Inspection"}
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
