import { ShareFat, Heart, SpeakerSimpleHigh, SpeakerSimpleSlash, ChatCircleDots } from "@phosphor-icons/react";
import { FC, useEffect, useState } from 'react'
import { onShare } from '../../utils/share'
import Video from '@api.video/nodejs-client/lib/model/Video'
import 'animate.css'
import Metadata from '@api.video/nodejs-client/lib/model/Metadata'
import { useRouter } from "next/router";

export interface ISidebarProps {
    video: Video
    mutate: () => void
}

const Sidebar: FC<ISidebarProps> = ({ video, mutate }): JSX.Element => {
    const [likes, setLikes] = useState(0)
    const [bookmarks, setBookmarks] = useState(0)
    const [isMuted, setIsMuted] = useState(true);

    const router = useRouter()

    const goToUserProfile = () => {
        router.push(`/u/${videoMeta.meta.username}`)
    }

    //TODO: Ineffeicnet, creating a clone so i dont have to deal with typescript
    const videoMeta: any = video;


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

    //TODO: Validation and Types on videoMeta.
    useEffect(() => {
        if (video) {
            // setLikes(getSocialResults(video, 'likes'))
            setLikes(videoMeta.meta.heartCount)
            setBookmarks(videoMeta.meta.commentCount)
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
        icon === 'ChatCircleDots' && setClickedBookmarks(true)

        await updateVideos(metadata)

        mutate()
    }

    return (
        <div className="absolute top-1/2 right-2.5 text-white flex flex-col space-y-5">
                <div className="avatar relative">
                    <div className="w-20 mask mask-hexagon">
                        <img src={videoMeta.meta.user.imageUrl} alt="User avatar" onClick={goToUserProfile} />
                    </div>
                    <div className="absolute bottom-0 left-1/2 bg-red-600 rounded-full p-1 transform -translate-x-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </div>
            <div
                className="flex flex-col items-center"
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
                <Heart
                    size={30}
                    color={clickedLikes ? '#D65076' : '#fff'}
                    className={clickedLikes ? 'animate__animated animate__heartBeat' : ''}
                    weight="fill"
                />
                <p>{likes}</p>
            </div>
            <a href={`https://civitai.com/images/${videoMeta.meta.remoteId}`} target="_blank" rel="noopener noreferrer">
                <div
                    className="flex flex-col items-center"
                    onClick={() =>
                        !clickedBookmarks &&
                        onPressItem(
                            [
                                { key: 'likes', value: `${likes}` },
                                { key: 'bookmarks', value: `${bookmarks + 1}` },
                            ],
                            'ChatCircleDots'
                        )
                    }
                >
                    <ChatCircleDots
                        weight="fill"
                        size={30}
                        color={'#FFFFFF'}
                    // color={clickedBookmarks ? '#FCD354' : '#FFFFFF'}
                    // className={clickedBookmarks ? 'animate__animated animate__heartBeat' : ''}
                    />
                    <p>{bookmarks}</p>
                </div>
            </a>
            <div className="flex flex-col items-center pb-4" onClick={toggleMute}>
                {isMuted ? <SpeakerSimpleSlash size={30} weight='fill' /> : <SpeakerSimpleHigh size={40} weight='fill' />}
            </div>
            <div className="flex flex-col items-center" onClick={onShare}>
                <ShareFat size={30} color="#fff" weight="fill" />
            </div>
        </div>
    )
}

export default Sidebar
