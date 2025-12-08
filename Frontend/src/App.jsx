import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

// Helper component to handle sidebar state based on URL
function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Automatically switch to "User Mode" if on the dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setIsAuthenticated(true);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#0d1317]">
      <Sidebar isAuthenticated={isAuthenticated} />

      <main className="flex-1 ml-64 relative">
        {/* Toggle Button (For Demo Only - You can remove this later) */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => setIsAuthenticated(!isAuthenticated)}
            className="bg-gray-800 text-xs text-white px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 cursor-pointer"
          >
            {isAuthenticated ? "Log Out" : "Log In"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<div className="text-white p-10">Docs Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}