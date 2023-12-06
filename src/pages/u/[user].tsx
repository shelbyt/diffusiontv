// pages/api/u/[user].ts
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { useRouter } from 'next/router';
import { ArrowLeft, ShareFat } from '@phosphor-icons/react';
import VideoModal from './../../components/videoModal/index';
import useUserUUID from '../../hooks/useUserUUID';
import { usePopup } from '../../state/PopupContext';
import AppLink from '../../components/appLink';
import Civitai from '../../icons/civitai';
import InfiniteImageScroll from '../../components/infiniteImageScroll'; // Adjust the path as per your project structure
import { IUserThumb } from '../../types';
import { withTracking } from '../../utils/mixpanel';
export interface IUserDetails {
    username: string
    imageUrl: string
    videosMade: number
    id: string
    followers: number
    totalLikeHeartEngageCount: number

}

export default function User() {
    const router = useRouter();
    const { user } = router.query;
    const [profileUserDetails, setProfileUserDetails] = useState<IUserDetails | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [increaseFollow, setIncreaseFollow] = useState<number>(0);
    const { userState } = useUserUUID();

    const { handleLogin } = usePopup(); // Use the custom hook

    useEffect(() => {
        if (!profileUserDetails) return; // Exit early if userDetails is not available

        fetchMoreData(); // Fetch the first page of data on initial load
    }, [profileUserDetails?.id]);

    const fetchMoreData = async () => {
        if (!hasMore) return; // Exit if no more data to load

        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/api/thumbs/getUserVideoThumbs?method=get&user=${profileUserDetails?.username}&page=${nextPage}`);
            const newThumbs = await res.json();

            if (newThumbs.userThumbLinks.length > 0) {
                setUserThumbs(prevThumbs => [...prevThumbs, ...newThumbs.userThumbLinks]);
                setCurrentPage(nextPage);
            } else {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.error("Error fetching more thumbnails:", error);
            setHasMore(false); // Stop trying after an error
        }
    };

    const loadUserData = async () => {
        if (!user || !userState) return;
        try {
            const res = await fetch(`/api/user/${user}`);
            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await res.json();
            setProfileUserDetails(userData);
            setIsFollowing(userData.isFollowedByViewer);
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle the error appropriately here
        }
    };

    const getIsFollowing = async () => {
        if (!user || !userState) return;
        try {

            const res = await fetch(`/api/isFollowing?followerId=${userState.prismaUUID}&followingId=${profileUserDetails?.id}`);
            const data = await res.json();
            setIsFollowing(data.isFollowing);

        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle the error appropriately here
        }
    }

    useEffect(() => {
        if (user && !profileUserDetails) {
            loadUserData();
        }
        if (user && userState?.prismaUUID) {
            getIsFollowing();

        }
    }, [user, userState?.prismaUUID, profileUserDetails]); // Added userState to dependency array

    const [userThumbs, setUserThumbs] = useState<IUserThumb[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

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
            // Update local state to reflect the new follow status
            setIsFollowing(data.isFollowing); // Assuming 'setIsFollowing' updates the follow status in your component's state
            return data;
        } catch (error) {

            setIncreaseFollow(0);
            console.error('Error toggling follow:', error);
        }
    }


    return (
        <>
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
                        {formatNumber(profileUserDetails?.totalLikeHeartEngageCount || 0)}
                    </div>
                    <div className="text-xs text-gray-600">Likes</div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 mx-2">
                {/* Container for centering the Follow Button */}
                <div className="flex-grow flex justify-center">
                    <button className={(isFollowing || increaseFollow == 1) ? "btn btn-outline btn-primary w-32" : "btn btn-primary w-32"}
                        onClick={withTracking(() => {
                            toggleFollow(userState?.prismaUUID || undefined, profileUserDetails?.id || undefined)
                        }, 'user: follow')}
                    >
                        {(isFollowing || increaseFollow == 1) ? 'Following' : 'Follow'}

                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center text-sm mb-4">
                <Civitai size={32} />
                <AppLink
                    link={`https://civitai.com/user/${profileUserDetails?.username}`}
                    displayText='Civitai Profile'
                    className="mr-4"
                />
            </div>

            <InfiniteImageScroll
                initialImages={userThumbs}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                highlightTop={true}
                trackingString={'user videos'}
            />
            <VideoModal
                url={userThumbs[activeVideoIndex]?.videoUrl}
                isOpen={isModalOpen}
                closeModal={closeModal}
            />
        </>
    )
}
