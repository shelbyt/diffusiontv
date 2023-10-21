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

const Home: NextPage = () => {
    const [videos, setVideos] = useState<Video[]>([])
    const observerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const { data, mutate } = useSWR<VideosListResponse>(() => `api/videos?method=get&currentPage=${currentPage}`)
    const { user, isLoading, error } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            console.log("Auth: You need to login!");
            router.push('/api/auth/login');
        }
    }, [user, isLoading]);


    useEffect(() => {
        if (data) {
            setVideos(prevVideos => [...prevVideos, ...data.data.reverse()])

        }
        const sections = document.getElementById('videos__container')
        sections?.scrollIntoView(true)
    }, [data])

    useEffect(() => {
        const fetchMoreVideos = async () => {
            console.log("XXX: Fetching more videos")
            setCurrentPage(currentPage + 1)
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchMoreVideos()
                }
            })
        }, options)

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }

    }, [videos])

    return (
        <div className={styles.app} id="videos__container">
            <Head>
                <title>FlowTok</title>
                <meta name="description" content="Curated AI videos. For You." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.app__large_screen}>
                <DesktopView />
            </div>

            <div className={styles.app__videos}>
                {videos.map((video: Video, index) => {
                    return (
                        <div key={video?.videoId} ref={index === videos.length - 2 ? observerRef : null}>
                            <VideoComponent video={video} mutate={mutate} />
                        </div>
                    )
                })}
            </div>
            <Navbar />
        </div>
    )
}

export default Home
