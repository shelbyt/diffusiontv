// VideoModal.tsx
import React from 'react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  url: string;
  isOpen: boolean;
  closeModal: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ url, isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10 }}
        onClick={closeModal}
      >
        <ReactPlayer
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          url={url}
          playing={true}
          width="100%"
          height="100%"
          loop={true}
          playsinline={true}
        />
      </div>
    </div>
  );
};

export default VideoModal;
