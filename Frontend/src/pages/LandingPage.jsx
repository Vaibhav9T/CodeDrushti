import React from 'react';
import { Search, ShieldCheck, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }

  const handleGetStarted = () => {
    navigate('/register');
  }
  return (
    <div className="px-12 py-20 max-w-7xl mx-auto">
      <div className="bg-[#111a1f] rounded-3xl p-16 border border-gray-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] pointer-events-none" />
        
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
              Elevate Your Code Quality with <span className="text-cyan-400">AI.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              CodeDrushti automates code reviews to save time and improve standards, 
              providing instant analysis, security checks, and refactoring tips.
            </p>
            
            <div className="flex space-x-4 md:flex-row flex-col md:space-y-0 space-y-4">
              <button className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer" onClick={handleGetStarted}>
                Get Started
              </button>
              <button className="bg-[#1c2b33] hover:bg-[#253842] text-white font-medium px-8 py-3 rounded-lg border border-gray-700 transition-all cursor-pointer" onClick={handleLogin}>
                Login
              </button>
            </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-4 text-white">Why CodeDrushti?</h2>
        <p className="text-gray-400 mb-10">Our AI-powered platform provides instant, actionable feedback.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <FeatureCard 
            icon={<Search className="text-cyan-400" size={32} />}
            title="Instant Analysis"
            desc="Get AI-powered, real-time feedback on your code as you write it."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-cyan-400" size={32} />}
            title="Security Checks"
            desc="Identify and fix vulnerabilities before they ever reach production."
          />
          <FeatureCard 
            icon={<Wand2 className="text-cyan-400" size={32} />}
            title="Refactoring Tips"
            desc="Receive intelligent suggestions for cleaner, more efficient, and maintainable code."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#111a1f] p-8 rounded-2xl border border-gray-800 hover:border-cyan-900/50 hover:bg-[#142026] transition-all group">
      <div className="mb-4 transform group-hover:-translate-y-1 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}