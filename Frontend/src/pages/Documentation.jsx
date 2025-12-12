import React from 'react';
import { projectInfo, docSections } from '../utils/data'; // Import your data
// import { Book, FileText, Server, Database, Layers } from 'lucide-react'; // Optional icons

const Documentation = () => {
  return (
    <div className="min-h-screen bg-[#0f1214] text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{projectInfo.title}</h1>
          <div className="flex gap-6 text-sm text-gray-400">
            <span>v{projectInfo.version}</span>
            <span>Updated: {projectInfo.lastUpdated}</span>
            <span>Author: {projectInfo.author}</span>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <div className="space-y-12">
          {docSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              
              {/* Section Title */}
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-3">
                {section.title}
              </h2>
              
              {/* Main Content */}
              <p className="text-gray-300 leading-relaxed mb-6">
                {section.content}
              </p>

              {/* Subsections (if any) */}
              {section.subsections && (
                <div className="grid gap-6 md:grid-cols-2">
                  {section.subsections.map((sub, index) => (
                    <div key={index} className="bg-[#161b22] p-6 rounded-xl border border-gray-800 hover:border-cyan-500/30 transition-colors">
                      <h3 className="text-lg font-medium text-white mb-3">
                        {sub.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-cyan-500 mt-1">•</span>
                            {/* Simple markdown parser for bold text */}
                            <span dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>') 
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

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2025 CodeDrushti. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Documentation;