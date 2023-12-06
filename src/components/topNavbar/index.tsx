import React from 'react';
import { useActiveTab } from '../../state/ActiveTabContext'; // Adjust the import path as necessary
import { withTracking } from '../../utils/mixpanel';

const TopNavbar: React.FC = () => {
  const { activeTab, setActiveTab } = useActiveTab();

  const getTabStyle = (tab: string): string => {
    return activeTab === tab
      ? "cursor-pointer p-2 text-lg font-bold text-white opacity-90 pb-1"
      : "cursor-pointer p-2 text-lg font-bold text-gray-400 pb-1";
  };

  const getUnderlineStyle = (tab: string): React.CSSProperties => {
    return activeTab === tab
      ? { position: 'relative', display: 'inline-block' }
      : {};
  };

  const handleSetActiveTabInspire = () => {
    setActiveTab('inspire');
  };

  const handleSetActiveTabLatest = () => {
    setActiveTab('latest');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex justify-center items-center px-2 pb-2 pt-4">
        <div
          className={getTabStyle('inspire')}
          style={getUnderlineStyle('inspire')}
          onClick={
            withTracking(handleSetActiveTabInspire, 'topNavBar: inspire')
          }
        >
          Inspire
          {activeTab === 'inspire' && (
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
          )}
        </div>
        <div
          className={getTabStyle('latest')}
          style={getUnderlineStyle('latest')}
          onClick={
            withTracking(handleSetActiveTabLatest, 'topNavBar: latest')
          }
        >
          Latest
          {activeTab === 'latest' && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
