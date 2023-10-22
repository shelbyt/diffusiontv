import React from 'react';
import { FaUser, FaRegUser } from 'react-icons/fa'; // Import both filled and regular user icons
import { GiBowlSpiral } from 'react-icons/gi';
import { useRouter } from 'next/router';
import { AiOutlineHome, AiTwotoneHome } from 'react-icons/ai';

const Navbar: React.FC = () => {
    const router = useRouter();

    const navigateToHome = () => {
        router.push('/');
    };

    const navigateToProfile = () => {
        router.push('/profile'); // Assuming profile page is at '/profile'
    };

    const handleLogout = () => {
        router.push('/api/auth/logout');
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-between items-start bg-black px-12 h-28 mt-2">
            <div className="flex flex-col items-center text-white" onClick={navigateToHome}>
                {router.pathname === '/' ? <AiTwotoneHome size={24} /> : <AiOutlineHome size={24} />}
                <p className="text-xs mt-1">Home</p>
            </div>
            <div className="flex flex-col items-center text-white">
                <GiBowlSpiral size={36} onClick={handleLogout} />
            </div>
            <div className="flex flex-col items-center text-white" onClick={navigateToProfile}>
                {router.pathname === '/profile' ? <FaUser size={24} /> : <FaRegUser size={24} />}
                <p className="text-xs mt-1">Profile</p>
            </div>
        </div>
    );
}

export default Navbar;
