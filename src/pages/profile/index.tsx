// pages/profile.js
import React from 'react';
import { ShareFat } from '@phosphor-icons/react'

const Profile = () => {
    return (
        <div className="bg-black-100 min-h-screen text-black"> {/* Apply text-black here for global effect */}
            {/* Top Bar */}
            <div className="p-4 bg-zinc-900 flex justify-between items-center">
                <div></div>  {/* This is a placeholder for potential future items like a back button */}
                <button className="btn">
                    <ShareFat size={24} color='#000' weight="fill" />
                </button>
            </div>

            {/* Profile Picture and Username */}
            <div className="flex flex-col items-center mt-8">
                <div className="avatar">
                    <div className="w-28 mask mask-hexagon">
                        <img src="/icon-192x192.png" alt="Profile" />
                    </div>
                </div>
                <h2 className="mt-2 text-xl text-white font-bold">@sapphie</h2>
                <button className="btn btn-secondary mt-4 text-xl">Follow</button>
            </div>
            {/* Centered Text */}
            <div className="text-center mt-8 text-white text-xl">
                Creations
            </div>

            {/* Underline */}
            <div className="mx-auto w-1/4 h-1 mt-2 bg-white"></div>

            {/* Grid Container for Items */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                {/* Replace these divs with your grid items */}
                <div className="bg-gray-300 p-4">Item 1</div>
                <div className="bg-gray-300 p-4">Item 2</div>
                <div className="bg-gray-300 p-4">Item 3</div>
                <div className="bg-gray-300 p-4">Item 4</div>
                <div className="bg-gray-300 p-4">Item 5</div>
                <div className="bg-gray-300 p-4">Item 6</div>
            </div>



        </div>
    );
}

export default Profile;
