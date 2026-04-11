import React, { useState, useMemo } from 'react';
import { Search, Code, Clock, Trash2, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert, Zap, CheckCircle, Loader2, FileCode, History } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const MyReviews = () => {
  const { reviews, loading } = useCodeHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    return reviews.filter(review => review.code?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [reviews, searchTerm]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getIssueCount = (reviewContent) => {
    if (!reviewContent) return { bugs: 0, security: 0, improvements: 0, total: 0 };
    const bugs = reviewContent.bugs?.length || 0;
    const security = reviewContent.security?.length || 0;
    const improvements = reviewContent.improvements?.length || 0;
    return { bugs, security, improvements, total: bugs + security + improvements };
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this review history?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "reviews", id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      alert("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] font-sans w-full transition-colors duration-300">
      
      {/* FIXED HEADER */}
      <div className="shrink-0 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <History className="text-indigo-600 dark:text-indigo-400 hidden sm:block" size={24} />
            Review History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Browse, search, and revisit your past AI code analyses.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search snippets..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all shadow-sm" />
        </div>
      </div>

      {/* SCROLLING CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto pb-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
              <p>Loading your history...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-12 text-center shadow-sm transition-colors duration-300">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCode size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">No reviews found</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{searchTerm ? "No snippets matched your search." : "You haven't analyzed any code yet."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const counts = getIssueCount(review.reviewContent);
                const isExpanded = expandedId === review.id;
                
                return (
                  <div key={review.id} className={`bg-white dark:bg-slate-900 border transition-all duration-300 shadow-sm overflow-hidden ${isExpanded ? 'border-indigo-200 dark:border-indigo-500/30 rounded-2xl' : 'border-gray-100 dark:border-slate-800 rounded-xl hover:border-indigo-100 hover:shadow-md'}`}>
                    <div onClick={() => setExpandedId(isExpanded ? null : review.id)} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl shrink-0"><Code size={20} className="text-indigo-600 dark:text-indigo-400" /></div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{review.code ? review.code.split('\n')[0].trim() || "Unnamed Snippet" : "Empty Snippet"}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(review.timestamp)}</span><span>•</span><span>{review.linesOfCode || 0} lines</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex gap-2">
                          {counts.total === 0 ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-100 dark:border-emerald-500/20"><CheckCircle size={12} /> Clean</span>
                          ) : (
                            <>
                              {counts.bugs > 0 && <span className="px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-1"><AlertTriangle size={12}/> {counts.bugs}</span>}
                              {counts.security > 0 && <span className="px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold flex items-center gap-1"><ShieldAlert size={12}/> {counts.security}</span>}
                              {counts.improvements > 0 && <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-1"><Zap size={12}/> {counts.improvements}</span>}
                            </>
                          )}
                        </div>
                        <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 hidden lg:block mx-1"></div>
                        <button onClick={(e) => handleDelete(review.id, e)} disabled={deletingId === review.id} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                          {deletingId === review.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 p-6 flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><FileCode size={16}/> Original Snippet</h5>
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-sm text-gray-300 overflow-x-auto max-h-[400px] shadow-inner no-scrollbar">
                            <pre><code>{review.code}</code></pre>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Zap size={16}/> Analysis Feedback</h5>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                            {counts.total === 0 ? (
                               <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle size={20} className="text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Code is perfectly optimized and secure.</span>
                               </div>
                            ) : (
                              <>
                                {review.reviewContent?.bugs?.map((bug, i) => (
                                  <div key={`bug-${i}`} className="bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-500/20 p-4 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-rose-500" /><span className="font-bold text-sm text-gray-900 dark:text-white">{bug.title}</span></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{bug.description}</p>
                                  </div>
                                ))}
                                {review.reviewContent?.security?.map((sec, i) => (
                                  <div key={`sec-${i}`} className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-500/20 p-4 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-2 mb-2"><ShieldAlert size={16} className="text-purple-500" /><span className="font-bold text-sm text-gray-900 dark:text-white">{sec.title}</span></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{sec.description}</p>
                                  </div>
                                ))}
                                {review.reviewContent?.improvements?.map((imp, i) => (
                                  <div key={`imp-${i}`} className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-2 mb-2"><Zap size={16} className="text-amber-500" /><span className="font-bold text-sm text-gray-900 dark:text-white">{imp.title}</span></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{imp.description}</p>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;