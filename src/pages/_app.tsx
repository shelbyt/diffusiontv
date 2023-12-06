import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppUserProvider } from '../state/UserContext';
import { PopupProvider } from '../state/PopupContext';
import { AlertProvider } from '../state/AlertContext';
import { ActiveTabProvider } from '../state/ActiveTabContext';

import Layout from '../components/layout'
import { VideoFeedProvider } from '../state/VideoFeedProvider';

// Import Mixpanel configuration
import mixpanel from '../utils/mixpanel';
import { useEffect } from 'react';
import Router from 'next/router';
import Script from 'next/script'; // Import the Script component


function MyApp({ Component, pageProps }: AppProps) {
    // Track page views
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            mixpanel.track("Page Viewed", { page: url });
        };

        Router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-PPZBS5MHFX"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());

                          gtag('config', 'G-PPZBS5MHFX');
                        `}
            </Script>
            <UserProvider>
                <AppUserProvider>
                    <PopupProvider>
                        <AlertProvider>
                            <VideoFeedProvider>
                                <ActiveTabProvider>
                                    <Layout>
                                        <Component {...pageProps} />
                                    </Layout>
                                </ActiveTabProvider>
                            </VideoFeedProvider>
                        </AlertProvider>
                    </PopupProvider>
                </AppUserProvider>
            </UserProvider>
        </>
    )
}

export default MyApp
