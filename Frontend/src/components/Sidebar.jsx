import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, History, PlusCircle, User, Settings, LogOut, BookOpen, LogIn, LayoutGrid, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  useEffect(() => {
    if (isMobile && !isCollapsed) {
      toggleSidebar(true);
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const authMenuItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { name: 'My Reviews', icon: History, path: '/reviews' },
    { name: 'New Review', icon: PlusCircle, path: '/new-review' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const guestMenuItems = [
    { name: 'Features', icon: LayoutDashboard, path: '/' },
    { name: 'Documentation', icon: BookOpen, path: '/docs' },
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

  const toggleSidebarFunc = () => {
    toggleSidebar(!isCollapsed);
  };
  
  return (
    <>
      {isCollapsed ? (
        <button
          onClick={toggleSidebarFunc}
          className="md:hidden fixed top-4 left-4 z-60 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm"
        >
          <Menu size={24} />
        </button>
      ) : (
        <button
          onClick={toggleSidebarFunc}
          className="md:hidden fixed top-4 left-50 z-60 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm"
        >
          <X size={24} />
        </button>
      )}

      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => toggleSidebar(true)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col justify-between z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none
          ${isCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
          ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}
          ${isCollapsed && !isMobile ? 'p-4' : 'p-6'}
        `}
      >
        <div>
          <div className={`mb-10 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between pl-2'}`}>
            {(!isCollapsed || isMobile) && (
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CodeDrushti</h1>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 tracking-wide uppercase">AI Code Review</p>
              </div>
            )}
            {isCollapsed && !isMobile && (
              <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                CD
              </div>
            )}
          </div>

          <nav className="space-y-1.5">
            {isAuthenticated ? (
              authMenuItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive(item.path) ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'}
                    group relative`}
                >
                  <item.icon size={20} className={isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                  {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                  
                  {isCollapsed && !isMobile && (
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))
            ) : (
              guestMenuItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive(item.path) ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'}
                    group relative`}
                >
                  <item.icon size={20} className={isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                  {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                  
                  {isCollapsed && !isMobile && (
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))
            )}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-slate-800">
          <div className={`flex ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between items-center px-4 mb-4'}`}>
            {(!isCollapsed || isMobile) && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>}
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <button 
              className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors font-medium group relative`} 
              onClick={handleLogout}
            >
              <LogOut size={20} className="group-hover:text-rose-600 dark:group-hover:text-rose-400 text-gray-400 dark:text-gray-500" />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
              
              {isCollapsed && !isMobile && (
                <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                  Logout
                </span>
              )}
            </button>
          ) : (
            <>
              {(!isCollapsed || isMobile) ? (
                <>
                  <Link to="/register" className="block">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-[0_2px_10px_-4px_rgba(79,70,229,0.5)]">
                      Register
                    </button>
                  </Link>
                  <Link to="/login" className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2 font-medium">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/register" className="group relative">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white p-3 rounded-xl transition-all shadow-[0_2px_10px_-4px_rgba(79,70,229,0.5)] flex items-center justify-center">
                      <User size={20} />
                    </button>
                  </Link>
                  <Link to="/login" className="flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 p-3 rounded-xl transition-colors group relative">
                    <LogIn size={20} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        onClick={toggleSidebarFunc}
        className={`hidden md:flex items-center justify-center fixed top-8 z-60 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-8 h-8 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer
          ${isCollapsed ? 'left-[4.2rem]' : 'left-[15.2rem]'}
        `}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );
};

export default Sidebar;