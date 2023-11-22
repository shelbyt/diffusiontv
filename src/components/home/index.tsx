import React, { useEffect, useState } from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Navbar from '../../components/navbar';
import ReactPlayer from 'react-player';
import styles from './index.module.css'
import { SpeakerSimpleX, Play } from '@phosphor-icons/react';
import Sidebar from '../../components/sidebar';
import { useVideoFeed } from '../../state/VideoFeedProvider';
import { handleNavigationReturn, checkHasNavigatedAway } from '../../state/localStorageHelpers'
import { Swiper as SwiperClass } from 'swiper';
import BottomText from '../../components/bottomTextbar';
import useUserUUID from '../../hooks/useUserUUID';
import { submitReport } from '../../utils/submitReport';
import { REPORTTYPE } from '@prisma/client';



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
	const [reportComplete, setReportComplete] = useState(false);
	const [isVideoPaused, setIsVideoPaused] = useState<boolean>(true);
	const { userState } = useUserUUID();
	const [swiperKey, setSwiperKey] = useState(0);


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
	}, [swiperInstance]);


	useEffect(() => {

		console.log("Check Nav top of UE: ", checkHasNavigatedAway())
		console.log("fetching videos again", currentPage)
		console.log("video length = ", videos.length)
		async function fetchVideos() {

			// if (currentPage % 3 === 0) {
			// 	// Remove the first n elements from the videos state
			// 	setVideos(prevVideos => prevVideos.slice(5));

			// 	// Remove the first n slides from the Swiper instance
			// 	if (swiperInstance) {
			// 		for (let i = 0; i < 5; i++) {
			// 			swiperInstance?.removeSlide(0);
			// 		}
			// 	}
			// }

			if (currentPage % 2 === 0) {
				// Reset the videos state
				setVideos([]);

				// Re-initialize the Swiper instance
				//TODO: small bug whre thumbnail is wrong
				if (swiperInstance) {
					swiperInstance.destroy(true, true);
					setSwiperInstance(null);
				}

				// Increment swiperKey to force a re-render of the Swiper component
				setSwiperKey(prevKey => prevKey + 1);
			}


			try {
				console.log("In Fetch = ", userState)
				const baseUrl = `/api/videos/feed?method=get&currentPage=${currentPage}`;
				const userUuidParam = userState?.prismaUUID ? `&uuid=${userState.prismaUUID}` : `&uuid=unauth`;
				const finalUrl = baseUrl + userUuidParam;

				const response = await fetch(finalUrl);
				const newData = await response.json();
				setVideos(prevVideos => {
					const newVideos = newData.filter((newVideo: any) =>
						!prevVideos.some(prevVideo => prevVideo.data.dbData.videoId === newVideo.data.dbData.videoId));
					return [...prevVideos, ...newVideos];
				});
				if (currentPage === 1) {
					setActiveVideoData({
						index: 0,
						iid: newData[0].data.dbData.id,
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
			setMuted(true)
			setFirstPlay(true)

			handleNavigationReturn();
		}
		else {
			fetchVideos();
		}
	}, [currentPage]);

	const handleSlideChange = (swiper: any) => {
		// Cleanup from prev
		setBuffered(false);
		setReportComplete(false);
		// setDrawerOpen(false);

		const videosList = videos;
		localStorage.setItem('activeSwiperIndex', swiper.activeIndex);


		const prevVideoId = swiper.slides[swiper.previousIndex].getAttribute('data-video-id');
		const activeVideoId = swiper.slides[swiper.activeIndex].getAttribute('data-video-id');
		const activeIndex = swiper.activeIndex;
		setActiveVideoId(activeVideoId);
		setActiveVideoData({
			index: swiper.activeIndex,
			videoUrl: videosList[swiper.activeIndex].data.storage.videoUrl,
			thumbUrl: videosList[swiper.activeIndex].data.storage.thumbUrl,
			iid: videosList[swiper.activeIndex].data.dbData.id
		})

		// If the current index is len-2, fetch the next set of videos by incrementing currentpage? 

		console.log('active and length = ', swiper.activeIndex, videosList.length)
		if (swiper.activeIndex === videosList.length - 1) {
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

	const handleReportAndClose = async (reportType: REPORTTYPE, iid: string, uuid = 'unauth') => {
		console.log("active = ", activeVideoData)
		try {
			const res = await submitReport(reportType, iid, uuid);
			setReportComplete(true); // Close the modal after submitting the report
		} catch (error) {
			console.error('Failed to submit report:', error);
		}
	};


	// useEffect(() => {

	//     if(isSwiping){

	// console.log("IS SWIPING Next video url is ", videos[activeVideoIndex + 1]?.data.storage.videoUrl)
	// const unpreload = preloadVideo(
	//     videos[activeVideoIndex + 1]?.data.storage.videoUrl
	// );

	// console.log("unpreload = ", unpreload)
	//     }

	// }, [isSwiping])



	return (
		<>
			<div className="bg-black flex flex-col fixed inset-0" id="videos__container">
				<div className="flex-grow relative max-h-[calc(100%-64px)]">
					<Swiper
						key={swiperKey}
						onSwiper={(swiper: SwiperClass) => setSwiperInstance(swiper)} // Sets swiper's active index
						style={{ height: '100%', zIndex: 4 }}  // Setting height to 100% of its parent
						direction="vertical"
						slidesPerView={1}
						spaceBetween={0}
						onSlideChange={(swiper: any) => handleSlideChange(swiper)}
						// onTouchEnd={() => setIsSwiping(false)}
						onTouchStart={() => setMuted(false)}
						onSliderMove={() => setIsSwiping(true)}
						onTouchEnd={() => setIsSwiping(false)} // this is ok but sidebar kind of messed 
						onSlideChangeTransitionEnd={() => setIsSwiping(false)}
						onSlideChangeTransitionStart={() => setIsVideoPaused(false)}
						onTap={() => setIsVideoPaused(!isVideoPaused)}
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
								{
									isVideoPaused && (
										<div style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
										}}>
											<button
												className='btn'
												style={{
													fontSize: '1em',
													padding: '10px 20px'
												}}
											>
												<Play size={20} color="#140000" weight="fill" />
											</button>
										</div>
									)
								}

								<Sidebar video={video} viewer={userState?.prismaUUID} />
								{/* Add the BottomText component here */}
								<BottomText username={video.data.dbData.username} image={video.data.dbData.user?.imageUrl} meta={video.data.dbData.meta} />
							</SwiperSlide>
						))}

					</Swiper>
					{isClient && (
						<ReactPlayer
							style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100%', zIndex: 3, opacity: (isSwiping || !buffered) ? 0 : 1, pointerEvents: 'none' }}
							// style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 3, opacity: (isSwiping || !buffered) ? 0 : 1, pointerEvents: 'none' }}
							className="webapp-mobile-player-container"
							width="100%"
							height="100%"
							// objectFit="fill"
							url={activeVideoData?.videoUrl} // state managed URL of the currently playing video
							playing={!isSwiping && !isVideoPaused}
							// config={{
							// 	file: {
							// 		attributes: {
							// 			preload: "auto",
							// 		},
							// 	},
							// }}
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
					(!swiperInstance || !videos.length) && (
						<div style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							zIndex: 999,
							backgroundColor: 'rgba(0, 0, 0, 0.0)' // This gives a faded background
						}}
						>
							<span

								style={{
									position: 'absolute',
									// top: '50%',
									// left: '33%',
									fontSize: '1em',
									padding: '10px 20px'
								}}
								className="loading text-accent loading-bars loading-sm"></span>
						</div>
					)
				}

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
						<span> {activeVideoData?.videoUrl} </span>
						<span> {muted ? 'Mtrue' : 'Mfalse'} </span>
						<br />
						<span> {`CP: ${currentPage}`} </span>

						{/* <span> {"(LS)NavAway:"} </span>
                    <span> {localStorage.getItem('hasNavigatedAway') } </span>
                    <span> {"(LS)ActiveIndex:"} </span>
                    <span> {localStorage.getItem('activeSwiperIndex')} </span> */}

					</div>
				}

				<div className="flex-shrink-0 flex-grow-0 relative" >
					<Navbar />
				</div>


				<dialog id="drawerModal" className={`modal ${drawerOpen ? 'modal-open' : ''}`}>
					<div className="modal-box relative">
						<button
							className="btn btn-sm btn-circle absolute right-2 top-2"
							onClick={() => setDrawerOpen(false)}
						>✕</button>

						<h3 className="text-lg font-bold mb-4">Report</h3>
						{!reportComplete ? (
							// Buttons
							<div className="flex flex-col space-y-2">
								<button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.videoMissing, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Video Not Playing</button>
								<button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.videoLag, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Video Lag</button>
								{/* <button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.videoIncorrect, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Video Incorrect</button> */}
								<button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.thumbnailMissing, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Thumbnail Missing</button>
								<button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.thumbnailLag, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Thumbnail Lag</button>
								{/* <button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.thumbnailIncorrect, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Thumbnail Incorrect</button> */}
								<button className="btn w-full px-4 py-2" onClick={() => handleReportAndClose(REPORTTYPE.susContent, activeVideoData?.iid || '', userState?.prismaUUID || 'unauth')}>Sus Content</button>
							</div>
						) : (
							// Thank you message
							<div className="text-center p-4">
								Reported! Thank You
							</div>
						)}

					</div>
					<form method="dialog" className="modal-backdrop">
						<button onClick={() => setDrawerOpen(false)}>close</button>
					</form>
				</dialog>
			</div>
		</>
	);
}

export default Home;