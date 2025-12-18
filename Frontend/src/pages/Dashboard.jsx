import React, { useState, useRef, useLayoutEffect } from 'react';
import { 
  Play, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  CheckCircle, 
  FileCode, 
  Loader2 ,
  Upload
} from 'lucide-react';

import {v4 as uuidv4} from 'uuid';
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db, auth } from '../utils/firebase';
import { useSidebar } from '../contexts/SidebarContext';


const Dashboard = () => {

  const textareaRef = useRef(null);
  const [value, setValue] = useState('');
  const MIN_TEXTAREA_HEIGHT = 32; 

  

  useLayoutEffect(() => {
    // Check if the ref is connected to a DOM element
    if (textareaRef.current) {
      // Reset height to "inherit" to recalculate the scrollHeight correctly (important for shrinking)
      textareaRef.current.style.height = 'inherit';
      
      // Set the height to the scrollHeight or a minimum height
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [value]);

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bugs');
  const [analysisResult, setAnalysisResult] = useState(null);
  const { isCollapsed, isMobile, toggleSidebar, isTablet } = useSidebar();

  const saveReviewToHistory = async (code, reviewResult) => {
 

  if (!auth.currentUser) return;

  const reviewId = uuidv4();
  await setDoc(doc(db, "reviews", reviewId), {
    userId: auth.currentUser.uid,
    code: code,
    reviewContent: reviewResult,
    linesOfCode: code.split('\n').length, // Save line count for easy math later
    timestamp: serverTimestamp(),
    // Optional: save timeTaken if you track how long the AI took
    timeTakenMs: 1500 // example
  });
};
  // ---------------------------------------------------------------------------
  // 🔴 STEP 1: PASTE YOUR RENDER BACKEND URL HERE
  // Example: "https://my-app.onrender.com/ai/get-review"
  // Do not keep the trailing slash at the root, but include the specific endpoint path.
  const BACKEND_URL = "https://codedrushti.onrender.com/ai/get-review"; 
  // ---------------------------------------------------------------------------

  const fileInputRef = useRef(null);

  const onUploadFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          setCode(fileContent);
          setValue(fileContent);
        }
        reader.readAsText(file);
      }
    };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {

    if (!code.trim()) {
      alert("Please paste some code first!");
      return;
    }
    
    setIsLoading(true);
    setAnalysisResult(null); // Clear previous results

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Ensure your backend expects "code" as the key. 
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      
      // If your backend returns the raw AI string instead of JSON, you might see an error.
      // Ideally, your backend should return: { bugs: [], improvements: [], security: [] }
      setAnalysisResult(data);

    } catch (error) {
      console.error("Analysis Failed:", error);
      alert("Failed to connect to the backend. Check the console for details.");
    } finally {
      setIsLoading(false); 
    }

    
  };

  return (
    <div className="px-12 py-20 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stuck on a coding problem? Let Code Drushti help</h1>
        <p className="text-gray-400">Paste your code below or drag and drop a file to get started.</p>
      </div>

      {/* INPUT AREA */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-[#111a1f] rounded-2xl border border-gray-800 p-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setValue(e.target.value);
            }}
            placeholder="// Paste your code here..."
            className="w-full h-64 bg-[#0d1317] text-gray-300 p-6 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500/50 font-mono text-sm resize-none max-h-96 no-scrollbar overflow-y-auto no-scrollbar"
            spellCheck="false"
          />
          
          {/* ACTION BAR */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#111a1f] rounded-b-xl border-t border-gray-800">
             <div className="flex space-x-4 text-xs text-gray-500">
                <span className="flex items-center hover:text-cyan-400 cursor-pointer transition "><FileCode size={14} className="mr-1"/> Auto-Detect Language</span>
             </div>

            <div className="space-x-4 ">
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.rb,.go,.php,.html,.css,.json,.xml,.swift,.kt,.rs"
                onChange={onUploadFile}
                className="hidden"
                id="file-upload"
              />
              <button
                onClick={handleUploadClick}
                className="flex items-center px-4 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all cursor-pointer bg-linear-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/25 active:scale-95 text-center"
              >
                {
                  !isMobile || isTablet ? (
                <>
                  <Upload size={16} className="mr-2 fill-current" />
                  Upload File
                </>
                  ) : (
                    <Upload size={16} className="fill-current gap-2" />
                  )
                }
              </button>

            </div>
              
             <button 
              onClick={async () => {
                await handleAnalyze();
                if (analysisResult) {
                  await saveReviewToHistory(code, analysisResult);
                }
              }}
              disabled={isLoading || !code}
              className={`
                flex items-center px-6 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all cursor-pointer
                ${isLoading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-linear-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/25 active:scale-95'
                }
              `}
            >
              {
              !isMobile ? (
                <>
                {
                  isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play size={18} className="mr-2 fill-current" />
                  Analyze Code
                </>
                
              )}
              </>
              ) : (
                <>
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Play size={18} className="fill-current" />
                )
            }
            </>
              )
              }
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      {analysisResult && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6">Analysis Results</h2>

          {/* TABS */}
          <div className="flex space-x-6 border-b border-gray-800 mb-6">
            <TabButton label="Bugs" count={analysisResult.bugs?.length} active={activeTab === 'bugs'} onClick={() => setActiveTab('bugs')} />
            <TabButton label="Improvements" count={analysisResult.improvements?.length} active={activeTab === 'improvements'} onClick={() => setActiveTab('improvements')} />
            <TabButton label="Security" count={analysisResult.security?.length} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          </div>

          {/* CARDS LIST */}
          <div className="space-y-4">
             {analysisResult[activeTab]?.length > 0 ? (
               analysisResult[activeTab].map((item, index) => (
                 <ResultCard key={index} item={item} type={activeTab} />
               ))
             ) : (
               <div className="text-gray-500 text-center py-10 bg-[#111a1f] rounded-xl border border-gray-800 border-dashed">
                 <CheckCircle size={48} className="mx-auto mb-3 text-green-500/50" />
                 <p>No issues found in this category. Great job!</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const TabButton = ({ label, count, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer ${active ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {label}
    {count > 0 && <span className="ml-2 bg-gray-800 text-xs px-2 py-0.5 rounded-full text-gray-300">{count}</span>}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
  </button>
);

const ResultCard = ({ item, type }) => {
  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'major': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'high': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getIcon = () => {
    if (type === 'bugs') return <AlertTriangle className="text-red-400" size={20} />;
    if (type === 'security') return <ShieldAlert className="text-purple-400" size={20} />;
    return <Zap className="text-yellow-400" size={20} />;
  };

  return (
    <div className="bg-[#111a1f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-lg">{getIcon()}</div>
          <h3 className="font-bold text-lg text-gray-200">{item.title || "Issue Detected"}</h3>
        </div>
        {item.severity && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(item.severity)}`}>
            {item.severity}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4 leading-relaxed pl-[52px]">
        {item.description || item.message}
      </p>

      {item.line && (
        <div className="ml-[52px] bg-[#0d1317] p-4 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto">
          {item.line}
        </div>
      )}

      {item.suggestion && (
        <div className="ml-[52px] mt-3 flex items-start gap-2 text-sm text-green-400/90">
           <CheckCircle size={16} className="mt-0.5 shrink-0" />
           <span>Suggestion: {item.suggestion}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;