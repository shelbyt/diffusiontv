import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '../../utils/formatNumber';
import { GetServerSidePropsContext } from 'next';

// This function runs on the server for each request
export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch user details like name, likes, and followers count
    const userDetails = await fetchUserData(context?.params?.user as string);
    return {
        props: {
            userDetails, // Passed to the page component as props
        },
    };
}

async function fetchUserData(userId: string) {
    const res = await fetch(`${process.env.API_BASE_URL}/api/user/getUserProfile?method=get&user=${userId}`);
    if (!res.ok) {
        throw new Error('Failed to fetch user details');
    }
    const data = await res.json();
    return data;
}

export interface IUserDetails {
    username: string
    imageUrl: string
    likeCount: number
    videosMade: number
}



export default function User({ userDetails }: { userDetails: IUserDetails }) {
    console.log("user data = ", userDetails)

    useEffect(() => {

        async function fetchUserThumbs() {
            const res = await fetch(`/api/user/getUserVideoThumbs?method=get&user=${userDetails.username}`);
            const data = await res.json()
            setUserThumbs(data)
        }
        fetchUserThumbs();
    }, [])


    const [userThumbs, setUserThumbs] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (image: string) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div className="relative h-screen w-full bg-gray-100">
            {/* Background image */}
            <div className="relative top-0 left-0 h-1/3 w-full overflow-hidden z-0">
                <Image
                    src="/bg/bg1.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    alt="Background"
                />
            </div>
            {/* Profile card */}
            <div className="absolute top-15 left-0 right-0 mx-auto w-11/12 p-1 bg-base-100 shadow-xl rounded-box z-10">
                {/* User icon and name */}
                <div className="avatar placeholder absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                        <img src={userDetails.imageUrl} />
                    </div>
                </div>
                <div className="card-body items-center text-center pt-10">
                    <h2 className="card-title">{userDetails.username}</h2>
                    {/* User stats, displayed side by side with spacing */}
                    <div className="flex justify-between px-8"> {/* px-4 is added here for padding inside the container */}
                        <div className="flex-1 text-center px-8"> {/* px-2 is added for spacing between stat items */}
                            <div className="stat-value">{formatNumber(userDetails.likeCount)}</div>
                            <div className="stat-title">Likes</div>
                        </div>
                        <div className="flex-1 text-center px-8"> {/* Same spacing applied here */}
                            <div className="stat-value">{formatNumber(userDetails.videosMade)}</div>
                            <div className="stat-title">Creations</div>
                        </div>
                    </div>
                    {/* Follow button */}
                    <div className="card-actions justify-center mt-4">
                        <button className="btn btn-primary">Follow</button>
                    </div>
                </div>
            </div>
            {/* Images section */}

            <div className="mt-24 px-5">
                <div className="columns-2 gap-4 overflow-hidden">
                    {userThumbs.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            className="mb-4 w-full object-cover rounded-lg shadow-lg cursor-pointer"
                            style={{ breakInside: 'avoid' }}
                            onClick={() => openModal(image)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal with transition */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeModal}
            // You might want to manage the visibility of the modal here with conditional rendering as well
            >
                <img
                    src={selectedImage}
                    className="max-h-full max-w-full w-auto h-auto object-contain p-4 transition duration-300 rounded-3xl ease-in-out"
                    onClick={(e) => e.stopPropagation()} // Prevent click inside from closing the modal
                />
            </div>



        </div>
    );
}
