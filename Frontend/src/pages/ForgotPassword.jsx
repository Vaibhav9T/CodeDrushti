import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../utils/firebase'; // Import from your firebase file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ loading: false, error: '', success: true });
    } catch (err) {
      // Firebase throws an error if the email doesn't exist or is invalid
      const errorMessage = err.code === 'auth/user-not-found' 
        ? "No account found with this email." 
        : err.message.replace("Firebase:", "").trim();
      
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1214] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/login" className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">Enter your email and we'll send you instructions to reset your password.</p>
        </div>

        {/* Success State */}
        {status.success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Check your email</h3>
            <p className="text-gray-400 text-sm mb-6">We have sent a password reset link to <span className="text-cyan-500">{email}</span></p>
            <button 
              onClick={() => setStatus({ ...status, success: false })}
              className="text-sm text-gray-500 hover:text-white underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {status.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                {status.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-[#0d1117] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                  required
                />
                <Mail className="absolute right-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-cyan-600 text-white font-bold py-3.5 rounded-xl hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status.loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;