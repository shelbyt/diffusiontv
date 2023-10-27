// pages/profile.jsa
import ApiVideoClient from '@api.video/nodejs-client'
import React, { useState, useEffect } from 'react';
import { ShareFat } from '@phosphor-icons/react'
import { useRouter } from 'next/router';
import prisma from '../../utils/prismaClient'
import getUserProfile from '../api/user/getUserProfile';
import { PlayCircle } from '@phosphor-icons/react';

type UserImage = {
    videoId: string;
};

type UserProfile = {
    imageUrl: string;
    images: UserImage[];
};

type UserProfileData = {
    userProfile: UserProfile;
    userVideo: UserVideo[];
};

type UserVideo = {
    thumbnail: string;
    videoId: string;
};


const User = () => {
    const router = useRouter();
    const { user } = router.query;  // 'user' matches the name of your dynamic route file [user].tsx
    const [userProfileData, setUserProfile] = useState<UserProfileData | null>(null);

    useEffect(() => {
        console.log('ok --', user)

        if (user) {
            const fetchUserProfile = async () => {
                const response = await fetch(`/api/user/getUserProfile?user=${user}`);
                const data = await response.json();
                console.log("xxx data", data)
                setUserProfile(data);
            };

            fetchUserProfile();
        }

    }, [user]);

    //await client.videos.list({ title })



    // Now you can use this 'user' variable to make database calls or whatever you need
    // if (user) {
    //     console.log(`User from URL: ${user}`);
    //     getUserProfileData(user);
    //     // Make your database calls or other logic here
    // }


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
                        <img src={userProfileData?.userProfile?.imageUrl} alt="Profile" />
                    </div>
                </div>
                <h2 className="mt-2 text-xl text-white font-bold">{`@${user}`}</h2>
                <button className="btn btn-secondary mt-4 text-xl">Follow</button>
            </div>
            {/* Centered Text */}
            <div className="text-center mt-8 text-white text-xl">
                Creations
            </div>

            {/* Underline */}
            <div className="mx-auto w-1/4 h-1 mt-2 bg-white"></div>

            {/* Grid Container for Items */}
            <div className="grid grid-cols-3 gap-1 mt-8">
                {userProfileData?.userVideo?.map((video, index) => (
                    <div key={index} className="relative p-1">
                        <img src={video.thumbnail} alt={`Thumbnail for ${video.videoId}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            {/* Your play icon component here */}
                            <PlayCircle size={32} color="#adadad" weight="fill" />
                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
}

export default User;
