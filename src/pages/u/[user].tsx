import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { ArrowLeft, ShareFat } from '@phosphor-icons/react';
import Error from 'next/error';

export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
}

export default function User() {
    const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const { user } = router.query
    console.log('username xxx ', user)

    const SkeletonLoader = ({ className }: { className: string }) => (
        <div className={`animate-pulse ${className} bg-gray-300 rounded`}></div>
    );

    useEffect(() => {
        console.log("username = ", user)
        if (!user) return; // Exit early if username is not available
        async function fetchUserData() {
            try {
                const res = await fetch(`/api/user/getUserProfile?method=get&user=${user}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await res.json();
                console.log("data = ", data)
                setUserDetails(data);
                setIsLoading(false);
            } catch (error : Error) {
                setError(error.message);
            }
        }
        async function fetchUserThumbs() {
            try {
                const res = await fetch(`/api/user/getUserVideoThumbs?method=get&user=${user}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch user thumbnails');
                }
                const thumbs = await res.json();
                setUserThumbs(thumbs);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchUserData();
        fetchUserThumbs();
    }, [user]);

    const [userThumbs, setUserThumbs] = useState([]);
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

            <div className="flex justify-center mb-4">
                <button className="btn btn-primary btn-wide">Follow</button>
            </div>

            <div className="mt-4 px-5">
                <div className="columns-2 gap-4 overflow-hidden">
                    {userThumbs.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            className="mb-4 w-full object-cover rounded-lg cursor-pointer"
                            style={{ breakInside: 'avoid' }}
                            onClick={() => openModal(image)}
                        />
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