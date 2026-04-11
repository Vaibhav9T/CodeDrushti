import React from 'react';
import { Search, ShieldCheck, Wand2, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraFeatureCard } from '../components/Animations';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }

  const handleGetStarted = () => {
    navigate('/register');
  }

  return (
    <div className="px-6 py-20 lg:px-12 max-w-7xl mx-auto min-h-screen transition-colors duration-300">
      
      {/* HERO SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 lg:p-16 border border-gray-100 dark:border-slate-800 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-300 mt-8">
        
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-50 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300" />
           
               <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-100/50 dark:border-indigo-500/20 backdrop-blur-sm transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>CodeDrushti 2.0 is live</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white transition-colors duration-300">
            Elevate Your Code Quality with <span className="text-indigo-600 dark:text-indigo-400">AI.</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl transition-colors duration-300">
            CodeDrushti automates code reviews to save time and improve standards, 
            providing instant analysis, security checks, and refactoring tips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="group flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg dark:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer" 
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98] backdrop-blur-sm cursor-pointer" 
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>

        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Why CodeDrushti?</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors duration-300">
            Our AI-powered platform integrates seamlessly into your workflow to provide instant, actionable feedback.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          
         

          {/* 2. THE THREE SUPPORTING CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="text-indigo-600 dark:text-indigo-400" size={28} />}
              title="Instant Analysis"
              desc="Get AI-powered, real-time feedback on your architecture and logic as you write your code."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={28} />}
              title="Security Checks"
              desc="Identify and fix critical vulnerabilities and logic flaws before they ever reach production."
            />
            <FeatureCard 
              icon={<Wand2 className="text-indigo-600 dark:text-indigo-400" size={28} />}
              title="Refactoring Tips"
              desc="Receive intelligent, contextual suggestions for cleaner, more efficient, and maintainable code."
            />
          </div>
          
        </div>
      </section>
    </div>
  );
}

// Standard Feature Card Component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:bg-slate-800/80 hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white transition-colors duration-300">{title}</h3>
      <p className="text-gray-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">{desc}</p>
    </div>
  );
}