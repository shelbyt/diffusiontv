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
import TopNavbar from '../components/topNavbar';

let debounceTimer: string | number | NodeJS.Timeout | undefined;


const Home: NextPage = () => {
    const [videos, setVideos] = useState<Video[]>([])
    const observerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [prev, setPrevPage] = useState(-1)
    const { data, mutate } = useSWR(`api/videos?method=get&currentPage=${currentPage}`, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: false,
    });

    const { user, isLoading: authLoading, error } = useUser();
    const { userData, isLoading: userDBLoading, isError } = useUserDB(user);
    const [shouldFetch, setShouldFetch] = useState(true);

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
        console.log("db: Current page = ", currentPage)
    }, [currentPage]);

    useEffect(() => {
        console.log("db: Component has re-rendered");
    }, []);

    useEffect(() => {
        if (data) {
            setVideos(prevVideos => [...prevVideos, ...data.data.reverse()]);
        }
    }, [data]);

    const fetchMoreVideos = () => {
        console.log("db:prev,current = ", prev, currentPage)
        if (prev === currentPage) return
        setPrevPage(currentPage)
        setCurrentPage(currentPage + 1);
    };
    const videoRefs = useRef<HTMLVideoElement[]>([]);

    const handleSlideChange = (swiper: any) => {
        const current = swiper.activeIndex;
        const previous = swiper.previousIndex;

        // Pause the video at the previous index
        if (videoRefs.current[previous]) {
            console.log("db:pause")
            videoRefs.current[previous].pause();
            // videoRefs.current[previous].muted = true;
            // videoRefs.current[current].volume = 0;
        }

        // Decide to play previous or next based on swipe direction
        if (current > previous) {
            // Swiped down, play next
            if (videoRefs.current[current]) {
                console.log("db:play")
                videoRefs.current[current].play();
                // videoRefs.current[current].muted = false;
                // videoRefs.current[current].volume = 0.25;
            }
        } else {
            // Swiped up, play previous
            if (videoRefs.current[current]) {

                console.log("db:play")
                videoRefs.current[current].play();
                // videoRefs.current[current].muted = false;
                // videoRefs.current[current].volume = 0.25;
            }
        }
    };


    return (
        <div className={styles.app} id="videos__container">
            <TopNavbar />
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
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    freeMode={false}
                    autoHeight={true}  // Adjust the height automatically
                    onReachEnd={fetchMoreVideos}
                    onSlideChange={(swiper) => {
                        handleSlideChange(swiper);
                        console.log("db: Change triggered!")
                    }}

                >
                    {videos.map((video: Video, index) => (
                        <SwiperSlide key={video?.videoId}>
                            <VideoComponent parentRef={(el) => videoRefs.current[index] = el} video={video} mutate={mutate} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* <TopNavbar /> */}
            </div>
            {/* <Navbar /> */}
        </div >
    )
}

export default Home
