import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function AppContent() {
  return (
    <div className="flex min-h-screen bg-[#0d1317]">
      <Sidebar className="flex-0"/>
    
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 ">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register/>}/>
          <Route path="/docs" element={<div className="text-white p-10">Docs Coming Soon</div>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/reviews" element={
            <ProtectedRoute>
              <div className="text-white p-10">My Reviews</div>
            </ProtectedRoute>
          } />
          <Route path="/new-review" element={
            <ProtectedRoute>
              <div className="text-white p-10">New Review</div>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="text-white p-10">Profile</div>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <div className="text-white p-10">Settings</div>
            </ProtectedRoute>
          } />
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