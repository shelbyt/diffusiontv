// pages/api/u/[user].ts
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { useRouter } from 'next/router';
import { ArrowLeft, ShareFat, Heart, Palette } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import { getUserData } from '../../utils/getUserData';
import VideoModal from './../../components/videoModal/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import useUserUUID from '../../hooks/useUserUUID';
import TopAlert from '../../components/topAlert';
import { usePopup } from '../../state/PopupContext';
import { useAlert } from '../../state/AlertContext';
import AppLink from '../../components/appLink';
import App from 'next/app';
import Civitai from '../../icons/civitai';





export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
    id: string
    followers: number
}

interface IUserThumb {
    thumbUrl: string;
    videoUrl: string;
    likeCount: number;
    createdAt: Date;
}


const SkeletonLoader = () => {
    return (
        <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse"></div>
    );
};

// export default function User() {
export default function User() {
    const { showTopAlert } = useAlert();

    const router = useRouter();
    const { user } = router.query;
    const [profileUserDetails, setProfileUserDetails] = useState<IUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [increaseFollow, setIncreaseFollow] = useState<number>(0);
    const { userState } = useUserUUID();

    const { handleLogin } = usePopup(); // Use the custom hook

    useEffect(() => {
        console.log("user state = ", userState)

    }, [userState])

    useEffect(() => {
        if (!profileUserDetails) return; // Exit early if userDetails is not available

        fetchMoreData(); // Fetch the first page of data on initial load
    }, [profileUserDetails]);

    const fetchMoreData = async () => {
        if (!hasMore) return; // Exit if no more data to load

        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/api/thumbs/getUserVideoThumbs?method=get&user=${profileUserDetails?.username}&page=${nextPage}`);
            const newThumbs = await res.json();

            if (newThumbs.length > 0) {
                setUserThumbs(prevThumbs => [...prevThumbs, ...newThumbs]);
                setCurrentPage(nextPage);
            } else {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.error("Error fetching more thumbnails:", error);
            setHasMore(false); // Stop trying after an error
        }
    };

    // useEffect(() => {
    //     async function fetchUserData() {

    //             console.log(" in fetch user data userState", userState)
    //             console.log(" in fetch user data user", user)
    //         if (!user) return;
    //         try {
    //             setIsLoading(true);
    //             const res = await fetch(`/api/user/${user}?viewerId=${userState?.prismaUUID}`);
    //             if (!res.ok) {
    //                 throw new Error('Failed to fetch user data');
    //             }
    //             const userData = await res.json();
    //             console.log("user data = ", userData)
    //             setProfileUserDetails(userData);
    //             setIsFollowing(userData.isFollowedByViewer);
    //         } catch (error) {
    //             // handle error
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     fetchUserData();
    // }, [user]);

    const loadUserData = async () => {
        if (!user || !userState) return;
        try {
            setIsLoading(true);
            const res = await fetch(`/api/user/${user}`);
            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await res.json();
            console.log("profile user data = ", userData)
            setProfileUserDetails(userData);
            setIsFollowing(userData.isFollowedByViewer);
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle the error appropriately here
        } finally {
            setIsLoading(false);
        }
    };

    const getIsFollowing = async () => {
        if (!user || !userState) return;
        console.log("INSIDE GET IS FOLLOWIN")
        try {

            console.log("INSIDE TRY GET IS FOLLOWIN")
            const res = await fetch(`/api/isFollowing?followerId=${userState.prismaUUID}&followingId=${profileUserDetails?.id}`);
            const data = await res.json();
            console.log("data = ", data);
            setIsFollowing(data.isFollowing);

        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle the error appropriately here
        }
    }

    useEffect(() => {

        console.log(`user = ${user}, userState = ${userState?.prismaUUID}, profileUserDetails = ${profileUserDetails}`)
        if (user && !profileUserDetails) {
            console.log("calling loaduserdata")
            loadUserData();
        }
        if (user && userState?.prismaUUID) {
            console.log("calling getfollowing")
            getIsFollowing();

        }
    }, [user, userState?.prismaUUID, profileUserDetails]); // Added userState to dependency array





    const [userThumbs, setUserThumbs] = useState<IUserThumb[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    const openModal = (index: number) => {
        setActiveVideoIndex((index));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    async function toggleFollow(followerId: string | undefined, followingId: string | undefined) {
        console.log("toglefolow called", followerId, followingId)
        if (!followingId) return;
        if (!followerId) {
            handleLogin();
            return;
        }
        try {
            const requestBody = {
                followerId: followerId,
                followingId: followingId,
            };

            // Determine the appropriate method based on the current follow status
            // const method = isFollowing ? 'PATCH' : 'POST'; // Assuming 'isFollowing' is a state indicating current follow status
            // console.log("Method = ", method)
            if (isFollowing) {
                setIncreaseFollow(-1);
            }
            else {
                setIncreaseFollow(1);
            }

            const response = await fetch('/api/engagement/toggleFollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data = ", data)
            // Update local state to reflect the new follow status
            setIsFollowing(data.isFollowing); // Assuming 'setIsFollowing' updates the follow status in your component's state
            if (!isFollowing) {
                showTopAlert("Enjoying the app? Star DTV on Github!", "Go", "https://github.com/shelbyt/diffusiontv");
            }

            // showTopAlert(
            //     "Enjoying the app? Star DTV on Github!",
            //     "Go",
            //     "https://github.com/shelbyt/diffusiontv")
            return data;
        } catch (error) {

            setIncreaseFollow(0);
            console.error('Error toggling follow:', error);
        }
    }


    return (
        <>
            {/* {isFollowing && (
                <TopAlert
                    message="Enjoying the app? Star DTV on Github!"
                    goButtonText="Go"
                    goButtonUrl="https://github.com/shelbyt/diffusiontv"
                    // onClose={() => {
                    //     setIsFollowing(false);
                    // }}
                />

            )} */}
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <button className="btn btn-ghost" onClick={handleBackClick}>
                        <ArrowLeft size={24} />
                    </button>
                </div>
                <div className="flex-none">
                    <button className="btn btn-ghost">
                        <ShareFat size={24} />
                    </button>
                </div>
            </div>

            {/* User's Picture and Name */}
            <div className="flex flex-col items-center py-4">
                {!profileUserDetails ? (
                    <>
                        {/* Skeleton for the avatar */}
                        <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse" />
                        {/* Skeleton for the username */}
                        <div className="h-6 w-48 my-2 bg-gray-300 animate-pulse rounded" />
                    </>
                ) : (
                    <>
                        <div className="avatar">
                            <div className="w-24 rounded-full">
                                <Image src={profileUserDetails?.imageUrl || '/'} alt="User Avatar" width={96} height={96} layout="fixed" />
                            </div>
                        </div>
                        <h2 className="text-base font-bold my-2">{profileUserDetails?.username}</h2>
                    </>
                )}
            </div>
<div className="flex justify-around text-center mb-8">
    <div style={{ minWidth: '4rem' }}> {/* Set a minimum width */}
        <div className="text-base font-semibold">
            {Math.max(0, Number(formatNumber(profileUserDetails?.followers || 0)) + increaseFollow)}
        </div>
        <div className="text-xs text-gray-600">Followers</div>
    </div>
    <div style={{ minWidth: '4rem' }}> {/* Set a minimum width */}
        <div className="text-base font-semibold">
            {formatNumber(profileUserDetails?.videosMade || 0)}
        </div>
        <div className="text-xs text-gray-600">Videos</div>
    </div>
    <div style={{ minWidth: '4rem' }}> {/* Set a minimum width */}
        <div className="text-base font-semibold">
            {formatNumber(profileUserDetails?.likeCount || 0)}
        </div>
        <div className="text-xs text-gray-600">Likes</div>
    </div>
</div>

            <div className="flex justify-between items-center mb-4 mx-2">
                {/* Container for centering the Follow Button */}
                <div className="flex-grow flex justify-center">
                    <button className={(isFollowing || increaseFollow == 1) ? "btn btn-outline btn-primary w-32" : "btn btn-primary w-32"}
                        onClick={() => toggleFollow(userState?.prismaUUID || undefined, profileUserDetails?.id || undefined)} // Replace with actual IDs
                    >
                        {(isFollowing || increaseFollow == 1) ? 'Following' : 'Follow'}

                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center text-sm mb-4">
                <Civitai size={32} />
                <AppLink link={`https://civitai.com/user/${profileUserDetails?.username}`} displayText='Civitai' />
            </div>

            <InfiniteScroll
                dataLength={userThumbs.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }, (_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>}
            // ... other props
            >
                <div className="mt-4 px-1">
                    <div className="grid grid-cols-3 gap-1">
                        {userThumbs.map((image, index) => (
                            <div key={index} className="w-full h-48 overflow-hidden rounded-lg cursor-pointer relative transition-opacity duration-500">
                                <img
                                    src={image?.thumbUrl}
                                    className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                                    onClick={() => openModal(index)}
                                    onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
                                />
                                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 flex items-center">

                                    <Heart size={16} color="white" className="mr-2" />
                                    <span>{image?.likeCount}</span>
                                </div>
                                {/* Conditionally render 'Popular' badge for the first three images */}
                                {index < 3 && (
                                    <div className="badge badge-accent absolute top-2 left-2">
                                        Popular
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
            <VideoModal
                url={userThumbs[activeVideoIndex]?.videoUrl}
                isOpen={isModalOpen}
                closeModal={closeModal}
            />
        </>
    )
}
