import { CSSProperties, useState } from 'react';

const TopNavbar = () => {
  const [activeTab, setActiveTab] = useState('forYou');

  const getTabStyle = (tab: string) => {
    if (activeTab === tab) {
      return "cursor-pointer p-2 text-lg font-bold text-white opacity-90 pb-1";
    }
    return "cursor-pointer p-2 text-gray-400 pb-1";
  };

  const getUnderlineStyle = (tab: string): CSSProperties => {
    if (activeTab === tab) {
      return {
        position: 'relative',
        display: 'inline-block'
      };
    }
    return {};
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex justify-center items-center px-2 pb-2 pt-4">
        <div
          className={getTabStyle('forYou')}
          style={getUnderlineStyle('forYou')}
          onClick={() => setActiveTab('forYou')}
        >
         Inspire 
         {activeTab === 'forYou' && 
           <div style={{
             content: '""',
             position: 'absolute',
             bottom: '0',
             left: '50%',
             transform: 'translateX(-50%)',
             height: '1px',
             width: '50%',
             backgroundColor: 'white'
           }}></div>
         }
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;