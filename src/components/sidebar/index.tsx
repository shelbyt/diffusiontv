import React, { useState, FC, useEffect } from 'react';
import { Warning, BookmarkSimple, ArrowFatUp, ShareFat } from "@phosphor-icons/react";
import { useVideoFeed } from '../../state/VideoFeedProvider';
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';
import { formatNumber } from '../../utils/formatNumber';
import { setPendingAction } from '../../state/localStorageHelpers';
import { withTracking } from '../../utils/mixpanel';
import { onShare } from '../../utils/share';


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
    const { userState, fetchUserData } = useUserUUID();
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
                setIsLiked(data.liked);
                setIsBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error('Error toggling engagement:', error);
        }
    }

    useEffect(() => {
        if (viewer && viewer !== 'unauth') {
            getEngagementInfo(viewer, video?.data?.dbData?.id);
        }
    }, [viewer])


    const toggleDrawer = (e: React.MouseEvent<SVGSVGElement>) => {
        setDrawerOpen(!drawerOpen);
        e.stopPropagation();
    };

    const toggleShare = (e: React.MouseEvent<SVGSVGElement>) => {
        onShare();
        e.stopPropagation();
    };

    React.useEffect(() => {
        if (userState?.isAuthenticated && !userState.prismaUUID) {
            fetchUserData(); // Fetch user data after successful login
        }
    }, [userState?.isAuthenticated, userState?.prismaUUID, fetchUserData]);

    const handleBookmark = async () => {
        if (!userState?.isAuthenticated) {
            setPendingAction('bookmark', video?.data?.dbData?.id);
            handleLogin(); // Use handleLogin from PopupContext

        } else {

            if (viewer && video) {

                if (isBookmarked) {
                    setIsBookmarked(false);
                }
                if (!isBookmarked) {
                    setIsBookmarked(true);
                }
                setIsBookmarked(!isBookmarked);
                const data = await toggleBookmark(viewer, video?.data?.dbData?.id);

                if (data.isBookmarked) {
                    setIsBookmarked(true);
                }
                else if (!data.isBookmarked) {
                    setIsBookmarked(false);
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
            setPendingAction('like', video?.data?.dbData?.id);
            handleLogin(); // Use handleLogin from PopupContext

        } else {

            if (viewer && video) {

                if (isLiked) {
                    setIsLiked(false);
                }
                if (!isLiked) {
                    setIsLiked(true);
                }
                setIsLiked(!isLiked);

                const data = await toggleLike(viewer, video?.data?.dbData?.id);
                if (data.isLiked) {
                    setIsLiked(true);
                }
                if (!data.isLiked) {
                    setIsLiked(false);
                }
            } else {
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
                    <input type="checkbox" checked={isLiked} onChange={withTracking(handleLike, "sidebar: liked")}
                        onClick={(e) => e.stopPropagation()} />

                    {/* <input type="checkbox" checked={video.data.dbData ? video?.data?.dbData?.engagement?.liked : false} onChange={handleLike} /> */}


                    {/* Heart icon when not liked */}
                    <ArrowFatUp
                        size={30}
                        weight="fill"
                        stroke='black'
                        strokeWidth={15}
                        className="swap-off text-white hover:text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />

                    {/* Heart icon when liked */}
                    <ArrowFatUp
                        size={30}
                        weight="fill"
                        className="swap-on text-orange-500"
                        stroke='black'
                        strokeWidth={15}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </label>

                {/* Displaying the number of hearts */}
                <div className="text-xs text-white"> {/* Adjust text size here */}
                    {Math.max(0, Number(formatNumber(video?.data?.dbData?.likeHeartEngageCount || 0)) + (isLiked ? 1 : 0))}
                </div>
            </div>

            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-flip cursor-pointer">
                    <input type="checkbox" checked={isBookmarked} onChange={withTracking(handleBookmark, "sidebar: bookmarked")} //handleBookmark}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}

                    />

                    {/* Heart icon when not liked */}
                    <BookmarkSimple
                        size={30}
                        weight="fill"
                        stroke='black'
                        strokeWidth={15}
                        className="swap-off text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />

                    {/* Heart icon when liked */}
                    <BookmarkSimple
                        size={30}
                        weight="fill"
                        className="swap-on text-green-500"
                        stroke='black'
                        strokeWidth={15}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </label>
                {/* Displaying the number of hearts */}
                <div className="text-xs text-white">
                    {Math.max(0, Number(formatNumber(video?.data?.dbData?.bookmark || 0)) + (isBookmarked ? 1 : 0))}

                </div>
            </div>

            <ShareFat
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-green-500 text-white"
                stroke='black'
                strokeWidth={15}
                onClick={withTracking(toggleShare, "sidebar: share opened")}
            />
            <Warning
                size={20}
                weight="fill"
                className="cursor-pointer hover:text-red-500 text-white"
                stroke='black'
                strokeWidth={15}
                onClick={withTracking(toggleDrawer, "sidebar: report opened")}
            />

        </div>
    );
}

export default Sidebar;
