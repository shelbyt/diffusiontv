import React from 'react';
import { useRouter } from 'next/router';
import { House, User, Info } from "@phosphor-icons/react";
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';
import { handleNavigationAway } from '../../state/localStorageHelpers';


const Navbar: React.FC = () => {
    const router = useRouter();
    const { userState } = useUserUUID();
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
            handleNavigationAway();
            router.push('/profile');
        }
    };

    const handleInfo = () => {
        // router.push('/api/auth/logout');
        router.push('/info')
    }
return (
    <div className="h-16 flex justify-between items-start bg-black px-16" style={{ borderTop: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex flex-col items-center text-white mt-2" onClick={navigateToHome}>
            {router.pathname === '/' ? <House size={28} weight='fill' color="#fff" /> : <House size={32} color="#fff" />}
            <p className="text-xs mt-1">Home</p>
        </div>
        <div className="flex flex-col items-center text-white mt-2">
            <Info size={28} color="#fff" weight="fill" onClick={handleInfo} />
        </div>
        <div className="flex flex-col items-center text-white mt-2" onClick={navigateToProfile}>
            {router.pathname === '/profile' ? <User size={28} weight='fill' color="#fff" /> : <User size={32} color="#fff" />}
            <p className="text-xs mt-1">Profile</p>
        </div>
    </div>
);
}


export default Navbar;