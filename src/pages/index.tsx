import React, { useRef, useEffect, useState } from 'react'
import Video from '@api.video/nodejs-client/lib/model/Video'
import VideosListResponse from '@api.video/nodejs-client/lib/model/VideosListResponse'
import type { NextPage } from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import DesktopView from '../components/desktopView'
import VideoComponent from '../components/video/index'
import styles from './index.module.css'
import Navbar from '../components/navbar'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useUserDB } from '../hooks/useUserDB';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';


const Home: NextPage = () => {
    const [videos, setVideos] = useState<Video[]>([])
    const observerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const { data, mutate } = useSWR<VideosListResponse>(() => `api/videos?method=get&currentPage=${currentPage}`)
    const { user, isLoading: authLoading, error } = useUser();
    const { userData, isLoading: userDBLoading, isError } = useUserDB(user);

    const router = useRouter();

    useEffect(() => {
        // if (!authLoading && !user) {
        //     console.log("Auth: You need to login!");
        //     router.push('/api/auth/login');
        // } else if (userData) {
        //     console.log("auth user object ", user)
        //     console.log("User saved or found in the database.");
        // } else if (isError) {
        //     console.log("Error saving or finding user in the database.");
        // }
    }, [user, authLoading, userData, isError]);




    useEffect(() => {
        if (data) {
            setVideos(prevVideos => [...prevVideos, ...data.data.reverse()]);
        }
    }, [data]);

    const fetchMoreVideos = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className={styles.app} id="videos__container">
            <Head>
                <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
                <title>FlowTok</title>
                <meta name="description" content="Curated AI videos. For You." />

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.app__large_screen}>
                <DesktopView />
            </div>

            <div className={styles.app__videos}>
                <Swiper
                    direction="vertical" // vertical scrolling
                    slidesPerView={1} // 1 slide visible at a time
                    spaceBetween={0} // no space between slides
                    freeMode={false} // disable free mode to stick to slides
                    onReachEnd={fetchMoreVideos}>
                    {videos.map((video: Video, index) => (
                        <SwiperSlide key={video?.videoId}>
                            <VideoComponent video={video} mutate={mutate} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* <Navbar /> */}
        </div>
    )
}

export default Home
