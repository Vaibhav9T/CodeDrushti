import React, { useState, useRef, useEffect } from 'react';
import { Play, AlertTriangle, ShieldAlert, Zap, CheckCircle, FileCode, Loader2, Upload, Code, Maximize2, Minimize2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from '../utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const NewReview = () => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bugs');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textareaRef.current) {
        setHasOverflow(textareaRef.current.scrollHeight > textareaRef.current.clientHeight + 2);
      }
    };
    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 10);
    return () => clearTimeout(timeoutId);
  }, [code, isExpanded]);

  const saveReviewToHistory = async (reviewedCode, reviewResult) => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, "reviews", uuidv4()), {
      userId: auth.currentUser.uid,
      code: reviewedCode,
      reviewContent: reviewResult,
      linesOfCode: reviewedCode.split('\n').length,
      timestamp: serverTimestamp(),
    });
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setAnalysisResult(null);
    let data;

    try {
      const response = await fetch("https://codedrushti.onrender.com/ai/get-review", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!response.ok) throw new Error();
      data = await response.json();
      setAnalysisResult(data);
      await saveReviewToHistory(code, data);
    } catch (error) {
      alert("Analysis failed. Please check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full transition-colors duration-300">
      <div className="shrink-0 px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg"><Code className="text-indigo-600 dark:text-indigo-400" size={20} /></div>
          CodeDrushti Analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Deploy the AI engine to scan your architecture for vulnerabilities and optimizations.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-5xl mx-auto pb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12 transition-all duration-300">
            <div className="relative bg-slate-950 p-1">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Initialize scan sequence..."
                spellCheck="false"
                className={`w-full bg-slate-950 text-gray-300 p-6 pr-14 rounded-xl focus:outline-none font-mono text-sm resize-none leading-relaxed selection:bg-indigo-500/30 overflow-y-auto transition-all duration-300 ${isExpanded ? 'h-[65vh]' : 'h-[320px]'} no-scrollbar`}
              />
              {(hasOverflow || isExpanded) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute top-5 right-5 p-2 bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg backdrop-blur-sm transition-all"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-slate-800 gap-4">
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <FileCode size={16} className="mr-2 text-indigo-500" /> Auto-Detect Engine Active
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input ref={fileInputRef} type="file" accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (e) => setCode(e.target.result); r.readAsText(f); } }} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
                  <Upload size={18} className="mr-2" /> Upload
                </button>
                <button onClick={handleAnalyze} disabled={isLoading || !code.trim()} className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer ${isLoading || !code.trim() ? 'bg-indigo-400 dark:bg-indigo-500/50 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md hover:shadow-lg'}`}>
                  {isLoading ? <><Loader2 size={18} className="animate-spin mr-2" />Processing</> : <><Play size={18} className="mr-2" />Execute</>}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {analysisResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Diagnostic Results</h2>
                <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                  <TabButton label="Bugs" count={analysisResult.bugs?.length} active={activeTab === 'bugs'} onClick={() => setActiveTab('bugs')} />
                  <TabButton label="Security" count={analysisResult.security?.length} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                  <TabButton label="Optimizations" count={analysisResult.improvements?.length} active={activeTab === 'improvements'} onClick={() => setActiveTab('improvements')} />
                </div>
                <div className="space-y-4">
                  {analysisResult[activeTab]?.length > 0 ? (
                    analysisResult[activeTab].map((item, index) => <ResultCard key={index} item={item} type={activeTab} />)
                  ) : (
                    <div className="text-gray-500 text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 border-dashed">
                      <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                      <p className="font-bold text-gray-900 dark:text-white text-lg">System Optimal</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ label, count, active, onClick }) => (
  <button onClick={onClick} className={`pb-4 px-4 text-sm font-bold transition-all relative flex items-center whitespace-nowrap cursor-pointer ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
    {label}
    {count !== undefined && <span className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-bold ${active ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>{count}</span>}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>}
  </button>
);

const ResultCard = ({ item, type }) => {
  const getStyles = () => {
    if (type === 'bugs') return { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', icon: <AlertTriangle size={20} /> };
    if (type === 'security') return { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', icon: <ShieldAlert size={20} /> };
    return { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', icon: <Zap size={20} /> };
  };
  const style = getStyles();

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>{style.icon}</div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h3>
        </div>
        {item.severity && <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${style.bg} ${style.text}`}>{item.severity}</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-[54px] mb-4">{item.description}</p>
      {item.line && <div className="ml-[54px] bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm text-gray-300 overflow-x-auto mb-4 no-scrollbar"><span className="text-indigo-500 mr-4">❯</span>{item.line}</div>}
      {item.suggestion && <div className="ml-[54px] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-xl flex items-start gap-3"><CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /><div className="text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">{item.suggestion}</div></div>}
    </div>
  );
};

export default NewReview;