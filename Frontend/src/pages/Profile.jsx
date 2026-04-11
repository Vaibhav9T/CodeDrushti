import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, FileCode, Code, Activity, Clock } from 'lucide-react';
import { auth } from '../utils/firebase';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Profile = () => {
  const navigate = useNavigate();
  const { reviews, loading } = useCodeHistory(); 
  const user = auth.currentUser;

  const totalReviews = reviews.length;
  const totalLines = reviews.reduce((acc, curr) => acc + (curr.linesOfCode || 0), 0);
  const avgTurnaround = "1.5s";

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="px-6 py-12 md:px-12 md:py-16 max-w-7xl mx-auto min-h-screen transition-colors duration-300">
      <div className="mb-8">
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300'>My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Manage your account and view your code analysis history.</p>
      </div>
      
      <div className="w-full gap-6">
        {user ? (
          <div>
            <div className="md:flex items-center space-x-0 md:space-x-6 mb-8 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-indigo-50 dark:border-slate-800" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-800 shadow-sm">
                  <User size={36} />
                </div>
              )}
              <div className="mt-5 md:mt-0 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName || 'Developer'}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{user.email}</p>
                <div className="mt-3 inline-flex px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  Pro Plan
                </div>
              </div>
              <div className='mt-5 md:mt-0'>
                <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 cursor-pointer">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
              <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between transition-colors duration-300'>
                <div>
                  <h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Total Code Reviews</h2>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{loading ? "..." : totalReviews}</h1>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><Activity size={24} /></div>
              </div>

              <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between transition-colors duration-300'>
                <div>
                  <h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Lines Reviewed</h2>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{loading ? "..." : totalLines.toLocaleString()}</h1>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><FileCode size={24} /></div>
              </div>

              <div className='border border-gray-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-start justify-between transition-colors duration-300'>
                <div>
                  <h2 className='text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1'>Avg Turnaround</h2>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{loading ? "..." : avgTurnaround}</h1>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><Clock size={24} /></div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                <Code className="text-indigo-600 dark:text-indigo-400" size={24} />
                Recent Code Reviews
              </h2>

              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300">
                {reviews.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <FileCode size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">No reviews yet</p>
                    <p className="text-sm">Go to your Dashboard to analyze some code!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-slate-800">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group cursor-pointer">
                        <div className="flex gap-4 items-center">
                          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                            <Code size={20} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {review.code ? review.code.substring(0, 35).split('\n')[0] : "Code Snippet"}...
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {review.linesOfCode || 0} lines • {formatDate(review.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:ml-auto">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 text-center shadow-sm transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No user information available. Please sign in.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;