import React, { useRef, useEffect, useState } from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Navbar from '../components/navbar';
import ApiVideoPlayer from '@api.video/react-player'
import styles from './index.module.css'
import Sidebar from '../components/sidebar';

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
    const [tmpVid, setTmpVid] = useState<string | string>("");
    const [activeVideoId, setActiveVideoId] = useState<string | null>('');
    const [nextVideoId, setNextVideoId] = useState<string | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [showUnmuteButton, setShowUnmuteButton] = useState(true);

    const mockFetchB = ['https://vod.api.video/vod/vi5Q75MhlTktcb0gBojP03pO/hls/manifest.m3u8', 'https://vod.api.video/vod/vi5uo8TNlLqil4DzuNBGgBT/hls/manifest.m3u8']
    const mockFetch = ['https://storage-nyc3.qencode.com/27c8af384031a52f261cc536cb0d9ec4/mp4/1-0/811b7d6c776711ee9627565943a578d8.mp4', 'https://vod.api.video/vod/vi5uo8TNlLqil4DzuNBGgBT/hls/manifest.m3u8']
    const mockFetchVid = ['vi5Q75MhlTktcb0gBojP03pO', 'vi5uo8TNlLqil4DzuNBGgBT','vi5Q75MhlTktcb0gBojP03pO']
    const mockFetchThumbs = ['https://vod.api.video/vod/vi5Q75MhlTktcb0gBojP03pO/thumbnail.jpg', 'https://vod.api.video/vod/vi5uo8TNlLqil4DzuNBGgBT/thumbnail.jpg', 'https://vod.api.video/vod/vi5Q75MhlTktcb0gBojP03pO/thumbnail.jpg']
    useEffect(() => {
        setIsClient(true);
        setTmpUrl(mockFetch[0])
        setTmpVid(mockFetchVid[0])
    }, []);

    useEffect(() => {
        console.log("inside use effect")
        async function fetchVideos() {
            try {
                const response = await fetch(`/api/videos?method=get&currentPage=${currentPage}`);
                const data = await response.json();
                if (currentPage === 1) {
                    setActiveVideoId(data.data[0].videoId)
                    setNextVideoId(data.data[1].videoId)
                }

                // Combine the current videos with the newly fetched ones
                setVideos(prevVideos => [...prevVideos, ...data.data]);

                // Update the refs for the newly fetched videos
                const newRefs = data.data.reduce((acc: any, video: any) => {
                    acc[video.videoId] = React.createRef();
                    return acc;
                }, {});
                setVideoRefs(prevRefs => ({ ...prevRefs, ...newRefs }));
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }


        fetchVideos();
    }, [currentPage]);

    const xhandlePlayClick = (videoId: string) => {

        // Timeout is some magic to get video to play on first click and load
        setTimeout(() => {
            setIsPlayClicked(true);
            setTmpUrl(mockFetch[0])
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
        setActiveVideoId(activeVideoId);

        if (swiper.activeIndex > swiper.previousIndex) {
            // User swiped to the next slide (down)
            setTmpUrl(mockFetch[1]);  // For simplicity, using mockFetch[1] as example
            setTmpVid(mockFetchVid[1])

        } else if (swiper.activeIndex < swiper.previousIndex) {
            // User swiped to the previous slide (up)
            setTmpUrl(mockFetch[0]);  // Use the URL for the previous video
            setTmpVid(mockFetchVid[0])
        }
    };

    const fetchMoreVideos = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };
    const activeVideoIndex = videos.findIndex(video => video.videoId === activeVideoId);

    return (
        <div className="bg-black flex flex-col fixed inset-0" id="videos__container">
            <div className="flex-grow relative max-h-[calc(100%-64px)]">
                <Swiper
                    style={{ height: '100%', zIndex: 4 }}  // Setting height to 100% of its parent
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    onSlideChange={(swiper) => handleSlideChange(swiper)}
                    onSliderMove={() => setIsSwiping(true)}
                    // onTouchEnd={() => setIsSwiping(false)}
                    onTransitionEnd={() => setIsSwiping(false)}
                >
                    {videos.map((video, index) => (
                        <SwiperSlide
                            key={video.videoId}
                            data-video-id={video.videoId}
                            style={{ height: 'calc(100vh - 64px)' }}
                        >
                            {/* Logic to display thumbnails for previous, current, and next slides */}
                            {(index === activeVideoIndex - 1 || index === activeVideoIndex || index === activeVideoIndex + 1) && (
                                <div className={styles.DivVideoSlideContainer}>
                                    <Sidebar />
                                    {/* <img src={video.assets.thumbnail} */}
                                    <img src={mockFetchThumbs[index]}
                                        style={{
                                            width: '100%',
                                            maxHeight: 'calc(100vh - 64px)',
                                            display: (isSwiping) ? 'block' : 'none',
                                            objectFit: 'cover'
                                        }} />
                                </div>
                            )}

                            {/* Display the fake video slide if the condition above doesn't hold */}
                            {index !== activeVideoIndex - 1 && index !== activeVideoIndex && index !== activeVideoIndex + 1 && (
                                <div className={styles.DivFakeVideoSlide} />
                            )}
                        </SwiperSlide>
                    ))}


                </Swiper>

                {isClient && (
                    <div
                        className="webapp-mobile-player-container"
                        style={{
                            position: 'absolute',  // Changed from 'relative' to 'absolute'
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100%',
                            zIndex: 3,
                            opacity: isSwiping ? 0 : 1,
                            pointerEvents: 'none',
                            border: 0,
                        }}
                    >
                        <ApiVideoPlayer
                            video={{ id: tmpVid }}
                            videoStyleObjectFit={"contain"}
                            volume={muted ? 0 : 0.25}
                            style={{ width: '100%', height: '100%' }}
                            autoplay
                            chromeless
                            loop
                            muted={muted}
                        />
                    </div>

                )}
            </div>
            <div className="flex-shrink-0 flex-grow-0 relative" >
                <Navbar />
            </div>
            {
                showUnmuteButton && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)' // This gives a faded background
                    }}>
                        <button
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '2em',
                                padding: '10px 20px'
                            }}
                            onClick={() => {
                                setMuted(false);  // Assuming setMuted is the setter for your muted state
                                setShowUnmuteButton(false);
                            }}
                        >
                            Unmute
                        </button>
                    </div>
                )
            }

        </div>
    );
}

export default Home;
