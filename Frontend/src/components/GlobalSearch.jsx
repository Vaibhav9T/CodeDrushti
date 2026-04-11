import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Code, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCodeHistory } from '../contexts/codeHistoryContext'; // Import your context

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Pull all reviews directly from memory
  const { reviews } = useCodeHistory();

  // Instantly filter results as the user types
  const results = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];

    const lowerCaseTerm = searchTerm.toLowerCase();
    
    // Filter the reviews: Check if the search term exists ANYWHERE in the code
    return reviews.filter(review => 
      review.code && review.code.toLowerCase().includes(lowerCaseTerm)
    ).slice(0, 5); // Keep the UI clean by only showing the top 5 matches
    
  }, [searchTerm, reviews]);

  // Close dropdown if user clicks outside of the search box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm('');
    navigate('/reviews'); // Or navigate to a specific review detail page if you build one!
  };

  return (
    <div className="relative w-full max-w-md z-50" ref={searchRef}>
      {/* SEARCH INPUT */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => { if (searchTerm.length >= 2) setIsOpen(true); }}
          placeholder="Search snippets (e.g. auth, fetch, config)..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-500/40 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
        />
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (searchTerm.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No matching code found.
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  onClick={handleResultClick}
                  className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg shrink-0">
                      <Code size={14} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {/* Show the first line of the code snippet */}
                        {result.code.split('\n')[0].substring(0, 35)}...
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {result.linesOfCode || 0} lines
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;