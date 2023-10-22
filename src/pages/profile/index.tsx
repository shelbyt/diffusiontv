// pages/profile.js
import React, { useState } from 'react';
import { ShareFat } from '@phosphor-icons/react'

const Profile = () => {
	const [activeTab, setActiveTab] = useState(0);  // Using index for DaisyUI tabs

	return (
		<div className="bg-gray-100 min-h-screen text-black"> {/* Apply text-black here for global effect */}
			{/* Top Bar */}
			<div className="p-4 bg-white flex justify-between items-center">
				<div></div>  {/* This is a placeholder for potential future items like a back button */}
				<button className="btn">
					<ShareFat size={24} color='#000' weight="fill" />
				</button>
			</div>

			{/* Profile Picture and Username */}
			<div className="flex flex-col items-center mt-8">
				<div className="avatar">
					<div className="w-24 rounded-full ring ring-default ring-offset-base-100 ring-offset-2">
						<img src="/icon-192x192.png" alt="Profile" />
					</div>
				</div>
				<h2 className="mt-2 text-xl font-bold">@sapphie</h2>
				<button className="btn btn-secondary mt-4 text-xl">Follow</button>
			</div>

			{/* Tabs */}
			<div className="tabs mt-8">
				<a
					className={`tab tab-bordered w-1/2 text-xl ${activeTab === 0 ? 'tab-active' : ''}`}
					onClick={() => setActiveTab(0)}
				>
					Achievements
				</a>
				<a
					className={`tab tab-bordered w-1/2 text-xl ${activeTab === 1 ? 'tab-active' : ''}`}
					onClick={() => setActiveTab(1)}
				>
					Creations
				</a>
				<div className={activeTab === 0 ? 'tab-content' : 'hidden'}>Achievements Content Here</div>
				<div className={activeTab === 1 ? 'tab-content' : 'hidden'}>Creations Content Here</div>
			</div>
		</div>
	);
}

export default Profile;
