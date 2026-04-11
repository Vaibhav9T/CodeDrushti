import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, AlertTriangle, ShieldAlert, Zap, CheckCircle, 
  FileCode, Loader2, Upload, Code, Maximize2, Minimize2 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db, auth } from '../utils/firebase';

const NewReview = () => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bugs');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // New States for Editor Sizing
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Check if content exceeds the textarea height
  useEffect(() => {
    const checkOverflow = () => {
      if (textareaRef.current) {
        // Add a tiny 2px buffer to prevent flickering rounding errors
        const isOverflowing = textareaRef.current.scrollHeight > textareaRef.current.clientHeight + 2;
        setHasOverflow(isOverflowing);
      }
    };
    
    checkOverflow();
    // A small delay ensures the check runs after React updates the DOM with pasted text
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
      timeTakenMs: 1500 
    });
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return alert("Please paste some code first!");
    
    setIsLoading(true); 
    setAnalysisResult(null);
    let data;
    
    try {
      const response = await fetch("https://codedrushti.onrender.com/ai/get-review", {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ code })
      });
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      
      data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      alert("Failed to connect to the AI backend."); 
      setIsLoading(false); 
      return; 
    }
    
    try { 
      await saveReviewToHistory(code, data); 
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] font-sans w-full transition-colors duration-300">
      
      {/* FIXED HEADER */}
      <div className="shrink-0 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Code className="text-indigo-600 dark:text-indigo-400" size={24} /> Analyze Code
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Paste your code below or upload a file to get instant AI-powered feedback.</p>
      </div>

      {/* SCROLLING CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        <div className="max-w-5xl mx-auto pb-12">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden mb-12 transition-all duration-300">
            
            {/* TEXTAREA WRAPPER */}
            <div className="relative bg-slate-900 p-1 group">
              <textarea
                ref={textareaRef} 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code snippet here..."
                spellCheck="false"
                className={`
                  w-full bg-slate-900 text-gray-200 p-6 pr-14 rounded-xl focus:outline-none font-mono text-sm resize-none leading-relaxed selection:bg-indigo-500/30 overflow-y-auto transition-all duration-300 ease-in-out
                  ${isExpanded ? 'h-[65vh] md:h-[600px]' : 'h-[300px]'}
                  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600
                `}
              />
              
              {/* DYNAMIC EXPAND BUTTON */}
              {(hasOverflow || isExpanded) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute top-5 right-5 p-2 bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg backdrop-blur-sm transition-all shadow-sm z-10"
                  title={isExpanded ? "Minimize Editor" : "Expand Editor"}
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              )}
            </div>
            
            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-slate-800 gap-4 transition-colors duration-300">
               <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700 cursor-default">
                  <FileCode size={16} className="mr-2 text-indigo-500 dark:text-indigo-400"/> Auto-Detect Language
               </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.rb,.go,.php,.html,.css,.json,.xml,.swift,.kt,.rs"
                  onChange={(e) => { 
                    const f = e.target.files[0]; 
                    if(f) { 
                      const r = new FileReader(); 
                      r.onload = (e) => setCode(e.target.result); 
                      r.readAsText(f); 
                    } 
                  }} 
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <Upload size={18} className="mr-2" /> Upload File
                </button>

                <button 
                  onClick={handleAnalyze} 
                  disabled={isLoading || !code.trim()} 
                  className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-all active:scale-[0.98] cursor-pointer 
                    ${isLoading || !code.trim() ? 'bg-indigo-400 dark:bg-indigo-500/50 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'}`
                  }
                >
                  {isLoading ? <><Loader2 size={18} className="animate-spin mr-2" />Scanning...</> : <><Play size={18} className="mr-2" />Analyze Code</>}
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS SECTION */}
          {analysisResult && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analysis Results</h2>
              
              <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                <TabButton label="Bugs" count={analysisResult.bugs?.length} active={activeTab === 'bugs'} onClick={() => setActiveTab('bugs')} />
                <TabButton label="Improvements" count={analysisResult.improvements?.length} active={activeTab === 'improvements'} onClick={() => setActiveTab('improvements')} />
                <TabButton label="Security" count={analysisResult.security?.length} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
              </div>
              
              <div className="space-y-4">
                 {analysisResult[activeTab]?.length > 0 ? (
                   analysisResult[activeTab].map((item, index) => <ResultCard key={index} item={item} type={activeTab} />)
                 ) : (
                   <div className="text-gray-500 text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 border-dashed shadow-sm">
                     <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle size={32} className="text-emerald-500 dark:text-emerald-400" />
                     </div>
                     <p className="font-medium text-gray-900 dark:text-white text-lg">No issues found!</p>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS
const TabButton = ({ label, count, active, onClick }) => (
  <button onClick={onClick} className={`pb-4 px-4 text-sm font-bold transition-all relative flex items-center whitespace-nowrap cursor-pointer ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
    {label} 
    {count !== undefined && <span className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold ${active ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'}`}>{count}</span>}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>}
  </button>
);

const ResultCard = ({ item, type }) => {
  const getSeverityStyles = (s) => {
    switch(s?.toLowerCase()) {
      case 'critical': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
      case 'major': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      case 'high': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20';
      default: return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
    }
  };
  const getIcon = () => {
    if (type === 'bugs') return <AlertTriangle className="text-rose-500 dark:text-rose-400" size={20} />;
    if (type === 'security') return <ShieldAlert className="text-purple-500 dark:text-purple-400" size={20} />;
    return <Zap className="text-amber-500 dark:text-amber-400" size={20} />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">{getIcon()}</div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.title || "Issue Detected"}</h3>
        </div>
        {item.severity && <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getSeverityStyles(item.severity)}`}>{item.severity}</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 leading-relaxed pl-[54px]">{item.description || item.message}</p>
      {item.line && <div className="ml-[54px] bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-sm text-gray-200 overflow-x-auto mb-4 shadow-inner"><span className="text-slate-500 mr-4">{'>>'}</span>{item.line}</div>}
      {item.suggestion && <div className="ml-[54px] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-xl flex items-start gap-3"><CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /><div className="text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed"><span className="font-bold block mb-1">Recommendation</span>{item.suggestion}</div></div>}
    </div>
  );
};

export default NewReview;