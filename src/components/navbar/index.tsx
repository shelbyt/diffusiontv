import React from 'react';
import { useRouter } from 'next/router';
import { House, User, PaintBrushHousehold } from "@phosphor-icons/react";
import { useUser } from '@auth0/nextjs-auth0/client';
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';


const Navbar: React.FC = () => {
    const router = useRouter();
    const { user, isLoading, error } = useUser();
    const { userState, fetchUserData } = useUserUUID();
    const { handleLogin } = usePopup();

    const navigateToHome = () => {
        router.push('/');
    };

    const navigateToProfile = () => {
        if (!userState?.isAuthenticated) {
            console.log("User needs to login")
            handleLogin(); // Use handleLogin from PopupContext
        }
        if(userState?.isAuthenticated) {
            router.push('/profile');
        }
    };

    const handleLogout = () => {
        router.push('/api/auth/logout');
    }

    return (
        <div className="h-16 flex justify-between items-start bg-black px-16" style={{ borderTop: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col items-center text-white" onClick={navigateToHome}>
                {router.pathname === '/' ? <House size={32} weight='fill' color="#fff" /> : <House size={32} color="#fff" />}
                <p className="text-xs mt-1">Home</p>
            </div>
            <div className="flex flex-col items-center text-white">
                <PaintBrushHousehold size={32} color="#fff" weight="fill" onClick={handleLogout} />
            </div>
            <div className="flex flex-col items-center text-white" onClick={navigateToProfile}>
                {router.pathname === '/profile' ? <User size={32} weight='fill' color="#fff" /> : <User size={32} color="#fff" />}
                <p className="text-xs mt-1">Profile</p>
            </div>
        </div>
    );
}

export default Navbar;