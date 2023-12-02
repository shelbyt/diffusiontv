import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Export } from '@phosphor-icons/react';
import useStandaloneCheck from '../hooks/useStandaloneCheck'; // Import the hook
import Home from '../components/home'; // Assuming this is your Home component
import useWindowWidth from '../hooks/useWindowWidth';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


const IndexPage: React.FC = () => {

    const isStandalone = useStandaloneCheck(); // Use the hook to check for standalone mode
    const windowWidth = useWindowWidth();
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
    }, []);

    if (isClient) {
        if (isBrowser) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-black">
                    <Image
                        src="/qr.png"
                        alt="QR Code"
                        width={512}
                        height={512}
                        layout="fixed"
                    />
                    <p className="text-white mt-4 text-3xl">📱</p>
                </div>
            );
        }
        else if (!isStandalone) {
            return (
                <div className="flex h-screen bg-gray-100">
                    <div className="m-auto text-center">
                        <Image
                            src="/logohq.png"
                            alt="Diffusion TV Logo"
                            width={144}
                            height={50}
                            layout="fixed"
                        />
                        <h1 className="text-xl font-bold mb-4">Install Web App</h1>
                        <p className="mb-8">
                            Install this application to your home screen for the best experience
                        </p>
                        <div className="inline-block p-4 bg-gray-200 rounded-lg">
                            <span className="align-middle">Just Tap </span>
                            <Export className="inline-block align-middle text-lg" color="#007aff" />
                            <span className="align-middle"> and click &apos;Add to Home Screen&apos;</span>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return <Home />;
        }
    }
    return null;

    // Render the Home component if in standalone mode
    // if (isStandalone ) {
    //     return <Home />;
    // }
    // if(isStandalone === null) {
    //     return null;
    // }

    // Render the installation instructions if not in standalone mode
};

export default IndexPage;
