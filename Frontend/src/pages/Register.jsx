import { useState } from "react";
import { User, Eye, EyeOff, Lock, Loader2, Mail } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  googleProvider, 
  signInWithPopup, 
  updateProfile, 
  githubProvider, 
  signOut 
} from '../utils/firebase';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!termsAccepted) return setError("You must accept the Terms and Conditions.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters long.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.username });
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email.toLowerCase().trim(),
        uid: user.uid,
        createdAt: new Date().toISOString()
      });
      await signOut(auth);
      setTimeout(() => { navigate('/login'); }, 1000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError("This email is already registered.");
      else if (err.code === 'auth/invalid-email') setError("The email address is not valid.");
      else setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try { await signInWithPopup(auth, googleProvider); navigate('/dashboard'); } 
    catch (err) { setError("Google Sign-In failed. Please try again."); }
  };

  const handleGithubSignIn = async () => {
    try { await signInWithPopup(auth, githubProvider); navigate('/dashboard'); } 
    catch (err) { setError("GitHub Sign-In failed."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative z-10 transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join CodeDrushti and streamline your code reviews</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm p-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Username</label>
            <div className="relative group">
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" />
              <User className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Email</label>
            <div className="relative group">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" />
              <Mail className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Password</label>
            <div className="relative group">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" />
              <Lock className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Confirm Password</label>
            <div className="relative group">
              <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" />
              <Lock className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 pb-2">
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
            <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer leading-tight">
              I agree to the <span className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Terms of Service</span> and <span className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Privacy Policy</span>.
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Account"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm font-medium">
            <span className="px-3 bg-white dark:bg-slate-900 text-gray-400 dark:text-gray-500">or register with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleGoogleSignIn} className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
          </button>
          <button onClick={handleGithubSignIn} className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer">
            <svg className="w-5 h-5 mr-2 fill-gray-900 dark:fill-white" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;