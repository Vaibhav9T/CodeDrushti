import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Shield, Zap, Search, Lock, Cpu, Sparkles, CheckCircle2, Star, ShieldAlert, GitMerge } from 'lucide-react';

const pop = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const flow = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const nav = useNavigate();
  const { scrollYProgress: scroll } = useScroll();
  const y = useTransform(scroll, [0, 1], [0, 250]);
  const fade = useTransform(scroll, [0, 0.3], [1, 0]);

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#020202] min-h-screen text-[#1d1d1f] dark:text-[#f5f5f7] font-sans overflow-x-hidden selection:bg-indigo-500/20 transition-colors duration-700">
      
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_10%,transparent_100%)]" />
        <motion.div style={{ y }} className="absolute w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 dark:from-indigo-500/15 dark:via-purple-500/10 dark:to-cyan-500/15 blur-[120px] rounded-full top-[-15%] opacity-50 dark:opacity-60" />
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-6">
        <motion.div 
          initial="hidden" animate="visible" variants={flow}
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          <motion.div variants={pop} className="mb-12 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs tracking-widest uppercase text-black/60 dark:text-white/60 font-light">CodeDrushti Engine v2.0</span>
          </motion.div>

          <motion.h1 variants={pop} className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-extralight tracking-tighter leading-[1.05] mb-8 text-[#1d1d1f] dark:text-white">
            Flawless Code. <br className="hidden md:block" />
            <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
              By Design.
            </span>
          </motion.h1>

          <motion.p variants={pop} className="text-xl md:text-2xl font-light text-[#555555] dark:text-[#a1a1a6] max-w-3xl mb-14 leading-relaxed tracking-wide">
            Proactive AI analysis that understands your architecture. Detect vulnerabilities, optimize performance, and ship with absolute certainty.
          </motion.p>

          <motion.div variants={pop} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <button onClick={() => nav('/register')} className="px-10 py-4 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#030303] text-lg font-light hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3">
              Start Analyzing <ArrowRight size={18} strokeWidth={1.5} />
            </button>
            <button onClick={() => nav('/login')} className="px-10 py-4 rounded-full bg-white/40 dark:bg-white/5 text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/10 dark:border-white/10 text-lg font-light hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-500 backdrop-blur-xl">
              Sign In
            </button>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: fade, y }} className="mt-28 w-full max-w-5xl relative perspective-[2000px]">
          <HeroMockup />
        </motion.div>
      </section>

      <section className="relative z-10 py-32 bg-white/50 dark:bg-[#060606]/50 backdrop-blur-md border-y border-black/5 dark:border-white/5 transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 text-[#1d1d1f] dark:text-white">Intelligence at every layer.</h2>
            <p className="text-xl text-[#555555] dark:text-[#a1a1a6] max-w-2xl mx-auto font-light tracking-wide leading-relaxed">A suite of precision tools engineered to transform how you write, review, and deploy modern software.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <BentoBox className="md:col-span-8 h-[380px]" hue="from-indigo-500/5 to-purple-500/5">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                    <Cpu size={24} strokeWidth={1} />
                  </div>
                  <h3 className="text-3xl font-normal tracking-tight mb-4 text-[#1d1d1f] dark:text-white">RAG-Powered Context Analysis.</h3>
                  <p className="text-lg text-[#555555] dark:text-[#a1a1a6] font-light leading-relaxed">CodeDrushti doesn't just read syntax. It leverages LLMs with sophisticated RAG pipelines to understand the true intent behind your entire application graph.</p>
                </div>
                <div className="hidden md:flex w-[40%] items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-l from-white dark:from-[#080808] z-10 pointer-events-none" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="relative w-48 h-48 border border-black/5 dark:border-white/5 rounded-full flex items-center justify-center">
                     <div className="w-32 h-32 border border-black/5 dark:border-white/10 rounded-full flex items-center justify-center">
                        <Sparkles size={32} className="text-indigo-400 opacity-50" strokeWidth={1} />
                     </div>
                  </motion.div>
                </div>
              </div>
            </BentoBox>

            <BentoBox className="md:col-span-4 h-[380px]" hue="from-rose-500/5 to-orange-500/5">
              <div className="flex flex-col h-full justify-center">
                <Shield size={40} className="text-rose-400 mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-normal tracking-tight mb-4 text-[#1d1d1f] dark:text-white">Zero-Day Security.</h3>
                <p className="text-[#555555] dark:text-[#a1a1a6] font-light text-lg leading-relaxed">Identify OWASP vulnerabilities and hardcoded secrets before they reach your repository.</p>
              </div>
            </BentoBox>

            <BentoBox className="md:col-span-4 h-[380px]" hue="from-cyan-500/5 to-blue-500/5">
               <div className="flex flex-col h-full justify-center">
                <Zap size={40} className="text-cyan-400 mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-normal tracking-tight mb-4 text-[#1d1d1f] dark:text-white">Microsecond Profiling.</h3>
                <p className="text-[#555555] dark:text-[#a1a1a6] font-light text-lg leading-relaxed">Detect memory leaks and structural inefficiencies. Optimize loops and complexities automatically.</p>
              </div>
            </BentoBox>

            <BentoBox className="md:col-span-8 h-[380px] overflow-hidden" hue="from-emerald-500/5 to-teal-500/5">
              <div className="flex flex-col md:flex-row gap-10 h-full items-center">
                <div className="flex-1">
                   <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    <GitMerge size={24} strokeWidth={1} />
                  </div>
                  <h3 className="text-3xl font-normal tracking-tight mb-4 text-[#1d1d1f] dark:text-white">Automated Code Reviews.</h3>
                  <p className="text-lg text-[#555555] dark:text-[#a1a1a6] font-light leading-relaxed mb-8">Generate elegant, actionable feedback loops that track technical debt reduction and refactoring patterns directly in your PRs.</p>
                </div>
                <div className="w-full md:w-[45%] h-full relative flex items-center">
                  <div className="w-full bg-[#fcfcfc] dark:bg-[#0a0a0a] rounded-2xl border border-black/5 dark:border-white/5 p-6 flex flex-col gap-4 transform-gpu -rotate-3 scale-105">
                    {[60, 85, 45, 90].map((val, idx) => (
                      <div key={idx} className="w-full h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} transition={{ duration: 1.5, delay: idx * 0.15, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 dark:from-emerald-500/60 dark:to-teal-500/60 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BentoBox>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#fcfcfc] dark:bg-[#020202] relative overflow-hidden transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 text-[#1d1d1f] dark:text-white">Trusted by engineers.</h2>
            <p className="text-xl text-[#555555] dark:text-[#a1a1a6] max-w-2xl mx-auto font-light tracking-wide">See how teams are reducing technical debt and shipping faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewBox 
              usr="Sarah Jenkins"
              job="Lead Architect"
              msg="CodeDrushti caught a critical injection flaw that static analyzers missed. It understands context, not just syntax. An essential asset."
              stars={5}
            />
            <ReviewBox 
              usr="David Chen"
              job="Full-Stack Developer"
              msg="The suggestions are like having a senior developer pair programming with you. It transformed our legacy codebase gracefully."
              stars={5}
            />
            <ReviewBox 
              usr="Elena Rodriguez"
              job="VP of Engineering"
              msg="The automated reviews provide a clear view of our code health. We've reduced PR wait times significantly since integrating this."
              stars={5}
            />
          </div>
        </div>
      </section>

      <section className="py-32 bg-white/30 dark:bg-[#040404]/30 relative z-10 border-t border-black/5 dark:border-white/5 transition-colors duration-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-[#080808] rounded-[40px] p-16 relative overflow-hidden border border-black/5 dark:border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5" />
            <h2 className="text-5xl md:text-7xl font-extralight text-[#1d1d1f] dark:text-white tracking-tighter mb-8 relative z-10">
              Your best code.<br/>Awaits.
            </h2>
            <p className="text-xl text-[#555555] dark:text-[#a1a1a6] max-w-xl mx-auto font-light mb-12 relative z-10 tracking-wide leading-relaxed">
              Join developers who are writing cleaner, faster, and more secure logic today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5 relative z-10">
               <button onClick={() => nav('/register')} className="px-10 py-4 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#030303] text-lg font-light hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3">
                 Get Started Free <ArrowRight size={18} strokeWidth={1.5} />
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#fcfcfc] dark:bg-[#020202] py-12 border-t border-black/5 dark:border-white/5 text-center text-[#86868b] font-light transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Code2 size={20} className="text-[#1d1d1f] dark:text-white" strokeWidth={1} />
            <span className="text-[#1d1d1f] dark:text-white font-normal text-xl tracking-tight">CodeDrushti</span>
          </div>
          <p className="tracking-wide text-sm">© 2026 CodeDrushti Engine. All rights reserved.</p>
          <div className="flex gap-8 text-sm tracking-wide">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const BentoBox = ({ children, className, hue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-[#fcfcfc] dark:bg-[#080808] rounded-[32px] p-10 border border-black/5 dark:border-white/5 dark:hover:border-white/10 transition-all duration-700 overflow-hidden group ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${hue} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

const ReviewBox = ({ usr, job, msg, stars }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#fcfcfc] dark:bg-[#080808] p-8 rounded-[32px] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 flex flex-col justify-between"
    >
      <div>
        <div className="flex gap-1 mb-6 text-indigo-400">
          {[...Array(stars)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />)}
        </div>
        <p className="text-lg text-[#1d1d1f] dark:text-[#d4d4d4] font-light leading-relaxed mb-8 tracking-wide">"{msg}"</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-black/5 dark:border-white/5 flex items-center justify-center text-[#1d1d1f] dark:text-white font-normal text-lg">
          {usr.charAt(0)}
        </div>
        <div>
          <h4 className="font-normal text-[#1d1d1f] dark:text-white text-base">{usr}</h4>
          <p className="text-sm text-[#86868b] font-light tracking-wide">{job}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HeroMockup = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setStep((val) => (val + 1) % 3);
    }, 4500);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] border border-black/10 dark:border-white/10 overflow-hidden transform-gpu rotate-x-[8deg] rotate-y-[-2deg] scale-100 md:scale-105">
      <div className="h-12 bg-[#111111] border-b border-white/5 flex items-center px-5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="mx-auto px-5 py-1.5 rounded-full bg-[#050505] border border-white/5 flex items-center gap-2.5 text-[11px] text-[#86868b] font-light tracking-widest uppercase">
          <Lock size={10} strokeWidth={1.5} /> engine.ts
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-[500px]">
        <div className="w-full md:w-1/2 p-6 font-mono text-sm leading-loose bg-[#050505] text-[#d4d4d4] overflow-hidden relative border-r border-white/5">
          <div className="flex">
            <div className="w-8 text-[#404040] text-right pr-5 select-none flex flex-col font-extralight">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
            </div>
            <div className="flex-1 flex flex-col font-light tracking-wide">
              <p><span className="text-[#569cd6]">const</span> <span className="text-[#dcdcaa]">processPayment</span> = <span className="text-[#569cd6]">async</span> (req) =&gt; {'{'}</p>
              <p className="pl-6"><span className="text-[#569cd6]">const</span> {'{'} amount, userId {'}'} = req.body;</p>
              <div className="relative my-0.5">
                <AnimatePresence>
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-rose-500/10 border-y border-rose-500/20 w-[120%]" style={{ marginLeft: '-10%' }} />
                  )}
                </AnimatePresence>
                <p className="pl-6 relative z-10"><span className="text-[#569cd6]">const</span> query = <span className="text-[#ce9178]">`UPDATE accounts SET bal = bal - ${'{amount}'} WHERE id = ${'{userId}'}`</span>;</p>
              </div>
              <p className="pl-6"><span className="text-[#c586c0]">await</span> db.execute(query);</p>
              <p className="pl-6"><span className="text-[#c586c0]">return</span> {'{'} status: <span className="text-[#ce9178]">'success'</span> {'}'};</p>
              <p>{'}'};</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-[#080808] p-8 relative overflow-hidden">
           <AnimatePresence mode="wait">
             {step === 0 && (
               <motion.div key="st0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-[#86868b] font-light">
                 <div className="relative mb-6">
                   <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
                   <Search size={40} className="relative z-10 text-indigo-400/80 animate-pulse" strokeWidth={1} />
                 </div>
                 <p className="font-mono text-xs tracking-widest uppercase opacity-80">Parsing application graph</p>
               </motion.div>
             )}
             {step === 1 && (
               <motion.div key="st1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }} className="h-full flex flex-col justify-center">
                 <div className="bg-[#050505] border border-rose-500/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/40" />
                   <div className="flex items-center gap-2.5 text-rose-400/90 font-light mb-4 tracking-widest text-[11px] uppercase">
                     <ShieldAlert size={14} strokeWidth={1.5} /> Critical Vulnerability
                   </div>
                   <h4 className="text-white text-xl font-light mb-2">SQL Injection Risk</h4>
                   <p className="text-[#86868b] text-sm font-light mb-6 leading-relaxed">Direct interpolation allows arbitrary command execution.</p>
                   <div className="text-xs font-mono bg-white/5 p-4 rounded-xl text-[#d4d4d4] font-light border border-white/5 leading-loose">
                     Severity: 9.8 (CVSS) <br/>
                     Pattern: CWE-89
                   </div>
                 </div>
               </motion.div>
             )}
             {step === 2 && (
               <motion.div key="st2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }} className="h-full flex flex-col justify-center">
                 <div className="bg-[#050505] border border-emerald-500/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40" />
                   <div className="flex items-center gap-2.5 text-emerald-400/90 font-light mb-4 tracking-widest text-[11px] uppercase">
                     <CheckCircle2 size={14} strokeWidth={1.5} /> Auto Resolution
                   </div>
                   <h4 className="text-white text-xl font-light mb-4">Parameterized Fix</h4>
                   <div className="font-mono text-[12px] leading-loose bg-white/5 p-5 rounded-xl flex flex-col gap-3 font-light border border-white/5">
                     <span className="text-rose-400/40 line-through truncate">`UPDATE accounts SET bal...`</span>
                     <span className="text-emerald-400/90">db.execute('UPDATE accounts SET bal = bal - ? WHERE id = ?', [amount, userId])</span>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};