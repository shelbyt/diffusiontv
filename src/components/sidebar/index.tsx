import React, { FC } from 'react';
import { ShareFat, Heart, ChatCircleDots } from "@phosphor-icons/react";
import { IDbData, IVideoData } from '../../pages/api/videos';
import Router, { useRouter } from 'next/router';


interface ISidebarProps { video: IVideoData }

const Sidebar: FC<ISidebarProps> = ({ video }: ISidebarProps): JSX.Element => {
    const router = useRouter();
    return (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-tranparent p-4 rounded-l-lg flex flex-col items-center space-y-4">
            <div className="avatar" onClick={() => router.push('/u/'+video.data.dbData.username)}>
                <div className="bg-neutral-focus text-neutral-content border border-white rounded-full w-12 h-12 flex items-center justify-center">
                    <img src={video.data.dbData.user?.imageUrl || "https://site-icons.media-storage.us-west.qencode.com/civ.png"} />
                </div>
            </div>

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
                    className="swap-on text-red-500"
                    stroke='black'
                    strokeWidth={15}
                />
            </label>

            <ShareFat
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-blue-500 text-white"
                stroke='black'
                strokeWidth={15}
            />

            <ChatCircleDots
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-green-500 text-white"
                stroke='black'
                strokeWidth={15}


            />

        </div>
    );
}

export default Sidebar;
