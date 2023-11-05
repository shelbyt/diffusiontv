import React, { useEffect, useState } from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Navbar from '../components/navbar';
import ReactPlayer from 'react-player';
import styles from './index.module.css'
import Sidebar from '../components/sidebar';
import {SpeakerSimpleX } from '@phosphor-icons/react';

interface VideoData {
    videoUrl: string;
    thumbUrl: string;
    index: number;
}
const Home: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPlayClicked, setIsPlayClicked] = useState(true);
    const [muted, setMuted] = useState(true);
    const [videoRefs, setVideoRefs] = useState<Record<string, any>>({});
    const [lastSlideIndex, setLastSlideIndex] = useState<number | null>(null);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [tmpUrl, setTmpUrl] = useState<string | string>("");
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [activeVideoData, setActiveVideoData] = useState<VideoData>();
    const [nextVideoId, setNextVideoId] = useState<string | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [firstPlay, setFirstPlay] = useState(true);


    useEffect(() => {
        async function fetchVideos() {
            try {
                const response = await fetch(`/api/videos?method=get&currentPage=${currentPage}`);
                const newData = await response.json();
                setVideos(prevVideos => {
                    const newVideos = newData.filter((newVideo: any) =>
                        !prevVideos.some(prevVideo => prevVideo.data.dbData.videoId === newVideo.data.dbData.videoId));
                    return [...prevVideos, ...newVideos];
                });
                if (currentPage === 1) {
                    setActiveVideoData({
                        index: 0,
                        videoUrl: newData[0].data.storage.videoUrl,
                        thumbUrl: newData[0].data.storage.thumbUrl
                    });
                    setIsClient(true);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }

        fetchVideos();
    }, [currentPage]);


    // useEffect(() => {
    //     async function fetchVideos() {
    //         try {
    //             const response = await fetch(`/api/videos?method=get&currentPage=${currentPage}`);
    //             const data = await response.json();
    //             if (currentPage === 1) {
    //                 setActiveVideoData({
    //                     index: 0,
    //                     videoUrl: data[0].data.storage.videoUrl,
    //                     thumbUrl: data[0].data.storage.thumbUrl
    //                 })
    //                 console.log("Data check")
    //                 console.log(data)
    //                 setVideos(prevVideos => [...prevVideos, ...data]);
    //                 setIsClient(true);
    //             }
    //             else {
    //                 setVideos(prevVideos => [...prevVideos, ...data]);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching videos:", error);
    //         }
    //     }


    //     fetchVideos();
    // }, [currentPage]);

    const xhandlePlayClick = (videoId: string) => {

        // Timeout is some magic to get video to play on first click and load
        setTimeout(() => {
            setIsPlayClicked(true);
            // setTmpUrl(mockFetch[0])
            console.log("Play click");
        }, 100);  // Adjust the delay as needed
    };

    const handlePlayClick = (videoId: string) => {
        setIsPlayClicked(true);
        setMuted(false);

        const videoRef = videoRefs[videoId];
        if (videoRef && videoRef.current) {
            videoRef.current.play(); // Call the Play method using the specific ref
        }

        console.log("Play click");
    };

    const handleSlideChange = (swiper: any) => {
        console.log("Inside handle");
        const videosList = videos;

        const prevVideoId = swiper.slides[swiper.previousIndex].getAttribute('data-video-id');
        const activeVideoId = swiper.slides[swiper.activeIndex].getAttribute('data-video-id');
        const activeIndex = swiper.activeIndex;
        setActiveVideoId(activeVideoId);
        setActiveVideoData({
            index: swiper.activeIndex,
            videoUrl: videosList[swiper.activeIndex].data.storage.videoUrl,
            thumbUrl: videosList[swiper.activeIndex].data.storage.thumbUrl
        })

        // If the current index is len-2, fetch the next set of videos by incrementing currentpage? 

        console.log('active and length = ', swiper.activeIndex, videosList.length)
        if (swiper.activeIndex === videosList.length - 2) {
            console.log("time to fetch")
            setCurrentPage(prevPage => prevPage + 1);
            //fetchMoreVideos();
        }
    };

    const fetchMoreVideos = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };
    const activeVideoIndex = videos.findIndex(video => video.data.dbData.videoId === activeVideoId);
    console.log("Active index = ", activeVideoIndex)

    return (
        <div className="bg-black flex flex-col fixed inset-0" id="videos__container">
            <div className="flex-grow relative max-h-[calc(100%-64px)]">
                <Swiper
                    style={{ height: '100%', zIndex: 4 }}  // Setting height to 100% of its parent
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    onSlideChange={(swiper) => handleSlideChange(swiper)}
                    // onTouchStart={() => setIsSwiping(true)}
                    onSlideChangeTransitionEnd={() => setIsSwiping(false)}
                >
                    {videos.map((video, index) => (
                        <SwiperSlide
                            key={video.data.dbData.videoId}
                            data-video-id={video.data.dbData.videoId}
                            style={{ height: 'calc(100vh - 64px)' }}
                        >

                            {/* Render ReactPlayer for prev, current, and next videos */}
                            {(index >= activeVideoIndex - 1 && index <= activeVideoIndex + 1) && (
                                <div className={styles.DivVideoSlideContainer}>
                                    <ReactPlayer
                                        url={video.data.storage.videoUrl}
                                        playing={(index === activeVideoIndex && !isSwiping) || firstPlay === false}
                                        muted={(index !== activeVideoIndex && activeVideoIndex !== -1) || muted}
                                        loop={true}
                                        playsinline={true}
                                        className="webapp-mobile-player-container"
                                        width="100%"
                                        height="100%"
                                        style={{ pointerEvents: 'none' }}
                                    />

                                </div>
                            )}

                            <Sidebar video={video} />

                            {/* Display a placeholder for other videos */}
                            {index < activeVideoIndex - 1 || index > activeVideoIndex + 1 && (
                                <div className={styles.DivFakeVideoSlide} />
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex-shrink-0 flex-grow-0 relative" >
                <Navbar />
            </div>
            {
                firstPlay && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)' // This gives a faded background
                    }}>
                        <button
                        className='btn'
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '1em',
                                padding: '10px 20px'
                            }}
                            onClick={() => {
                                setMuted(false);  // Assuming setMuted is the setter for your muted state
                                setFirstPlay(false);
                            }}
                        >
                            Unmute
                            <SpeakerSimpleX size={20} color="#140000" weight="fill" />


                        </button>
                    </div>
                )
            }

        </div>
    );
}
export default Home;