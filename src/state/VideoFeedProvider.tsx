import React, { createContext, useState, useContext, useEffect } from 'react';


export interface IVideoData {
    videoUrl: string;
    thumbUrl: string;
    index: number;
}

// Define the shape of your context state
interface VideoFeedContextState {
  videos: any[];
  currentPage: number;
  muted: boolean;
  isClient: boolean;
  activeVideoId: string | null;
  activeVideoData: IVideoData | undefined;
  isSwiping: boolean;
  firstPlay: boolean;
  buffered: boolean;
  drawerOpen: boolean;
  setVideos: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClient: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveVideoData: React.Dispatch<React.SetStateAction<IVideoData | undefined>>;
  setIsSwiping: React.Dispatch<React.SetStateAction<boolean>>;
  setFirstPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setBuffered: React.Dispatch<React.SetStateAction<boolean>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with default values
const VideoFeedContext = createContext<VideoFeedContextState | undefined>(undefined);

// Provider component that wraps your app and makes the context available to all components
export const VideoFeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [muted, setMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeVideoData, setActiveVideoData] = useState<IVideoData>();
  const [isSwiping, setIsSwiping] = useState(false);
  const [firstPlay, setFirstPlay] = useState(true);
  const [buffered, setBuffered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // The value that will be given to the context consumers
  const value = {
    videos,
    currentPage,
    muted,
    isClient,
    activeVideoId,
    activeVideoData,
    isSwiping,
    firstPlay,
    buffered,
    drawerOpen,
    setVideos,
    setCurrentPage,
    setMuted,
    setIsClient,
    setActiveVideoId,
    setActiveVideoData,
    setIsSwiping,
    setFirstPlay,
    setBuffered,
    setDrawerOpen
  };

  return <VideoFeedContext.Provider value={value}>{children}</VideoFeedContext.Provider>;
};

// Hook to use the video feed context
export const useVideoFeed = () => {
  const context = useContext(VideoFeedContext);
  if (!context) {
    throw new Error('useVideoFeed must be used within a VideoFeedProvider');
  }
  return context;
};
