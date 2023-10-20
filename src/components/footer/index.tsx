import { RiMusic2Fill } from 'react-icons/ri';
import Marquee from 'react-fast-marquee';
import { FC } from 'react';
import Video from '@api.video/nodejs-client/lib/model/Video';

export interface ISidebarProps {
    video: Video;
}

const Footer: FC<ISidebarProps> = ({ video }): JSX.Element => {
    const usernames = ['savage_guru', 'operation_niki','cartoonmania21', 'sapphie_the_pomsky', 'nevaaadaa'];
    const randomIndex = Math.floor(Math.random() * usernames.length);
    
    return (
        <div className="relative text-white ml-2.5 flex bottom-[160px]">
            <div>
                <h3 className="mb-2.5">
                    <span className="text-[#fa5b30]">@ </span>{usernames[randomIndex]}
                </h3>
                <p className="mb-3.75">{video.title}</p>
                <div className="flex items-center">
                    <RiMusic2Fill size={16} color={'#e9e9e9'} />
                    <Marquee
                        gradient={false}
                        pauseOnHover={true}
                        speed={40}
                        style={{ maxWidth: '40%', marginLeft: '10px' }}
                    >
                        <p className="pl-2.5 text-[#e9e9e9]">Global Lofi Music</p>
                    </Marquee>
                </div>
            </div>
        </div>
    );
}
export default Footer;
