import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, FileCode, Code, Activity, Clock, X, Loader2, CheckCircle, Edit2 } from 'lucide-react';
import { auth, db } from '../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Profile = () => {
  const { reviews, loading } = useCodeHistory(); 
  const user = auth.currentUser;

  // Local state to instantly update the UI without reloading the page
  const [currentName, setCurrentName] = useState(user?.displayName || 'Developer');
  
  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isEditModalOpen) setEditName(currentName);
  }, [isEditModalOpen, currentName]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName === currentName) return;
    
    setIsUpdating(true);
    setUpdateStatus(null);
    
    try {
      // 1. Update Firebase Auth (Google Profile)
      await updateProfile(auth.currentUser, {
        displayName: trimmedName
      });
      
      // 2. Update Firestore Database (Your custom users collection)
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        username: trimmedName
      });
      
      // 3. Update local UI state
      setCurrentName(trimmedName);
      setUpdateStatus({ type: 'success', msg: 'Profile updated successfully!' });
      
      // 4. Close modal after 1.5 seconds
      setTimeout(() => {
        setIsEditModalOpen(false);
        setUpdateStatus(null);
      }, 1500);
      
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateStatus({ type: 'error', msg: 'Failed to update profile. Try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const totalReviews = reviews.length;
  const totalLines = reviews.reduce((acc, curr) => acc + (curr.linesOfCode || 0), 0);
  const formatDate = (ts) => !ts ? 'Just now' : new Date(ts.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] font-sans w-full transition-colors duration-300 relative">
      
      {/* FIXED HEADER */}
      <div className="shrink-0 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10">
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account and view your code analysis history.</p>
      </div>
      
      {/* SCROLLING CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto pb-12 gap-6">
          {user ? (
            <div>
              
              {/* PROFILE CARD */}
              <div className="md:flex items-center space-x-0 md:space-x-6 mb-8 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-indigo-50 dark:border-slate-800 object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-800 shadow-sm">
                    <User size={36} />
                  </div>
                )}
                <div className="mt-5 md:mt-0 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentName}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{user.email}</p>
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">Pro Plan</div>
                </div>
                <div className='mt-5 md:mt-0'>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                </div>
              </div>

              {/* STATS ROW */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
                <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between'>
                  <div><h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Total Code Reviews</h2><h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{loading ? "..." : totalReviews}</h1></div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><Activity size={24} /></div>
                </div>
                <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between'>
                  <div><h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Lines Reviewed</h2><h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{loading ? "..." : totalLines.toLocaleString()}</h1></div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><FileCode size={24} /></div>
                </div>
                <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between'>
                  <div><h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Avg Turnaround</h2><h1 className='text-3xl font-bold text-gray-900 dark:text-white'>1.5s</h1></div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><Clock size={24} /></div>
                </div>
              </div>

              {/* RECENT REVIEWS */}
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Code className="text-indigo-600 dark:text-indigo-400" size={24} /> Recent Code Reviews
                </h2>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  {reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center"><FileCode size={32} className="text-gray-400 mb-4" /><p className="font-medium text-gray-900 dark:text-white mb-1">No reviews yet</p></div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="flex gap-4 items-center">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"><Code size={20} className="text-indigo-600 dark:text-indigo-400" /></div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{review.code ? review.code.substring(0, 35).split('\n')[0] : "Code Snippet"}...</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{review.linesOfCode || 0} lines • {formatDate(review.timestamp)}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">Completed</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 text-center"><p className="text-gray-500 dark:text-gray-400 font-medium">No user information available.</p></div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL (OVERLAY) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              
              {/* Status Message */}
              {updateStatus && (
                <div className={`p-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 ${
                  updateStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
                }`}>
                  {updateStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                  {updateStatus.msg}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 opacity-70">
                    Email Address <span className="text-xs font-normal ml-1">(Cannot be changed here)</span>
                  </label>
                  <input 
                    type="text" 
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-3 justify-end border-t border-gray-100 dark:border-slate-800 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating || !editName.trim() || editName.trim() === currentName}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  {isUpdating ? <Loader2 size={18} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;