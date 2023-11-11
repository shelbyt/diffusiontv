import React, { FC } from 'react';
import { ShareFat, Heart, BookmarkSimple, Warning } from "@phosphor-icons/react";
import { IVideoData } from '../../pages/api/videos';
import { useRouter } from 'next/router';
import { handleNavigationAway } from '../../state/localStorageHelpers';
import { useVideoFeed } from '../../state/VideoFeedProvider';


interface ISidebarProps { video: IVideoData }

const Sidebar: FC<ISidebarProps> = ({ video }: ISidebarProps): JSX.Element => {
    const router = useRouter();
    const {drawerOpen, setDrawerOpen} = useVideoFeed();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-tranparent p-4 rounded-l-lg flex flex-col items-center space-y-4">
            <div className="avatar" onClick={() => {
                handleNavigationAway();
                router.push('/u/' + video.data.dbData.username, undefined, { shallow: true })
            }
            }>
                <div className="bg-neutral-focus text-neutral-content border border-black rounded-full w-12 h-12 flex items-center justify-center">
                    <img src={video.data.dbData.user?.imageUrl || "https://site-icons.media-storage.us-west.qencode.com/civ.png"} />
                </div>
            </div>

            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-rotate cursor-pointer">
                    <input type="checkbox" />

                    {/* Heart icon when not liked */}
                    <Heart
                        size={30}
                        weight="fill"
                        stroke='black'
                        strokeWidth={15}
                        className="swap-off text-white hover:text-red-500"
                    />

                    {/* Heart icon when liked */}
                    <Heart
                        size={30}
                        weight="fill"
                        className="swap-on text-yellow-500"
                        stroke='black'
                        strokeWidth={15}
                    />
                </label>

                {/* Displaying the number of hearts */}
                <div className="text-xs text-white"> {/* Adjust text size here */}
                    100 {/* Replace with your state variable or logic */}
                </div>
            </div>

            <div className="flex flex-col items-center space-y-1"> {/* Adjust vertical spacing here */}
                <label className="swap swap-rotate cursor-pointer">
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
                    100 {/* Replace with your state variable or logic */}
                </div>
            </div>


            <ShareFat
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-blue-500 text-white"
                stroke='black'
                strokeWidth={15}
            />
            <Warning
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
