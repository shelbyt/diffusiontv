// pages/api/u/[user].ts
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { useRouter } from 'next/router';
import { ArrowLeft, ShareFat, Heart, Calendar } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import { getUserData } from '../../utils/getUserData';


export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
}

interface IUserThumb {
    thumbUrl: string;
    likeCount: number;
    createdAt: Date;
}


// export default function User() {
export default function User({ userDetails }: { userDetails: IUserDetails }) {
    const router = useRouter();

    useEffect(() => {
        if (!userDetails) return; // Exit early if username is not available
        async function fetchUserThumbs() {
            try {
                const res = await fetch(`/api/thumbs/getUserVideoThumbs?method=get&user=${userDetails.username}`);
                if (!res.ok) {
                    //TODO: handle error
                    // throw new Error('Failed to fetch user thumbnails');
                }
                const thumbs = await res.json();
                console.log(thumbs)
                setUserThumbs(thumbs);
            } catch (error: unknown) {
                //TODO: Handle Error
                // setError(error.message);
            }
        }
        fetchUserThumbs();
    }, [userDetails]);

    const [userThumbs, setUserThumbs] = useState<IUserThumb[]>([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (image: string) => {
        setSelectedImage(image);
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
                    <div className="text-xs text-gray-600">Following</div>
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

                {/* Sort Toggle Button - Right Aligned */}
                <button className="btn btn-outline bg-neutral text-white" onClick={toggleSort}>
                    {sortBy === 'popular' ? <Calendar size={24} /> : <Heart size={24} />}
                </button>
            </div>


            <div className="mt-4 px-1">
                <div className="grid grid-cols-3 gap-1">
                    {sortedThumbs.map((image, index) => (
                        <div key={index} className="w-full h-48 overflow-hidden rounded-lg cursor-pointer relative">
                            <img
                                src={image?.thumbUrl}
                                className="w-full h-full object-cover"
                                onClick={() => openModal(image?.thumbUrl)}
                            />

                            {/* Overlay for Likes */}
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 flex items-center">
                                <Heart size={16} color="white" className="mr-2" />
                                <span>{image?.likeCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeModal}
            >
                <img
                    src={selectedImage}
                    className="max-h-full max-w-full w-auto h-auto object-contain p-4 transition duration-300 rounded-3xl ease-in-out"
                    onClick={(e) => e.stopPropagation()} // Prevent click inside from closing the modal
                />
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.params) {
        // Handle the case where params is undefined
        return {
            notFound: true,
        };
    }

    const user = context.params.user as string;
    const userData = await getUserData(user);

    if (!userData) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            },
        };
    }

    return {
        props: {
            userDetails: userData,
        },
    };
};
