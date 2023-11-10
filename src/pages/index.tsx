import React, { useEffect, useState } from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Navbar from '../components/navbar';
import ReactPlayer from 'react-player';
import styles from './index.module.css'
import { SpeakerSimpleX } from '@phosphor-icons/react';
import Sidebar from '../components/sidebar';
import { useVideoFeed } from '../state/VideoFeedProvider';
import { handleNavigationReturn, checkHasNavigatedAway } from '../state/localStorageHelpers'
import { Swiper as SwiperClass } from 'swiper';


const Home: React.FC = () => {
    const {
        videos,
        currentPage,
        muted,
        isClient,
        activeVideoId,
        activeVideoData,
        isSwiping,
        firstPlay,
        buffered,
        drawerOpen,
        setVideos,
        setCurrentPage,
        setMuted,
        setIsClient,
        setActiveVideoId,
        setActiveVideoData,
        setIsSwiping,
        setFirstPlay,
        setBuffered,
        setDrawerOpen,
    } = useVideoFeed();

    // const [videos, setVideos] = useState<any[]>([]); //keep
    // const [currentPage, setCurrentPage] = useState<number>(1); //keep
    // const [muted, setMuted] = useState(true);
    // const [isClient, setIsClient] = useState(false); //keep
    // const [activeVideoId, setActiveVideoId] = useState<string | null>(null); // keep
    // const [activeVideoData, setActiveVideoData] = useState<IVideoData>();  // keep
    // const [isSwiping, setIsSwiping] = useState(false);
    // const [firstPlay, setFirstPlay] = useState(true); //keep
    // const [buffered, setBuffered] = useState(false); //keep

    const [videoRefs, setVideoRefs] = useState<Record<string, any>>({});
    const [lastSlideIndex, setLastSlideIndex] = useState<number | null>(null);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const [tmpUrl, setTmpUrl] = useState<string | string>("");
    const [nextVideoId, setNextVideoId] = useState<string | null>(null);
    const [isPlayClicked, setIsPlayClicked] = useState(true);
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null); // Done through localstorage don't remember why vs. contextapi



    useEffect(() => {
        // Set isClient to true only on client-side (after mounting)
        console.log("isclient = ", isClient);
        // localStorage.removeItem('activeSwiperIndex');
        // localStorage.removeItem('hasNavigatedAway');
        setIsClient(typeof window !== 'undefined');
    }, []);

    useEffect(() => {
        console.log("swiper instance = ", swiperInstance);
        const savedIndex = localStorage.getItem('activeSwiperIndex');
        if (swiperInstance && savedIndex !== null) {
            const index = parseInt(savedIndex, 10);
            // Use the Swiper API to go to the saved slide
            swiperInstance.slideTo(index, 0, false);
        }
        // Assuming swiperInstance is a reference to your Swiper instance
    }, [swiperInstance]);


    useEffect(() => {

        console.log("Check Nav top of UE: ", checkHasNavigatedAway())
        console.log("fetching videos again", currentPage)
        console.log("video length = ", videos.length)

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

        if (checkHasNavigatedAway()) {
            console.log("yes, has moved away: ", checkHasNavigatedAway())
            console.log("active vid = ", activeVideoId)
            console.log("video set = ", videos)
            console.log("Video url = ", activeVideoData?.videoUrl)
            setIsSwiping(false);
            handleNavigationReturn();
        }
        else {
            fetchVideos();
        }
    }, [currentPage]);

    const handleSlideChange = (swiper: any) => {
        console.log("Inside handle");
        setBuffered(false);
        const videosList = videos;
        localStorage.setItem('activeSwiperIndex', swiper.activeIndex);


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

    // const handleSlideChange = (swiper: any) => {
    //     console.log("Inside handle");
    //     const videosList = videos;

    //     const prevVideoId = swiper.slides[swiper.previousIndex].getAttribute('data-video-id');
    //     const activeVideoId = swiper.slides[swiper.activeIndex].getAttribute('data-video-id');
    //     const activeIndex = swiper.activeIndex;
    //     setActiveVideoId(activeVideoId);
    //     setActiveVideoData({
    //         index: swiper.activeIndex,
    //         videoUrl: videosList[swiper.activeIndex].data.storage.videoUrl,
    //         thumbUrl: videosList[swiper.activeIndex].data.storage.thumbUrl
    //     })

    //     if (swiper.activeIndex > swiper.previousIndex) {
    //         // User swiped to the next slide (down)
    //         setTmpUrl(mockFetch[1]);  // For simplicity, using mockFetch[1] as example
    //     } else if (swiper.activeIndex < swiper.previousIndex) {
    //         // User swiped to the previous slide (up)
    //         setTmpUrl(mockFetch[0]);  // Use the URL for the previous video
    //     }
    // };

    const fetchMoreVideos = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const activeVideoIndex = videos.findIndex(video => video.data.dbData.videoId === activeVideoId);
    console.log("XXX Active video index = ", activeVideoIndex)

    useEffect(() => {
        if (activeVideoIndex === -1) {
            localStorage.removeItem('activeSwiperIndex');
            localStorage.removeItem('hasNavigatedAway');
        }

    }, [activeVideoIndex])



    return (
        <div className="bg-black flex flex-col fixed inset-0" id="videos__container">
            <div className="flex-grow relative max-h-[calc(100%-64px)]">
                <Swiper
                    onSwiper={(swiper: SwiperClass) => setSwiperInstance(swiper)} // Sets swiper's active index
                    style={{ height: '100%', zIndex: 4 }}  // Setting height to 100% of its parent
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    onSlideChange={(swiper) => handleSlideChange(swiper)}
                    // onTouchEnd={() => setIsSwiping(false)}
                    // onTouchStart={() => setIsSwiping(true)}
                    onSliderMove={() => setIsSwiping(true)}
                    onTouchEnd={() => setIsSwiping(false)} // this is ok but sidebar kind of messed 
                    onSlideChangeTransitionEnd={() => setIsSwiping(false)}
                >
                    {videos.map((video, index) => (
                        <SwiperSlide
                            key={video.data.dbData.videoId}
                            data-video-id={video.data.dbData.videoId}
                            style={{ height: 'calc(100vh - 64px)' }}
                        >
                            {/* Logic to display thumbnails for previous, current, and next slides */}

                            {/* {(video.data.storage.videoUrl === activeVideoData?.videoUrl) && ( */}
                            {(index === activeVideoIndex - 1 || index === activeVideoIndex || index === activeVideoIndex + 1) && (
                                <div className={styles.DivVideoSlideContainer}>
                                    {/* <img src={video.assets.thumbnail} */}
                                    <img src={video.data.storage.thumbUrl}
                                        style={{
                                            width: '100%',
                                            maxHeight: 'calc(100vh - 64px)',
                                            display: (isSwiping || !buffered) ? 'block' : 'none',
                                            objectFit: 'cover'
                                        }} />
                                </div>
                            )}

                            {/* Display the fake video slide if the condition above doesn't hold */}
                            {index !== activeVideoIndex - 1 && index !== activeVideoIndex && index !== activeVideoIndex + 1 && (
                                <div className={styles.DivFakeVideoSlide} />
                            )}

                            <Sidebar video={video} />
                        </SwiperSlide>
                    ))}


                </Swiper>
                {isClient && (
                    <ReactPlayer
                        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100%', zIndex: 3, opacity: (isSwiping || !buffered) ? 0 : 1, pointerEvents: 'none' }}
                        className="webapp-mobile-player-container"
                        width="100%"
                        height="100%"
                        url={activeVideoData?.videoUrl} // state managed URL of the currently playing video
                        playing={!isSwiping}
                        muted={muted}
                        loop={true}
                        playsinline={true}
                        onBufferEnd={() => {
                            setBuffered(true)
                        }}
                    />
                )}
            </div>
            {

                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    color: 'white',
                }}>

                    <span>{isSwiping ? "Swiping" : "Not Swiping"}</span>
                    <span>{buffered ? "Buffered" : "Not Buffered"}</span>
                    <span>{checkHasNavigatedAway() ? "| N-Yes" : "| N-Not "}</span>
                    <span>{isClient ? "| Client-Yes" : "| Client-Not "}</span>
                    <span> {(activeVideoIndex === activeVideoIndex) || firstPlay === false || buffered} </span>

                </div>
            }

            <div className="flex-shrink-0 flex-grow-0 relative" >
                <Navbar />
            </div>


            {/* Drawer (Modal) */}
            <dialog id="drawerModal" className={`modal ${drawerOpen ? 'modal-open' : ''}`}>
                <div className="modal-box relative">
                    {/* Close button */}
                    <button
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={() => setDrawerOpen(false)}
                    >✕</button>

                    {/* Drawer contents */}
                    <h3 className="text-lg font-bold mb-4">Report</h3>
                    {/* Buttons */}
                    <div className="flex flex-col space-y-2">
                        <button className="btn w-full px-4 py-2">Not Playing</button> {/* Adjust px and py values as needed */}
                        <button className="btn w-full px-4 py-2">Content Missing</button>
                        <button className="btn w-full px-4 py-2">Graphic Content</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setDrawerOpen(false)}>close</button>
                </form>

            </dialog>




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