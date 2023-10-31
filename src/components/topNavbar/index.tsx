import { useState } from 'react';

const TopNavbar = () => {
  const [activeTab, setActiveTab] = useState('forYou');

  const getTabStyle = (tab: string) => {
    if (activeTab === tab) {
      return "cursor-pointer p-2 text-xl  text-white pb-1 border-b-2 border-white";
    }
    return "cursor-pointer p-2 text-gray-400 pb-1";
  };

  return (
    // <div className="sticky top-0 z-50 bg-transparent">
        <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex justify-center items-center px-2 pb-2 pt-4">
        <div
          className={getTabStyle('following')}
          onClick={() => setActiveTab('workflow')}
        >
          Remix
        </div>
        <div
          className={getTabStyle('forYou')}
          onClick={() => setActiveTab('forYou')}
        >
         Inspire 
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
