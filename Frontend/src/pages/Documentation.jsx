import React from 'react';
import { projectInfo, docSections } from '../utils/data'; 

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-600 dark:text-gray-300 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        
        <header className="mb-12 border-b border-gray-100 dark:border-slate-800 pb-8 transition-colors duration-300">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-4">
            Documentation
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">{projectInfo.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>v{projectInfo.version}</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>Updated: {projectInfo.lastUpdated}</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>Author: {projectInfo.author}</span>
          </div>
        </header>

        <div className="space-y-16">
          {docSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3 transition-colors duration-300">
                {section.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg transition-colors duration-300">
                {section.content}
              </p>

              {section.subsections && (
                <div className="grid gap-6 md:grid-cols-2">
                  {section.subsections.map((sub, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-sm transition-all duration-300">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                        {sub.subtitle}
                      </h3>
                      <ul className="space-y-3">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                            <span className="text-indigo-500 mt-1 font-bold text-lg leading-none">•</span>
                            <span dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>') 
                            }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-gray-100 dark:border-slate-800 text-center text-sm font-medium text-gray-400 dark:text-gray-500 transition-colors duration-300">
          <p>© {new Date().getFullYear()} CodeDrushti. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
export default Documentation;