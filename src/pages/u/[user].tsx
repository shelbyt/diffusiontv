import Image from 'next/image';

export default function User() {
    return (
        <div className="relative h-screen w-full bg-gray-100">
            {/* Background image */}
            <div className="absolute top-0 left-0 h-1/2 w-full overflow-hidden z-0">
                <Image
                    src="/bg/bg1.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    alt="Background"
                />
            </div>
            {/* Profile card */}
            <div className="absolute top-1/4 left-0 right-0 mx-auto w-11/12 p-5 bg-base-100 shadow-xl rounded-box z-10">
                {/* User icon and name */}
                <div className="avatar placeholder absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                        <span className="text-3xl">U</span> {/* Placeholder for User Icon */}
                    </div>
                </div>
                <div className="card-body items-center text-center pt-12">
                    <h2 className="card-title">User Name</h2>
                    {/* User stats, displayed side by side with spacing */}
                    <div className="flex justify-between px-8"> {/* px-4 is added here for padding inside the container */}
                        <div className="flex-1 text-center px-8"> {/* px-2 is added for spacing between stat items */}
                            <div className="stat-value">123</div>
                            <div className="stat-title">Followers</div>
                        </div>
                        <div className="flex-1 text-center px-8"> {/* Same spacing applied here */}
                            <div className="stat-value">456</div>
                            <div className="stat-title">Following</div>
                        </div>
                    </div>
                    {/* Follow button */}
                    <div className="card-actions justify-center mt-4">
                        <button className="btn btn-primary">Follow</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
