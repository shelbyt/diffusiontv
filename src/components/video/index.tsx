import Video from '@api.video/nodejs-client/lib/model/Video'
import React, { FC, useRef, useState, useEffect } from 'react'
import Footer from '../footer'
import Sidebar from '../sidebar'
import styles from './videos.module.css'
import ApiVideoPlayer from '@api.video/react-player'

export interface IvideosProps {
    video: Video
    mutate: () => void
    parentRef?: React.Ref<any>;
}

const VideoComponent: FC<IvideosProps> = ({ video, mutate, parentRef }): JSX.Element => {
    const [playing, setPlaying] = useState<boolean>(true)

    const { videoId } = video

    const videoRef = useRef<ApiVideoPlayer>(null)

    const onVideoPress = () => {
        if (playing) {
            pause()
        } else {
            play()
        }
    }

    const pause = () => {
        videoRef.current?.pause()
        setPlaying(false)
    }
    const play = () => {
        videoRef.current?.play()
        setPlaying(true)
    }
    const [muted, setMuted] = useState<boolean>(false); // New state for mute status

    const toggleMute = () => {
        console.log("xxx clicked -> prev= ", muted)
        setMuted(!muted); // Toggle between mute and unmute
    };
    const height = window.screen.availHeight - 50

    useEffect(() => {
        console.log("db: Player Component has re-rendered");
        // console.log("db: parentRef = ", parentRef)
    }, []);


    return (
        <>
            {video && (
                <div className={styles.video} id={videoId}>
                    <ApiVideoPlayer
                        video={{ id: videoId }}
                        videoStyleObjectFit={"contain"}
                        ref={parentRef}
                        style={{
                            width: screen.width,
                            height: height,
                            scrollSnapAlign: 'start',
                            border: 0,
                        }}
                       volume={muted ? 0 : 0.25}
                        autoplay
                        chromeless
                        loop
                       muted={true}  // Use the state variable here
                    />
                    <button
                        onClick={toggleMute}
                        style={{
                            position: 'absolute',
                            top: '50px',  // Updated from '10px' to '50px' to move it downwards
                            left: '10px',
                            zIndex: 1000
                        }}
                    >
                        {muted ? 'Unmute' : 'Mute'}
                    </button>
                    <div onClick={onVideoPress} className={styles.video__press}></div>
                    {/* <Footer video={video} /> */}
                    <Sidebar video={video} mutate={mutate} />
                </div>
            )}
        </>
    );
}

export default VideoComponent;

