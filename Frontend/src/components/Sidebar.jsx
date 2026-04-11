import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, History, PlusCircle, User, LogOut, BookOpen, LogIn, Menu, X, Code2, Bell,
  ShieldAlert, AlertTriangle, CheckCircle, CheckCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { reviews } = useCodeHistory();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [flashState, setFlashState] = useState(null); 
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  
  const prevReviewId = useRef(null);
  const isInitialMount = useRef(true);

  // Close mobile menu and notifications on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time Notification Logic
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const latestReview = reviews[0];

    if (isInitialMount.current) {
      prevReviewId.current = latestReview.id;
      isInitialMount.current = false;
      return;
    }

    if (latestReview.id !== prevReviewId.current) {
      prevReviewId.current = latestReview.id;

      const content = latestReview.reviewContent || {};
      const secCount = content.security?.length || 0;
      const bugCount = content.bugs?.length || 0;
      const impCount = content.improvements?.length || 0;
      
      const hasCritical = content.bugs?.some(b => ['critical', 'high'].includes(b.severity?.toLowerCase()));
      const hasMajor = content.bugs?.some(b => ['major'].includes(b.severity?.toLowerCase()));

      let state = 'success';
      let title = 'Review Clean';
      let message = `Great job! Code is optimized.`;

      if (secCount > 0 || hasCritical) {
        state = 'danger';
        title = 'Critical Issues Detected';
        message = `Found ${secCount} security flaws and ${bugCount} bugs.`;
      } else if (hasMajor || bugCount > 0) {
        state = 'warning';
        title = 'Bugs Detected';
        message = `Found ${bugCount} bugs and ${impCount} suggestions.`;
      } else if (impCount > 0) {
        state = 'success';
        title = 'Review Complete';
        message = `Found ${impCount} areas for improvement.`;
      }

      const newNotif = {
        id: Date.now(),
        title,
        message,
        type: state,
        time: new Date(),
        read: false,
        reviewId: latestReview.id
      };

      setNotifications(prev => [newNotif, ...prev]);
      setFlashState(state);

      // Turn off flash automatically after 5 seconds if not clicked
      const timer = setTimeout(() => setFlashState(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [reviews]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
    // FIX: Force the glowing bar to turn off instantly when clicking the bell
    if (!isNotifOpen) {
      setFlashState(null); 
      if (unreadCount > 0) {
        markAllAsRead();
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const authMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analyze', icon: PlusCircle, path: '/new-review' },
    { name: 'Reviews', icon: History, path: '/reviews' },
  ];

  const guestMenuItems = [
    { name: 'Features', icon: LayoutDashboard, path: '/' },
    { name: 'Docs', icon: BookOpen, path: '/docs' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      logout(); 
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  // FIX: Added 'animate-pulse' to active states so the bar actually flashes
  const getFlashStyles = () => {
    switch(flashState) {
      case 'danger': return 'animate-pulse border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.4)] dark:shadow-[0_0_25px_rgba(225,29,72,0.3)] bg-rose-50/90 dark:bg-rose-900/40';
      case 'warning': return 'animate-pulse border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)] dark:shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-amber-50/90 dark:bg-amber-900/40';
      case 'success': return 'animate-pulse border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] dark:shadow-[0_0_25px_rgba(16,185,129,0.3)] bg-emerald-50/90 dark:bg-emerald-900/40';
      default: return 'border-gray-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white/80 dark:bg-slate-900/80';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed top-4 left-4 right-4 md:left-8 md:right-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl z-50 transition-all duration-300">
      
      <div className={`backdrop-blur-xl border rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300 ease-in-out ${getFlashStyles()}`}>
        
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors duration-300">
            <Code2 size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none tracking-tight">CodeDrushti</h1>
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">AI Review</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          {(isAuthenticated ? authMenuItems : guestMenuItems).map((item) => (
            <Link 
              key={item.name} to={item.path} 
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive(item.path) ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
            >
              <item.icon size={18} className={isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button 
                onClick={toggleNotifications}
                className="relative p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
              >
                <Bell size={20} className={flashState ? "animate-bounce text-indigo-600 dark:text-indigo-400" : ""} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                        {notifications.map(notif => (
                          <div key={notif.id} onClick={() => navigate('/reviews')} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-4 items-start ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}>
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'danger' && <ShieldAlert size={20} className="text-rose-500" />}
                              {notif.type === 'warning' && <AlertTriangle size={20} className="text-amber-500" />}
                              {notif.type === 'success' && <CheckCircle size={20} className="text-emerald-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{notif.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatTime(notif.time)}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5"></div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2 border-l border-gray-200 dark:border-slate-800 pl-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors">Sign In</Link>
                <Link to="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-sm transition-all">Register</Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <nav className="flex flex-col gap-1 mb-2">
            {(isAuthenticated ? authMenuItems : guestMenuItems).map((item) => (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(item.path) ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                <item.icon size={18} className={isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />{item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 dark:border-slate-800 pt-2 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"><User size={18} />Profile</Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"><LogOut size={18} />Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"><LogIn size={18} />Sign In</Link>
                <Link to="/register" className="flex items-center justify-center gap-2 mt-1 px-4 py-3 rounded-xl text-sm font-semibold bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm transition-all">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;