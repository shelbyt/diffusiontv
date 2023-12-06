import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Export, DotsThreeVertical } from '@phosphor-icons/react';
import useStandaloneCheck from '../hooks/useStandaloneCheck'; // Import the hook
import Home from '../components/home'; // Assuming this is your Home component
import { isBrowser } from 'react-device-detect';
import mixpanel from 'mixpanel-browser';


const IndexPage: React.FC = () => {

    const isStandalone = useStandaloneCheck(); // Use the hook to check for standalone mode
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
    }, []);

    if (isClient) {
        if (isBrowser) {
            mixpanel.track('Onboard: Browser View')
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-black">
                    <Image
                        src="/qr.png"
                        alt="QR Code"
                        width={512}
                        height={512}
                        layout="fixed"
                    />
                    <p className="text-white mt-4 text-3xl">Mobile Exclusive 📱</p>
                </div>
            );
        }
        else if (!isStandalone) {
            mixpanel.track('Onboard: Mobile Not Standalone')
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
                            Please open with Safari (iOS) or Chrome (Andriod) and add to home screen for a native experience. 
                        </p>
                        <div className="inline-block p-4 bg-gray-200 rounded-lg">
                            <span className="align-middle">iOS: Tap </span>
                            <Export className="inline-block align-middle text-lg" color="#007aff" />
                            <span className="align-middle"> and click &apos;Add to Home Screen&apos;</span>
                            <br/>
                            <br/>

                            <span className="align-middle">Andriod: Tap </span>
                            <DotsThreeVertical className="inline-block align-middle text-lg" color="#007aff" />
                            <span className="align-middle"> and click &apos;Add to Home Screen&apos;</span>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            mixpanel.track('Onboard: Mobile Standalone')
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
