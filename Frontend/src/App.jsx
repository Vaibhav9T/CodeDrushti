import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Documentation from './pages/Documentation';
import ForgotPassword from './pages/ForgotPassword';
import NewReview from './pages/NewReview';
import MyReviews from './pages/MyReviews';
import Reports from './pages/Reports';
import { SidebarProvider } from './contexts/SidebarContext';
import { CodeHistoryProvider } from './contexts/codeHistoryContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col w-full pt-[80px] z-10 relative min-h-0 no-scrollbar">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path="/new-review" element={<ProtectedRoute><NewReview /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CodeHistoryProvider>
        <Router>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </Router>
      </CodeHistoryProvider>
    </ThemeProvider>
  );
}