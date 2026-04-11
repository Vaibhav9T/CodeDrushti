import React, { useMemo } from 'react';
import { 
  FileText, Download, BarChart3, ShieldCheck, 
  AlertTriangle, ShieldAlert, Zap, Loader2, Code 
} from 'lucide-react';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Reports = () => {
  const { reviews, loading } = useCodeHistory();

  // Aggregate Data for the Analytics
  const analytics = useMemo(() => {
    let totalBugs = 0;
    let totalSecurity = 0;
    let totalImprovements = 0;
    let totalLines = 0;

    reviews.forEach(r => {
      totalLines += r.linesOfCode || 0;
      const content = r.reviewContent || {};
      totalBugs += content.bugs?.length || 0;
      totalSecurity += content.security?.length || 0;
      totalImprovements += content.improvements?.length || 0;
    });

    const totalIssues = totalBugs + totalSecurity + totalImprovements;
    
    // Mock Health Score: 100 minus a penalty for every bug/security issue per 100 lines
    let healthScore = 100;
    if (totalLines > 0) {
      const penalty = ((totalBugs * 2) + (totalSecurity * 5)) / (totalLines / 100);
      healthScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    } else if (reviews.length === 0) {
      healthScore = 0;
    }

    return {
      totalBugs, totalSecurity, totalImprovements, totalIssues, healthScore
    };
  }, [reviews]);

  const handleDownload = (id) => {
    // In a real app, you would use a library like jsPDF to generate a PDF.
    // For now, we trigger the browser's print dialog to save as PDF.
    window.print();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] font-sans w-full transition-colors duration-300">
      
      {/* FIXED HEADER */}
      <div className="shrink-0 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <BarChart3 className="text-indigo-600 dark:text-indigo-400 hidden sm:block" size={24} />
            Analytics & Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">View aggregated insights and export your code quality data.</p>
        </div>
        
        <button 
          onClick={() => window.print()}
          disabled={reviews.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download size={18} /> Export Master Report
        </button>
      </div>

      {/* SCROLLING CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
              <p>Aggregating your data...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-12 text-center shadow-sm transition-colors duration-300">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">No Data Available</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Analyze some code to generate reports.</p>
            </div>
          ) : (
            <>
              {/* TOP ANALYTICS WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Health Score Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors duration-300">
                  <h3 className="text-gray-500 dark:text-gray-400 font-semibold mb-4">Overall Code Health</h3>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path 
                        className={`${analytics.healthScore > 80 ? 'text-emerald-500' : analytics.healthScore > 50 ? 'text-amber-500' : 'text-rose-500'}`} 
                        strokeDasharray={`${analytics.healthScore}, 100`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.healthScore}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Based on {reviews.length} total reviews
                  </p>
                </div>

                {/* Issue Breakdown Card */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-colors duration-300">
                  <h3 className="text-gray-500 dark:text-gray-400 font-semibold mb-6">Historical Issue Breakdown</h3>
                  
                  <div className="space-y-5">
                    {/* Security Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><ShieldAlert size={14} className="text-purple-500"/> Security Flaws</span>
                        <span className="text-gray-900 dark:text-white font-bold">{analytics.totalSecurity}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${analytics.totalIssues > 0 ? (analytics.totalSecurity / analytics.totalIssues) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    {/* Bugs Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><AlertTriangle size={14} className="text-rose-500"/> Bugs Detected</span>
                        <span className="text-gray-900 dark:text-white font-bold">{analytics.totalBugs}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5">
                        <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${analytics.totalIssues > 0 ? (analytics.totalBugs / analytics.totalIssues) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    {/* Improvements Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Zap size={14} className="text-amber-500"/> Optimizations Suggested</span>
                        <span className="text-gray-900 dark:text-white font-bold">{analytics.totalImprovements}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${analytics.totalIssues > 0 ? (analytics.totalImprovements / analytics.totalIssues) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* INDIVIDUAL REPORTS LIST */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Individual Exportable Reports</h3>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
                  <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
                    {reviews.map((review, index) => (
                      <div key={review.id} className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              Analysis Report #{reviews.length - index}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              Generated {formatDate(review.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="hidden sm:flex gap-3 text-sm font-medium mr-4">
                             <span className="text-rose-500">{review.reviewContent?.bugs?.length || 0} Bugs</span>
                             <span className="text-purple-500">{review.reviewContent?.security?.length || 0} Sec</span>
                          </div>
                          
                          <button 
                            onClick={() => handleDownload(review.id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <Download size={16} /> PDF
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Reports;