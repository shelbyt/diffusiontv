import React from 'react';
import { FaHome, FaUser } from 'react-icons/fa';
import {GiBowlSpiral} from 'react-icons/gi'
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
     const router = useRouter();

    const handleLogout = () => {
        router.push('/api/auth/logout');
    }
    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-between items-start bg-black px-12 h-28 mt-2">
            <div className="flex flex-col items-center text-white">
                <FaHome size={24} />
                <p className="text-xs mt-1">Home</p>
            </div>
            <div className="flex flex-col items-center text-white">
                <GiBowlSpiral size={36} onClick={handleLogout} />
            </div>
            <div className="flex flex-col items-center text-white">
                <FaUser size={24} />
                <p className="text-xs mt-1">Profile</p>
            </div>
        </div>
    );
}

export default Navbar;
