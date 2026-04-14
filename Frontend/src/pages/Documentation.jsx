import React from 'react';
import { BookOpen, Clock, User, ChevronRight } from 'lucide-react';
import { projectInfo, docSections } from '../utils/data';

const Documentation = () => {
  // Reduces the output to only show the first 2 sections
  const conciseDocs = docSections.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans selection:bg-black/10 dark:selection:bg-white/10 overflow-x-hidden transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        
        {/* Header Area */}
        <header className="mb-20 border-b border-black/5 dark:border-white/5 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[#1d1d1f] dark:text-[#e5e5e5] text-[11px] tracking-widest uppercase font-light mb-8">
            <BookOpen size={12} strokeWidth={1.5} />
            Documentation
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8 text-[#1d1d1f] dark:text-white">
            {projectInfo.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-5 text-[#86868b] font-light text-sm tracking-wide">
            <span className="flex items-center gap-2">
              Version {projectInfo.version}
            </span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
            <span className="flex items-center gap-2">
              <Clock size={14} strokeWidth={1.5} />
              {projectInfo.lastUpdated}
            </span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
            <span className="flex items-center gap-2">
              <User size={14} strokeWidth={1.5} />
              {projectInfo.author}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-24">
          {conciseDocs.map((section) => (
            <section key={section.id} id={section.id}>
              
              <h2 className="text-2xl font-normal text-[#1d1d1f] dark:text-white mb-5 tracking-wide">
                {section.title}
              </h2>
              
              <p className="text-lg text-[#555555] dark:text-[#a1a1a6] font-light leading-relaxed mb-12 max-w-3xl">
                {section.content}
              </p>

              {section.subsections && (
                <div className="space-y-12 pl-2 md:pl-6 border-l border-black/5 dark:border-white/5">
                  {section.subsections.map((sub, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-normal text-[#1d1d1f] dark:text-[#e5e5e5] mb-5 tracking-wide">
                        {sub.subtitle}
                      </h3>
                      
                      <ul className="space-y-4">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-[#555555] dark:text-[#a1a1a6] font-light leading-relaxed">
                            <ChevronRight size={16} className="text-black/30 dark:text-white/30 mt-1 flex-shrink-0" strokeWidth={1} />
                            <span dangerouslySetInnerHTML={{ 
                              // Replaces markdown bold (**) with a font-normal span to adhere to no-bold rules
                              __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="font-normal text-[#1d1d1f] dark:text-[#e5e5e5]">$1</span>') 
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

        {/* Footer Area */}
        <footer className="mt-32 pt-8 border-t border-black/5 dark:border-white/5 text-[#86868b] font-light text-sm tracking-wide">
          <p>© {new Date().getFullYear()} CodeDrushti. All rights reserved.</p>
        </footer>
        
      </div>
    </div>
  );
};

export default Documentation;