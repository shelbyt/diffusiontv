// pages/profile.js
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { useRouter } from 'next/router';
import { BookmarkSimple, ArrowLeft, ShareFat, Heart, UserList } from '@phosphor-icons/react';
// import useUserUUID from '../../hooks/useUserUUID';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { getPrivateUserData } from '../../utils/getPrivateUserData';
import InfiniteImageScroll from '../../components/infiniteImageScroll'; // Adjust the path as per your project structure
import { IUserThumb } from "../../types/index";
import AppLink from '../../components/appLink';

export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
    id: string
}

export default function Profile({ userDetails }: { userDetails: IUserDetails }) {
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();

    const fetchMoreData = async () => {
        if (!hasMore) return; // Exit if no more data to load

        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/api/private/getLikes?method=get&user=${userDetails.id}&page=${nextPage}`);
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

    const fetchMoreDataBM = async () => {
        if (!hasMoreBM) return; // Exit if no more data to load

        try {
            const nextPage = currentPageBM + 1;
            const res = await fetch(`/api/private/getBookmarks?method=get&user=${userDetails.id}&page=${nextPage}`);
            const newThumbs = await res.json();

            if (newThumbs.userThumbLinks.length > 0) {
                setUserThumbsBM(prevThumbs => [...prevThumbs, ...newThumbs.userThumbLinks]);
                setCurrentPageBM(nextPage);
            } else {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.error("Error fetching more thumbnails:", error);
            setHasMoreBM(false); // Stop trying after an error
        }
    };


    const fetchMoreDataF = async () => {
        if (!hasMoreF) return; // Exit if no more data to load

        try {
            const nextPage = currentPageF + 1;
            const res = await fetch(`/api/private/getFollowing?method=get&user=${userDetails.id}&page=${nextPage}`);
            const newThumbs = await res.json();
            if (newThumbs.length > 0) {
                setUserThumbsF(prevThumbs => [...prevThumbs, ...newThumbs]);
                setCurrentPageF(nextPage);
            } else {
                setHasMoreF(false); // No more data to load
            }
        } catch (error) {
            console.error("Error fetching more thumbnails:", error);
            setHasMoreF(false); // Stop trying after an error
        }
    };

    useEffect(() => {
        // if (!user) return; // Exit early if username is not available
        // fetchUserData();
        fetchMoreData();
    }, [userDetails]);

    const [userThumbs, setUserThumbs] = useState<IUserThumb[]>([]);
    const [hasMore, setHasMore] = useState(true);


    const [currentPageBM, setCurrentPageBM] = useState(0);
    const [userThumbsBM, setUserThumbsBM] = useState<IUserThumb[]>([]);
    const [hasMoreBM, setHasMoreBM] = useState(true);


    const [currentPageF, setCurrentPageF] = useState(0);
    const [userThumbsF, setUserThumbsF] = useState<any[]>([]);
    const [hasMoreF, setHasMoreF] = useState(true);

    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };
    const [activeTab, setActiveTab] = useState('likes'); // State to track active tab

    // Function to change the active tab
    const handleTabChange = (tab: string) => {
        if (tab === 'bookmarks' && userThumbsBM.length === 0) {
            fetchMoreDataBM();
        }
        if (tab === 'following' && userThumbsF.length === 0) {
            fetchMoreDataF();
        }

        setActiveTab(tab);
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

            {/* Tabs for Likes and Bookmarks */}
            <div className="flex justify-end">
                <div className="tabs">
                    <a className={`tab ${activeTab === 'following' ? 'tab-active text-black' : ''}`} onClick={() => handleTabChange('following')}>
                        <UserList size={24} /> Following
                    </a>
                    <a className={`tab ${activeTab === 'likes' ? 'tab-active text-black' : ''}`} onClick={() => handleTabChange('likes')}>
                        <Heart size={24} /> Likes
                    </a>
                    <a className={`tab ${activeTab === 'bookmarks' ? 'tab-active text-black' : ''}`} onClick={() => handleTabChange('bookmarks')}>
                        <BookmarkSimple size={24} /> Bookmarks
                    </a>
                </div>
            </div>


            {/* Conditional rendering of Infinite Scroll components */}
            {activeTab === 'likes' && (

                <InfiniteImageScroll
                    initialImages={userThumbs}
                    fetchMoreData={fetchMoreData}
                    hasMore={hasMore}
                />
            )}
            {activeTab === 'bookmarks' && (

                <InfiniteImageScroll
                    initialImages={userThumbsBM}
                    fetchMoreData={fetchMoreDataBM}
                    hasMore={hasMoreBM}
                />
            )}

            {activeTab === 'following' && (
                <div className="flex flex-col space-y-4 items-start ml-auto mr-auto w-3/4 mt-4">
                    {userThumbsF.map((user: any) => (
                        <div key={user.username} className="flex items-center cursor-pointer" onClick={() => router.push(`/u/${user.username}`)}>
                            <img src={user.imageUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                            <AppLink className='ml-2' link={`/u/${user.username}`} displayText={user.username} />
                            {/* <span className="ml-2">{user.username}</span> */}
                        </div>
                    ))}
                </div>
            )}



        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context.req, context.res);

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/api/auth/login', // Redirect to the login page
                permanent: false,
            },
        };
    }

    const userData = await getPrivateUserData(session.user.sub);

    return {
        props: {
            userDetails: userData,
        },
    };
};
