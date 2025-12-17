
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { User } from 'lucide-react';
import { useState } from 'react';

const Profile = ()=>{
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    return (
        <div className="px-12 py-20 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className='text-3xl font-extrabold text-white mb-2'>My Profile</h1>
         </div>
         
            <div className="grid grid-col-1  gap-6">
            {user ? (
              <div>
                <div className="flex items-center space-x-4 mb-4 border border-gray-600 p-4 rounded-lg width-full bg-[#171f2c]">
                  {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="text-white" />
                    </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.displayName || 'No Name'}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                    <div className='rounded-lg p-2 cursor-pointer bg-linear-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/25 active:scale-95 ml-auto'>
                    <button
                        className="ml-auto text-white text-md font-bold"
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
                            1234
                        </h1>
                    </div>
                    <div className='space-x-4 mb-4 border space-y-2 border-gray-600 p-4 rounded-lg  bg-[#171f2c] '>
                        <h2 className='text-md font-medium text-[#d0d0d3] '>
                            Lines Reviewed
                        </h2>
                        <h1 className='text-4xl font-bold text-cyan-400'>
                            45,890
                        </h1>
                    </div>
                    <div className='space-x-4 mb-4 border space-y-2 border-gray-600 p-4 rounded-lg  bg-[#171f2c] '>
                        <h2 className='text-md font-medium text-[#d0d0d3] '>
                            Average Turnaround
                        </h2>
                        <h1 className='text-4xl font-bold text-cyan-400'>
                            2.5 hrs
                        </h1>
                    </div>
                </div>
                <div className="text-gray-300">
                    <p><span className="font-semibold">User ID:</span> {user.uid}</p>
                </div>

            </div>
              
            ) : (
                <p>No user information available.</p>
            )}
        </div>
        <div className="mt-6">
             <button className="text-red-400 bottom-0.5" onClick={handleLogout}>Logout</button>
        </div>
        </div>
    );
}



export default Profile;