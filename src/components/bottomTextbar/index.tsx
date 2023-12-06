import React, { useState, FC } from 'react';
import { useRouter } from 'next/router';
import { handleNavigationAway } from '../../state/localStorageHelpers';
import { withTracking } from '../../utils/mixpanel';

interface BottomTextProps {
    username: string;
    image: string; // URL of the user's avatar
    meta: string;
}

const BottomText: FC<BottomTextProps> = ({ username, image, meta }) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const charLimit = 145; // Set your character limit for truncation

    let metaData;
    try {
        // Attempt to parse meta as JSON
        metaData = typeof meta === 'string' ? JSON.parse(meta) : meta;
    } catch (error) {
        console.error("Error parsing meta data:", error);
        // Fallback if parsing fails
        metaData = {};
    }

    const isTruncated = metaData?.prompt && metaData.prompt.length > charLimit;

    const toggleExpanded = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsExpanded(!isExpanded);
        e.stopPropagation();
    };

    const handlePressDown = () => {
        setIsPressed(true);
    };

    const handlePressUp = () => {
        setIsPressed(false);
    };

    const handlePressUsername = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleNavigationAway();
        e.stopPropagation();
        router.push('/u/' + username, undefined, { shallow: true })
    };

    return (
        <div className="absolute bottom-0 left-0 flex flex-col items-start text-white p-2 mb-24 ml-4">
            {/* Avatar and Username in a Row */}
            <div
                className={`flex items-center mb-2 ${isPressed ? 'opacity-50' : 'opacity-100'}`}
                onMouseDown={handlePressDown}
                onMouseUp={handlePressUp}
                onTouchStart={handlePressDown}
                onTouchEnd={handlePressUp}
                onClick={withTracking(handlePressUsername, 'bottomTextbar: username')}
            >
                <div className="avatar mr-2" >
                    <div className="bg-neutral-focus text-neutral-content border border-black rounded-full w-8 h-8 flex items-center justify-center">
                        <img src={image || "https://default-avatar-placeholder.png"} alt="User avatar" />
                    </div>
                </div>

                <div>{username}</div>
            </div>
            <div className={`${isExpanded ? 'bg-neutral bg-opacity-80 rounded' : (isTruncated ? 'line-clamp-3 text-base-200' : 'text-base-200')} max-w-xs overflow-hidden text-sm`}>
                {metaData?.prompt}
            </div>

            {/* "See More" Button */}
            {isTruncated && (
                <button
                    onClick={
                        withTracking(toggleExpanded, 'bottomTextbar: seeMore')
                    }
                    className="text-xs mt-2">
                    {isExpanded ? 'See Less' : 'See More'}
                </button>
            )}


            {/* Displaying resource names */}
            <div className="mt-2">
                {metaData?.resources?.map((resource: any, index: number) => (
                    <div key={index}> #{resource?.name}</div>
                ))}
            </div>

        </div>
    );

};

export default BottomText;
