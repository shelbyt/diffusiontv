// pages/api/u/[user].ts
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { useRouter } from 'next/router';
import { ArrowLeft, ShareFat, Heart, Calendar } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import { getUserData } from '../../utils/getUserData';
import VideoModal from './../../components/videoModal/index';
import InfiniteScroll from 'react-infinite-scroll-component';


export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
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
    const router = useRouter();
    const { user } = router.query;
    const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (!userDetails) return; // Exit early if userDetails is not available

        fetchMoreData(); // Fetch the first page of data on initial load
    }, [userDetails]);

    const fetchMoreData = async () => {
        if (!hasMore) return; // Exit if no more data to load

        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/api/thumbs/getUserVideoThumbs?method=get&user=${userDetails?.username}&page=${nextPage}`);
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

    useEffect(() => {
        async function fetchUserData() {
            if (!user) return;
            try {
                setIsLoading(true);
                const res = await fetch(`/api/user/${user}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await res.json();
                setUserDetails(userData);
            } catch (error) {
                // handle error
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();
    }, [user]);


    const [userThumbs, setUserThumbs] = useState<IUserThumb[]>([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const openModal = (index: number) => {
        setActiveVideoIndex((index));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage("");
        setIsModalOpen(false);
    };

    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const [sortBy, setSortBy] = useState('date');

    const toggleSort = () => {
        setSortBy(sortBy === 'popular' ? 'date' : 'popular');
    };

    const sortedThumbs = sortBy === 'popular'
        ? [...userThumbs].sort((a, b) => b.likeCount - a.likeCount)
        : [...userThumbs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    return (
        <>
            {/* Top Navbar with Phosphor Icons */}
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
                {!userDetails ? (
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
                                <Image src={userDetails.imageUrl || '/'} alt="User Avatar" width={96} height={96} layout="fixed" />
                            </div>
                        </div>
                        <h2 className="text-base font-bold my-2">{userDetails.username}</h2>
                    </>
                )}
            </div>

            <div className="flex justify-around text-center mb-8">
                <div>
                    <div className="text-base font-semibold">{0}</div>
                    <div className="text-xs text-gray-600">Followers</div>
                </div>
                <div>
                    <div className="text-base font-semibold">{formatNumber(userDetails?.videosMade || 0)}</div>
                    <div className="text-xs text-gray-600">Videos</div>
                </div>
                <div>
                    <div className="text-base font-semibold">{formatNumber(userDetails?.likeCount || 0)}</div>
                    <div className="text-xs text-gray-600">Likes</div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 mx-2">
                {/* Container for centering the Follow Button */}
                <div className="flex-grow flex justify-center">
                    <button className="btn btn-primary w-32">Follow</button>
                </div>
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
                                    <div className="badge badge-primary absolute top-2 left-2">
                                        Popular
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
            <VideoModal
                url={sortedThumbs[activeVideoIndex]?.videoUrl}
                isOpen={isModalOpen}
                closeModal={closeModal}
            />
        </>
    )
}
