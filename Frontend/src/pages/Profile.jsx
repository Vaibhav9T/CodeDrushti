import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User,Activity, FileCode, Clock, Code } from 'lucide-react';
import { auth } from '../utils/firebase';
import { useCodeHistory } from '../contexts/codeHistoryContext';

const Profile = ()=>{
    
    const navigate = useNavigate();
  const { reviews, loading } = useCodeHistory(); 
  const user = auth.currentUser;

  const totalReviews = reviews.length;
  
  const totalLines = reviews.reduce((acc, curr) => {
    return acc + (curr.linesOfCode || 0);
  }, 0);

  // Mock calculation for average turnaround
  const avgTurnaround = "1.5s";

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

    return (
        <div className="px-12 py-20 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className='text-3xl font-extrabold text-white mb-2'>My Profile</h1>
            </div>
         
            <div className="relative w-full gap-6">

                {user ? (
              <div>
                <div className=" md:flex items-center space-x-4 mb-4 border border-gray-600 p-4 rounded-lg  bg-[#171f2c]">
                  {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div className="w-24  h-24 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="text-white" />
                    </div>
                    )}
                    <div className="mt-5 md:mt-0">
                        <h2 className="text-xl font-bold text-white">{user.displayName || 'No Name'}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                    <div className='w-30 mt-5 md:mt-0 rounded-lg p-2 text-center cursor-pointer bg-linear-to-r from-cyan-500 to-blue-600  hover:shadow-cyan-500/25  ml-auto'>
                    <button
                        className=" text-white font-bold "
                        >
                            Edit Profile
                        </button>
                        </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <div className='space-x-4 mb-4 border space-y-2 border-gray-600 p-4 rounded-lg  bg-[#171f2c] '>
                        <h2 className='text-md font-medium text-[#d0d0d3] '>
                            Total Code Reviews
                        </h2>
                        <h1 className='text-4xl font-bold text-cyan-400'>
                           {loading ? "..." : totalReviews}
                        </h1>
                    </div>
                    <div className='space-x-4 mb-4 border space-y-2 border-gray-600 p-4 rounded-lg  bg-[#171f2c] '>
                        <h2 className='text-md font-medium text-[#d0d0d3] '>
                            Lines Reviewed
                        </h2>
                        <h1 className='text-4xl font-bold text-cyan-400'>
                            {loading ? "..." : totalLines.toLocaleString()}
                        </h1>
                    </div>
                    <div className='space-x-4 mb-4 border space-y-2 border-gray-600 p-4 rounded-lg  bg-[#171f2c] '>
                        <h2 className='text-md font-medium text-[#d0d0d3] '>
                            Average Turnaround
                        </h2>
                        <h1 className='text-4xl font-bold text-cyan-400'>
                           {loading ? "..." : avgTurnaround}
                        </h1>
                    </div>
                    <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileCode className="text-cyan-500" />
                    Recent Code Reviews
                    </h2>

                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden">
                    {reviews.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No reviews found yet. Go to Dashboard to analyze some code!
                    </div>
                    ) : (
                    <div className="divide-y divide-gray-800">
                        {reviews.map((review) => (
                        <div key={review.id} className="p-4 hover:bg-[#1c2128] transition-colors flex justify-between items-center group">
                            <div className="flex gap-4 items-start">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <Code size={20} className="text-gray-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">
                                {/* Limit title length to 30 chars */}
                                {review.code ? review.code.substring(0, 30).split('\n')[0] : "Code Snippet"}...
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                {review.linesOfCode || 0} lines • {formatDate(review.timestamp)}
                                </p>
                            </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
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
                {/* <div className="text-gray-300">
                    <p><span className="font-semibold">User ID:</span> {user.uid}</p>
                </div> */}
                
            </div>
              
            ) : (
                <p>No user information available.</p>
            )}
            
        </div>
        {/* <div className="mt-6">
             <button className="text-red-400 bottom-0.5" onClick={handleLogout}>Logout</button>
        </div> */}
        </div>
    );
}



export default Profile;