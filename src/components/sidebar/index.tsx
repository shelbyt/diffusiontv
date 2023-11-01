import React, { FC } from 'react';
import { ShareFat, Heart, ChatCircleDots } from "@phosphor-icons/react";

interface ISidebarProps { }

const Sidebar: FC<ISidebarProps> = (): JSX.Element => {
    return (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-tranparent p-4 rounded-l-lg flex flex-col items-center space-y-4">
            <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content border border-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span>P</span>
                </div>
            </div>


            <label className="swap swap-rotate cursor-pointer">
                <input type="checkbox" />

                {/* Heart icon when not liked */}
                <Heart
                    size={30}
                    weight="fill"
                    className="swap-off text-white hover:text-red-500"
                />

                {/* Heart icon when liked */}
                <Heart
                    size={30}
                    weight="fill"
                    className="swap-on text-red-500"
                />
            </label>

            <ShareFat
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-blue-500 text-white"
            />

            <ChatCircleDots
                size={30}
                weight="fill"
                className="cursor-pointer hover:text-green-500 text-white"
            />

        </div>
    );
}

export default Sidebar;
