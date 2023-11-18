import React, { useState, FC, useEffect } from 'react';
import { ShareFat, Heart, BookmarkSimple, DotsThreeOutline, ArrowFatUp } from "@phosphor-icons/react";
import { IVideoData } from '../../pages/api/videos/feed';
import { useVideoFeed } from '../../state/VideoFeedProvider';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';

interface ISidebarProps { video: IVideoData }

interface EngagementRequestBody {
    userId: string;
    imageId: string;
    liked?: boolean;
    bookmarked?: boolean;
}


const Sidebar: FC<ISidebarProps> = ({ video }: ISidebarProps): JSX.Element => {
    const { drawerOpen, setDrawerOpen } = useVideoFeed();
    const [liked, setLiked] = useState(false);
    const [incresentLike, setIncreaseLike] = useState(false);
    const { user, isLoading, error } = useUser();
    const { userState, fetchUserData } = useUserUUID();
    const router = useRouter();
    const { handleLogin } = usePopup(); // Use the custom hook


    useEffect(() => {
        if (video) {
            setLiked(video?.data?.dbData?.engagement?.liked);
        }
    }, [])

    console.log("video = ", video)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLike = async () => {
        if (!userState?.isAuthenticated) {
            console.log("User needs to login")
            handleLogin(); // Use handleLogin from PopupContext


            // Redirect to the login page
            // router.push('/api/auth/login');
        } else {
            console.log("in else")
            console.log("userState = ", userState)
            console.log("video = ", video.id)
            // Perform the action since the user is already authenticated
            if (userState && userState.prismaUUID && video) {
                const data = toggleEngagement(userState.prismaUUID, video?.data?.dbData?.id, 'like', !liked);
                console.log('data = ', data)
                if (!liked) {
                    setIncreaseLike(true);
                }
                else {
                    setIncreaseLike(false);
                }

                setLiked(!liked);
            } else {
                // Handle the case when userState.prismaUUID or video.id is null
            }
        }
    };

    React.useEffect(() => {
        console.log("userState = ", userState);
        if (userState?.isAuthenticated && !userState.prismaUUID) {
            fetchUserData(); // Fetch user data after successful login
        }
    }, [userState?.isAuthenticated, userState?.prismaUUID, fetchUserData]);


    // const handleLike = () => {
    //     console.log("User = ", userState)
    //     if(!userState?.isAuthenticated) {
    //         router.push('/api/auth/login');
    //         return
    //     }
    //     setLiked(!liked);
    // }


    async function toggleEngagement(userId: string, imageId: string, action: string, value: boolean) {
        try {
            let requestBody: EngagementRequestBody = {
                userId: userId,
                imageId: imageId,
            };

            // Add only the specified field to the request body
            if (action === 'like') {
                requestBody.liked = value;
            } else if (action === 'bookmark') {
                requestBody.bookmarked = value;
            } else {
                throw new Error('Invalid action');
            }

            const response = await fetch('/api/engagement/toggle', {
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
                console.log("xxx Engagement toggled successfully");
                setLiked(!liked);
            }


            const data = await response.json();
            console.log("xxx data is = ", data)
            return data;
        } catch (error) {
            console.error('Error toggling engagement:', error);
        }
    }



    return (
        <div className="fixed right-0 top-3/4 transform -translate-y-3/4 bg-tranparent p-4 rounded-l-lg flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-rotate cursor-pointer">
                    {/* <input type="checkbox" checked={liked} onChange={() => toggleEngagement(video?.data?.dbData?.user.id, video?.data?.dbData?.id, 'like', !liked)} /> */}
                    <input type="checkbox" checked={liked} onChange={handleLike} />

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
                    {video.data.dbData ? (video?.data?.dbData?.likeCount + incresentLike) : 0}
                </div>
            </div>

            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-flip cursor-pointer">
                    <input type="checkbox" />

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
                <div className="text-xs text-white"> {/* Adjust text size here */}
                    0 {/* Replace with your state variable or logic */}
                </div>
            </div>
            <ShareFat
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-blue-500 text-white"
                stroke='black'
                strokeWidth={15}
            />
            <DotsThreeOutline
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
