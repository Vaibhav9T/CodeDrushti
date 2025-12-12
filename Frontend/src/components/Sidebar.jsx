import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, History, PlusCircle, User, Settings, LogOut, BookOpen, LogIn, LayoutGrid, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Auto-collapse on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  // Load saved collapse state for desktop
  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    }
  }, [isMobile]);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };
  
  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
     { isCollapsed ? (<button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] bg-[#0d1317] border border-gray-800 p-2 rounded-lg text-cyan-400 hover:bg-gray-800 transition-all duration-300 ease-in-out"
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>):(
        <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-50 z-[60] bg-[#0d1317] border border-gray-800 p-2 rounded-lg text-cyan-400 hover:bg-gray-800 transition-all duration-300 ease-in-out"
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>
      )
    }

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
        
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-[#0d1317] border-r border-gray-800 flex flex-col justify-between z-50 transition-all duration-300 ease-in-out
          ${isCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
          ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}
          ${isCollapsed && !isMobile ? 'p-4' : 'p-6'}
        `}
      >
        <div>
          {/* Header */}
          <div className={`mb-10 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between pl-2'}`}>
            {(!isCollapsed || isMobile) && (
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">CodeDrushti</h1>
                <p className="text-xs text-cyan-400 mt-1">AI Code Review</p>
              </div>
            )}
            {isCollapsed && !isMobile && (
              <div className="text-2xl font-bold text-cyan-400">CD</div>
            )}
          </div>

          <nav className="space-y-2">
            {isAuthenticated ? (
              authMenuItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive(item.path) ? 'bg-[#112a31] text-cyan-400 border border-cyan-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                    group relative`}
                  title={isCollapsed && !isMobile ? item.name : ''}
                >
                  <item.icon size={20} />
                  {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
                  className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors group relative`}
                  title={isCollapsed && !isMobile ? item.name : ''}
                >
                  <item.icon size={20} />
                  {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))
            )}
          </nav>
        </div>

        <div className="space-y-4">
          {isAuthenticated ? (
            <button 
              className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors group relative`} 
              onClick={handleLogout}
              title={isCollapsed && !isMobile ? 'Logout' : ''}
            >
              <LogOut size={20} />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Logout
                </span>
              )}
            </button>
          ) : (
            <>
              {(!isCollapsed || isMobile) ? (
                <>
                  <Link to="/register">
                    <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer">
                      Register
                    </button>
                  </Link>
                  <Link to="/login" className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors py-2">
                    <LogIn size={18} />
                    <span className="font-medium">Login</span>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/register" className="group relative">
                    <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold p-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer flex items-center justify-center">
                      <User size={20} />
                    </button>
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Register
                    </span>
                  </Link>
                  <Link to="/login" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors py-2 group relative">
                    <LogIn size={20} />
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Login
                    </span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop Toggle Button - Attached to sidebar */}
      <button
        onClick={toggleSidebar}
        className={`hidden md:block fixed top-6 z-[60] bg-[#0d1317] border border-gray-800 p-2 rounded-r-lg text-cyan-400 hover:bg-gray-800 transition-all duration-300
          ${isCollapsed ? 'left-20' : 'left-64'}
        `}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </>
  );
};

export default Sidebar;