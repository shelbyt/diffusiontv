import React from 'react';
import { useRouter } from 'next/router';
import { House, User, PaintBrushHousehold } from "@phosphor-icons/react";


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
            <div className="h-16 flex justify-between items-start bg-black px-16">
            <div className="flex flex-col items-center text-white" onClick={navigateToHome}>
                {router.pathname === '/' ? <House size={32} weight='fill' color="#fff" /> : <House size={32} color="#fff" />}
                <p className="text-xs mt-1">Home</p>
            </div>
            <div className="flex flex-col items-center text-white">
                <PaintBrushHousehold size={32} color="#fff" weight="fill" onClick={handleLogout}/>
            </div>
            <div className="flex flex-col items-center text-white" onClick={navigateToProfile}>
                {router.pathname === '/profile' ? <User size={32} weight='fill' color="#fff" /> : <User size={32} color="#fff" />}
                <p className="text-xs mt-1">Profile</p>
            </div>
        </div>
    );
}

export default Navbar;
