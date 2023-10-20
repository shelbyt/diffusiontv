import { MdFavorite, MdOutlineBookmark } from 'react-icons/md'
import { RiShareForwardFill } from 'react-icons/ri'
import styles from './sidebar.module.css'
import Image from 'next/image'
import Logo from '../../../public/icon-192x192.png'
import { FC, useEffect, useState } from 'react'
import { onShare } from '../../utils/share'
import Video from '@api.video/nodejs-client/lib/model/Video'
import 'animate.css'
import { getSocialResults } from '../../utils/socialResults'
import Metadata from '@api.video/nodejs-client/lib/model/Metadata'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';

export interface ISidebarProps {
    video: Video
    mutate: () => void
}

const Sidebar: FC<ISidebarProps> = ({ video, mutate }): JSX.Element => {
    const [likes, setLikes] = useState(0)
    const [bookmarks, setBookmarks] = useState(0)
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        const audioElement = document.getElementById("background-music") as HTMLAudioElement;
        if (audioElement) {
            audioElement.muted = !audioElement.muted;
            setIsMuted(audioElement.muted);
        }
    };





    const [clickedLikes, setClickedLikes] = useState(false)
    const [clickedBookmarks, setClickedBookmarks] = useState(false)

    const { videoId } = video

    useEffect(() => {
        if (video) {
            setLikes(getSocialResults(video, 'likes'))
            setBookmarks(getSocialResults(video, 'bookmarks'))
        }
    }, [video])

    const updateVideos = async (metadata: Array<Metadata>) => {
        await fetch(`/api/videos?method=patch`, {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId, metadata }),
        })
    }

    const onPressItem = async (metadata: Array<Metadata>, icon: string) => {
        icon === 'MdFavorite' && setClickedLikes(true)
        icon === 'MdOutlineBookmark' && setClickedBookmarks(true)

        await updateVideos(metadata)

        mutate()
    }

    return (
        <div className={styles.sidebar}>
            <a href="https://github.com/FlowyMe/flowtok" target={'_blank'} rel="noreferrer">
                <Image src={Logo} width={40} height={40} />
            </a>
            <div
                className={styles.sidebar__button}
                onClick={() =>
                    !clickedLikes &&
                    onPressItem(
                        [
                            { key: 'likes', value: `${likes + 1}` },
                            { key: 'bookmarks', value: `${bookmarks}` },
                        ],
                        'MdFavorite'
                    )
                }
            >
                <MdFavorite
                    size={40}
                    color={clickedLikes ? '#D65076' : '#fff'}
                    className={clickedLikes ? 'animate__animated animate__heartBeat' : ''}
                />
                <p>{likes}</p>
            </div>
            <div
                className={styles.sidebar__button}
                onClick={() =>
                    !clickedBookmarks &&
                    onPressItem(
                        [
                            { key: 'likes', value: `${likes}` },
                            { key: 'bookmarks', value: `${bookmarks + 1}` },
                        ],
                        'MdOutlineBookmark'
                    )
                }
            >
                <MdOutlineBookmark
                    size={40}
                    color={clickedBookmarks ? '#FCD354' : '#FFFFFF'}
                    className={clickedBookmarks ? 'animate__animated animate__heartBeat' : ''}
                />
                <p>{bookmarks}</p>
            </div>
            <div className={styles.sidebar__button} onClick={toggleMute}>
                {isMuted ? <MdVolumeOff size={40} /> : <MdVolumeUp size={40} />}
            </div>



            <div className={styles.sidebar__button} onClick={onShare}>
                <RiShareForwardFill size={40} />
            </div>
        </div>
    )
}

export default Sidebar