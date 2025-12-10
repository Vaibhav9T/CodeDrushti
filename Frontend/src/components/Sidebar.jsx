import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, History, PlusCircle, User, Settings, LogOut, BookOpen, LogIn, LayoutGrid 
} from 'lucide-react';

import {useNavigate} from 'react-router-dom';

const Sidebar = ({ isAuthenticated }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();

  const handleLogout = () => {

    navigate('/login');
  }

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

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#0d1317] border-r border-gray-800 flex flex-col justify-between p-6 z-50">
      <div>
        <div className="mb-10 pl-2">
          <h1 className="text-xl font-bold text-white tracking-wide">CodeDrushti</h1>
          <p className="text-xs text-cyan-400 mt-1">AI Code Review</p>
        </div>

        <nav className="space-y-2">
          {isAuthenticated ? (
            authMenuItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${isActive(item.path) ? 'bg-[#112a31] text-cyan-400 border border-cyan-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))
          ) : (
            guestMenuItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors"
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))
          )}
        </nav>
      </div>

      <div className="space-y-4">
        {isAuthenticated ? (
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors " onClick={handleLogout} >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <Link to="/register">
              <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer">
                Sign Up
              </button>
            </Link>
            <Link to="/login" className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors py-2">
              <LogIn size={18} />
              <span className="font-medium">Login</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;