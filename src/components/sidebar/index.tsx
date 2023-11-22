import React, { useState, FC, useEffect } from 'react';
import { Warning, BookmarkSimple, ArrowFatUp } from "@phosphor-icons/react";
import { useVideoFeed } from '../../state/VideoFeedProvider';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';
import { formatNumber } from '../../utils/formatNumber';

interface ISidebarProps { video: any }

interface EngagementRequestBody {
    userId: string;
    imageId: string;
    liked?: boolean;
    bookmarked?: boolean;
}
interface ISidebarProps {
    video: any;
    viewer: string | undefined | null;
}



const Sidebar: FC<ISidebarProps> = ({ video, viewer }: ISidebarProps): JSX.Element => {
    const { drawerOpen, setDrawerOpen } = useVideoFeed();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [incrementBookmarked, setIncrementBookmarked] = useState(0);
    const [incrementLiked, setincrementLiked] = useState(0);
    const { user, isLoading, error } = useUser();
    const { userState, fetchUserData } = useUserUUID();
    const router = useRouter();
    const { handleLogin } = usePopup(); // Use the custom hook


    async function getEngagementInfo(userId: string, imageId: string) {
        try {
            const response = await fetch(`/api/engagement/getEngagementInfo?userId=${encodeURIComponent(userId)}&imageId=${encodeURIComponent(imageId)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 200) {
                const data = await response.json();
                console.log('get eng data = ', data);
                setIsLiked(data.liked);
                setIsBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error('Error toggling engagement:', error);
        }
    }

    useEffect(() => {
        if (viewer && viewer !== 'unauth') {
            console.log("calling get engagement with", viewer, video?.data?.dbData?.id);
            getEngagementInfo(viewer, video?.data?.dbData?.id);
        }
    }, [viewer])


    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    React.useEffect(() => {
        console.log("userState = ", userState);
        if (userState?.isAuthenticated && !userState.prismaUUID) {
            fetchUserData(); // Fetch user data after successful login
        }
    }, [userState?.isAuthenticated, userState?.prismaUUID, fetchUserData]);

    const handleBookmark = async () => {
        if (!userState?.isAuthenticated) {
            handleLogin(); // Use handleLogin from PopupContext

        } else {

            if (viewer && video) {

                if (isBookmarked) {
                    setIncrementBookmarked(-1);
                }
                if (!isBookmarked) {
                    setIncrementBookmarked(1);
                }
                setIsBookmarked(!isBookmarked);
                const data = await toggleBookmark(viewer, video?.data?.dbData?.id);

                if (data.isBookmarked) {
                    setIncrementBookmarked(1);
                }
                else if (!data.isBookmarked) {
                    setIncrementBookmarked(-1);
                }
            } else {
                // Handle the case when userState.prismaUUID or video.id is null
            }
        }
    };

    async function toggleBookmark(userId: string, imageId: string) {
        try {
            const requestBody: EngagementRequestBody = {
                userId: userId,
                imageId: imageId,
            };

            const response = await fetch('/api/engagement/toggleBookmark', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 200) {
                const data = await response.json();
                return data
            }
        } catch (error) {
            console.error('Error toggling engagement:', error);
        }
    }


    const handleLike = async () => {
        if (!userState?.isAuthenticated) {
            handleLogin(); // Use handleLogin from PopupContext

        } else {

            if (viewer && video) {

                if (isLiked) {
                    setincrementLiked(-1);
                }
                if (!isLiked) {
                    setincrementLiked(1);
                }
                setIsLiked(!isLiked);

                console.log(`passing in ${viewer} and ${video?.data?.dbData?.id}`)
                const data = await toggleLike(viewer, video?.data?.dbData?.id);
                console.log("data from is liked = ", data)

                if (data.isLiked) {
                    setincrementLiked(1);
                }
                if(!data.isLiked) {
                    setincrementLiked(-1);
                }
            } 
        else {
                // Handle the case when userState.prismaUUID or video.id is null
            }
        }
    };

    async function toggleLike(userId: string, imageId: string) {
        try {
            const requestBody: EngagementRequestBody = {
                userId: userId,
                imageId: imageId,
            };

            const response = await fetch('/api/engagement/toggleLike', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 200) {
                const data = await response.json();
                return data
            }
        } catch (error) {
            console.error('Error toggling engagement:', error);
        }
    }

    return (
        <div className="fixed right-0 top-3/4 transform -translate-y-3/4 bg-tranparent p-4 rounded-l-lg flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-rotate cursor-pointer">
                    {/* <input type="checkbox" checked={liked} onChange={() => toggleEngagement(video?.data?.dbData?.user.id, video?.data?.dbData?.id, 'like', !liked)} /> */}
                    <input type="checkbox" checked={isLiked} onChange={handleLike} />

                    {/* <input type="checkbox" checked={video.data.dbData ? video?.data?.dbData?.engagement?.liked : false} onChange={handleLike} /> */}


                    {/* Heart icon when not liked */}
                    <ArrowFatUp
                        size={30}
                        weight="fill"
                        stroke='black'
                        strokeWidth={15}
                        className="swap-off text-white hover:text-red-500"
                    />

                    {/* Heart icon when liked */}
                    <ArrowFatUp
                        size={30}
                        weight="fill"
                        className="swap-on text-orange-500"
                        stroke='black'
                        strokeWidth={15}
                    />
                </label>

                {/* Displaying the number of hearts */}
                <div className="text-xs text-white"> {/* Adjust text size here */}
                    {Math.max(0, Number(formatNumber(video?.data?.dbData?.likeHeartEngageCount || 0)) + incrementLiked)}
                </div>
            </div>

            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-flip cursor-pointer">
                    <input type="checkbox" checked={isBookmarked} onChange={handleBookmark} />

                    {/* Heart icon when not liked */}
                    <BookmarkSimple
                        size={30}
                        weight="fill"
                        stroke='black'
                        strokeWidth={15}
                        className="swap-off text-white"
                    />

                    {/* Heart icon when liked */}
                    <BookmarkSimple
                        size={30}
                        weight="fill"
                        className="swap-on text-green-500"
                        stroke='black'
                        strokeWidth={15}
                    />
                </label>
                {/* Displaying the number of hearts */}
                <div className="text-xs text-white">
                    {Math.max(0, Number(formatNumber(video?.data?.dbData?.book || 0)) + incrementBookmarked)}

                </div>
            </div>
            <Warning
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-red-500 text-white"
                stroke='black'
                strokeWidth={15}
                onClick={toggleDrawer} // Toggle drawer on click
            />

        </div>
    );
}

export default Sidebar;
