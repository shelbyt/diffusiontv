import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppUserProvider } from '../state/UserContext';
import { PopupProvider } from '../state/PopupContext';

import Layout from '../components/layout'
import { VideoFeedProvider } from '../state/VideoFeedProvider';
import { SessionProvider } from 'next-auth/react';


// const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
const fetcher = async (input: RequestInfo, init: RequestInit,) => {
    const res = await fetch(input, init)
    return res.json()
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <AppUserProvider>
                <PopupProvider>
                <VideoFeedProvider>
                    <Layout>
                        <SWRConfig value={{ fetcher }}>
                            <Component {...pageProps} />
                        </SWRConfig>
                    </Layout>
                </VideoFeedProvider>
                </PopupProvider>
            </AppUserProvider>
        </UserProvider>
    )
}

export default MyApp
