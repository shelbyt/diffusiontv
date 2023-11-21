import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppUserProvider } from '../state/UserContext';
import { PopupProvider } from '../state/PopupContext';
import { AlertProvider } from '../state/AlertContext';

import Layout from '../components/layout'
import { VideoFeedProvider } from '../state/VideoFeedProvider';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <AppUserProvider>
                <PopupProvider>
                    <AlertProvider>
                    <VideoFeedProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </VideoFeedProvider>
                    </AlertProvider>
                </PopupProvider>
            </AppUserProvider>
        </UserProvider>
    )
}

export default MyApp
