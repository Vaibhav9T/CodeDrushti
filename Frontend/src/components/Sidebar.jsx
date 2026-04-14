import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, History, PlusCircle, User, LogOut, BookOpen, LogIn, Menu, X, Code2, Bell,
  ShieldAlert, AlertTriangle, CheckCircle, CheckCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Navbar = () => {
  const loc = useLocation();
  const nav = useNavigate();
  const { isAuthenticated: isAuth, logout: logOff } = useAuth();
  const { reviews: revs } = useCodeHistory();
  
  const [mobMenu, setMobMenu] = useState(false);
  const [glow, setGlow] = useState(null); 
  
  const [alerts, setAlerts] = useState([]);
  const [alertsOn, setAlertsOn] = useState(false);
  const alertRef = useRef(null);
  
  const prevId = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    setMobMenu(false);
    setAlertsOn(false);
  }, [loc.pathname]);

  useEffect(() => {
    const clickOut = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setAlertsOn(false);
      }
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  useEffect(() => {
    if (!revs || revs.length === 0) return;

    const lastRev = revs[0];

    if (isFirst.current) {
      prevId.current = lastRev.id;
      isFirst.current = false;
      return;
    }

    if (lastRev.id !== prevId.current) {
      prevId.current = lastRev.id;

      const data = lastRev.reviewContent || {};
      const secNum = data.security?.length || 0;
      const bugNum = data.bugs?.length || 0;
      const impNum = data.improvements?.length || 0;
      
      const hasCrit = data.bugs?.some(b => ['critical', 'high'].includes(b.severity?.toLowerCase()));
      const hasMaj = data.bugs?.some(b => ['major'].includes(b.severity?.toLowerCase()));

      let status = 'success';
      let head = 'Review Clean';
      let msg = `Great job! Code is optimized.`;

      if (secNum > 0 || hasCrit) {
        status = 'danger';
        head = 'Critical Issues Detected';
        msg = `Found ${secNum} security flaws and ${bugNum} bugs.`;
      } else if (hasMaj || bugNum > 0) {
        status = 'warning';
        head = 'Bugs Detected';
        msg = `Found ${bugNum} bugs and ${impNum} suggestions.`;
      } else if (impNum > 0) {
        status = 'success';
        head = 'Review Complete';
        msg = `Found ${impNum} areas for improvement.`;
      }

      const newAlert = {
        id: Date.now(),
        title: head,
        message: msg,
        type: status,
        time: new Date(),
        read: false,
        reviewId: lastRev.id
      };

      setAlerts(p => [newAlert, ...p]);
      setGlow(status);

      const tick = setTimeout(() => setGlow(null), 6000);
      return () => clearTimeout(tick);
    }
  }, [revs]);

  const unread = alerts.filter(a => !a.read).length;

  const markRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const toggleAlerts = () => {
    setAlertsOn(!alertsOn);
    if (!alertsOn) {
      setGlow(null); 
      if (unread > 0) {
        markRead();
      }
    }
  };

  const isHere = (path) => loc.pathname === path;

  const authLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analyze', icon: PlusCircle, path: '/new-review' },
    { name: 'Reviews', icon: History, path: '/reviews' },
  ];

  const guestLinks = [
    { name: 'Features', icon: LayoutDashboard, path: '/' },
    { name: 'Docs', icon: BookOpen, path: '/docs' },
  ];

  const doLogOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      logOff(); 
      nav('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const getStyle = () => {
    switch(glow) {
      case 'danger': return 'border-rose-500/30 dark:border-rose-500/50 shadow-[0_0_50px_-10px_rgba(244,63,94,0.15)] dark:shadow-[0_0_50px_-10px_rgba(244,63,94,0.3)] bg-rose-50/90 dark:bg-rose-950/40';
      case 'warning': return 'border-amber-500/30 dark:border-amber-500/50 shadow-[0_0_50px_-10px_rgba(245,158,11,0.15)] dark:shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)] bg-amber-50/90 dark:bg-amber-950/40';
      case 'success': return 'border-emerald-500/30 dark:border-emerald-500/50 shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)] dark:shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] bg-emerald-50/90 dark:bg-emerald-950/40';
      default: return 'border-black/5 dark:border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] bg-white/80 dark:bg-[#050505]/80';
    }
  };

  const fmtTime = (d) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pointer-events-none">
      
      <div className={`pointer-events-auto w-full max-w-6xl backdrop-blur-3xl border rounded-[32px] px-5 py-3.5 flex items-center justify-between transition-all duration-700 ease-out ${getStyle()}`}>
        
        <Link to={isAuth ? "/dashboard" : "/"} className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-white shadow-sm dark:shadow-lg group-hover:scale-105 transition-all duration-500">
            <Code2 size={20} strokeWidth={1.5} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold dark:font-light text-[#1d1d1f] dark:text-white leading-none tracking-wide transition-colors duration-500">CodeDrushti</h1>
            <p className="text-[10px] font-bold dark:font-normal text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mt-1 opacity-80 transition-colors duration-500">Intelligence</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {(isAuth ? authLinks : guestLinks).map((lnk) => (
            <Link 
              key={lnk.name} to={lnk.path} 
              className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium dark:font-normal transition-all duration-500 overflow-hidden group
                ${isHere(lnk.path) ? 'text-[#1d1d1f] dark:text-white' : 'text-[#555555] hover:text-[#1d1d1f] dark:text-[#86868b] dark:hover:text-white'}`}
            >
              {isHere(lnk.path) && (
                <motion.div layoutId="navGlow" className="absolute inset-0 bg-black/5 border border-black/5 dark:bg-white/5 dark:border-white/10 rounded-2xl z-0 transition-colors duration-500" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <lnk.icon size={18} strokeWidth={1.5} className={`relative z-10 transition-colors duration-500 ${isHere(lnk.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#86868b] dark:text-[#555555] group-hover:text-indigo-600/70 dark:group-hover:text-indigo-400/70'}`} />
              <span className="relative z-10 tracking-wide">{lnk.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          
          {isAuth && (
            <div className="relative" ref={alertRef}>
              <button 
                onClick={toggleAlerts}
                className="relative p-2.5 text-[#555555] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-2xl transition-all duration-500 cursor-pointer group"
              >
                <Bell size={20} strokeWidth={1.5} className={glow ? "text-indigo-600 dark:text-indigo-400 animate-pulse" : "group-hover:scale-110 transition-transform duration-500"} />
                {unread > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] dark:shadow-[0_0_10px_rgba(244,63,94,0.8)] rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {alertsOn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-4 w-80 md:w-96 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden z-50 transition-colors duration-500"
                  >
                    <div className="p-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5 transition-colors duration-500">
                      <h3 className="font-semibold dark:font-normal text-[#1d1d1f] dark:text-white tracking-wide">Notifications</h3>
                      {alerts.length > 0 && (
                        <button onClick={markRead} className="text-xs font-medium dark:font-light tracking-wide text-[#555555] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                          <CheckCheck size={14} strokeWidth={1.5} /> Mark read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {alerts.length === 0 ? (
                        <div className="p-10 text-center text-[#86868b] dark:text-[#555555]">
                          <Bell size={28} strokeWidth={1} className="mx-auto mb-3 opacity-50 dark:opacity-30" />
                          <p className="text-sm font-medium dark:font-light tracking-wide">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-black/5 dark:divide-white/5 transition-colors duration-500">
                          {alerts.map(al => (
                            <div key={al.id} onClick={() => nav('/reviews')} className={`p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-4 items-start ${!al.read ? 'bg-indigo-50 dark:bg-indigo-500/5' : ''}`}>
                              <div className="shrink-0 mt-0.5">
                                {al.type === 'danger' && <ShieldAlert size={20} strokeWidth={1.5} className="text-rose-500 dark:text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)] dark:drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />}
                                {al.type === 'warning' && <AlertTriangle size={20} strokeWidth={1.5} className="text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)] dark:drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" />}
                                {al.type === 'success' && <CheckCircle size={20} strokeWidth={1.5} className="text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold dark:font-normal text-[#1d1d1f] dark:text-white tracking-wide truncate">{al.title}</p>
                                <p className="text-xs text-[#555555] dark:text-[#86868b] font-medium dark:font-light mt-1.5 line-clamp-2 leading-relaxed">{al.message}</p>
                                <p className="text-[10px] text-[#86868b] dark:text-[#555555] mt-3 font-semibold dark:font-light tracking-widest uppercase">{fmtTime(al.time)}</p>
                              </div>
                              {!al.read && <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full shrink-0 mt-1.5"></div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-black/10 dark:border-white/10 transition-colors duration-500">
            {isAuth ? (
              <>
                <Link to="/profile" className="p-2.5 text-[#555555] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-2xl transition-all duration-500">
                  <User size={20} strokeWidth={1.5} />
                </Link>
                <button onClick={doLogOut} className="p-2.5 text-[#555555] dark:text-[#86868b] hover:text-rose-600 dark:hover:text-rose-400 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 rounded-2xl transition-all duration-500 cursor-pointer">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium dark:font-normal text-[#555555] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white px-4 py-2.5 transition-colors duration-500 tracking-wide">Sign In</Link>
                <Link to="/register" className="text-sm font-medium dark:font-normal bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full hover:scale-105 transition-all duration-500 tracking-wide shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">Register</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobMenu(!mobMenu)} className="md:hidden p-2.5 text-[#1d1d1f] dark:text-white bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl transition-colors cursor-pointer">
            {mobMenu ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden pointer-events-auto absolute top-24 left-4 right-4 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden p-4 transition-colors duration-500"
          >
            <nav className="flex flex-col gap-2 mb-4">
              {(isAuth ? authLinks : guestLinks).map((lnk) => (
                <Link key={lnk.name} to={lnk.path} className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium dark:font-normal tracking-wide transition-all ${isHere(lnk.path) ? 'bg-black/5 dark:bg-white/10 text-[#1d1d1f] dark:text-white border border-black/5 dark:border-white/5' : 'text-[#555555] dark:text-[#86868b] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1d1d1f] dark:hover:text-white'}`}>
                  <lnk.icon size={20} strokeWidth={1.5} className={isHere(lnk.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#86868b] dark:text-[#555555]'} />{lnk.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-black/5 dark:border-white/10 pt-4 flex flex-col gap-2 transition-colors duration-500">
              {isAuth ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium dark:font-normal tracking-wide text-[#555555] dark:text-[#86868b] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1d1d1f] dark:hover:text-white transition-all"><User size={20} strokeWidth={1.5} />Profile</Link>
                  <button onClick={doLogOut} className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium dark:font-normal tracking-wide text-rose-600 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"><LogOut size={20} strokeWidth={1.5} />Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium dark:font-normal tracking-wide text-[#555555] dark:text-[#86868b] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1d1d1f] dark:hover:text-white transition-all"><LogIn size={20} strokeWidth={1.5} />Sign In</Link>
                  <Link to="/register" className="flex items-center justify-center gap-2 mt-2 px-5 py-4 rounded-full text-sm font-medium dark:font-normal tracking-wide bg-[#1d1d1f] dark:bg-white text-white dark:text-black shadow-lg transition-all">Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;