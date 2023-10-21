import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { UserProvider } from '@auth0/nextjs-auth0/client';

const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
    const res = await fetch(input, init)
    return res.json()
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
        <SWRConfig value={{ fetcher }}>
            <audio id="background-music" loop autoPlay>
                <source src="/music/m3.mp3" type="audio/mpeg"/>
                    Your browser does not support the audio element.
            </audio>

            <Component {...pageProps} />
        </SWRConfig>
        </UserProvider>
    )
}

export default MyApp
