import { useState } from "react";
import {User, Eye, EyeOff, Lock, Form, CheckIcon} from 'lucide-react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const Register=()=>{
    const [formData, setFormData] = useState({
        username: '',
        email:'',
        password: ''
      });

      const [showPassword, setShowPassword] = useState(false);
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const [agreedToTerms, setAgreedToTerms] = useState(false);
      const navigate = useNavigate();
      const { login } = useAuth();

      const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate terms agreement
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });
      
      // Call login with Firebase user data
      login(userCredential.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Sign in with Google using Firebase Authentication
      const result = await signInWithPopup(auth, googleProvider);
      
      // Call login with Firebase user data
      login(result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in popup was closed. Please try again.');
          break;
        case 'auth/cancelled-popup-request':
          setError('Sign-in was cancelled.');
          break;
        case 'auth/popup-blocked':
          setError('Sign-in popup was blocked by the browser.');
          break;
        default:
          setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

   return(

    <div className="min-h-screen bg-[#0f1214] flex items-center justify-center p-4">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"/>
            {/*Register card*/}
            <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
                {/*Header*/}
                <div className="text-center mb-8">
                    <h1 className="text-white font-bold text-3xl mb-2">CodeDrushti</h1>
                    <p className="text-sm text-gray-600">Register to supercharge your code reviews</p>
                </div>

                {/* Register form*/ }
                {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                          
                          {/* Error Message */}
                          {error && (
                            <div 
                              role="alert" 
                              aria-live="polite"
                              className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl px-4 py-3 text-sm"
                            >
                              {error}
                            </div>
                          )}
                          
                          {/* Username/Email Field */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                            Username
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full bg-[#0d1117] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                                required
                              />
                              <User className="absolute right-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
                            </div>
                            </div>

                            <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                            Email
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-[#0d1117] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                                required
                              />
                              <User className="absolute right-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
                            </div>
                          </div>
                          
                          {/* Password Field */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                              Password
                            </label>
                            <div className="relative group">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full bg-[#0d1117] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-cyan-500 transition-colors cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 8 characters with uppercase, lowercase, and a number
                            </p>
                          </div>
                
                          {/* Forgot Password Link */}
                          <div className="flex justify-center items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="terms" 
                              checked={agreedToTerms}
                              onChange={(e) => setAgreedToTerms(e.target.checked)}
                              className="w-4 h-4 bg-[#0d1117] border border-gray-700 rounded-sm focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                            />
                           <p className="text-sm text-gray-500">I agree to the terms and conditions</p>
                          </div>
                
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                           {loading ? 'Creating account...' : 'Register'}
                          </button>
                        </form>
                

                {/* Footer / Sign Up */}
                        <div className="mt-6 text-center text-sm text-gray-400">
                          Have an account?{' '}
                          <Link to="/Login" className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors">
                            Login
                          </Link>
                        </div>

                         {/* Divider */}
                                <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#161b22] text-gray-500">OR</span>
                                </div>
                                </div>

                                {/* Social Login Buttons */}
                    <div className="flex justify-center gap-4">
                    {/* Google Button */}
                    <button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="p-3 bg-[#0d1117] border border-gray-700 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        </svg>
                    </button>

                    {/* GitHub Button */}
                    <button className="p-3 bg-[#0d1117] border border-gray-700 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all group">
                        <svg className="w-6 h-6 fill-white group-hover:fill-cyan-500 transition-colors" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </button>
                    </div>
            </div>
        </div>

   )
}

export default Register;