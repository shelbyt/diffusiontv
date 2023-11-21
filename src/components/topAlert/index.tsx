import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for redirection
import styles from './TopAlert.module.css';

interface TopAlertProps {
  message: string;
  onClose?: () => void;
  goButtonText?: string; // Optional "Go" button text
  goButtonUrl?: string; // Optional URL for the "Go" button
}

const TopAlert: React.FC<TopAlertProps> = ({ message, onClose, goButtonText, goButtonUrl }) => {
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 500);
  };

  // const handleGo = () => {
  //   if (goButtonUrl) {
  //     router.push(goButtonUrl);
  //   }
  //   handleClose();
  // }
  const handleGo = () => {
  if (goButtonUrl) {
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Diffusion TV Github', // Optional title
        url: goButtonUrl, // The URL to share
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      // Fallback for browsers that do not support the Web Share API
      router.push(goButtonUrl);
    }
  }
  handleClose();
};


  return (
    <div id="top-alert" className={`alert fixed inset-x-0 top-10 mx-auto transform transition-transform duration-500 ${isClosing ? styles.slideUp : styles.slideDown} flex items-center shadow-lg rounded-md`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6 mr-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span className="flex-grow text-sm">{message}</span>
      <button className="btn btn-sm" onClick={handleClose}>Close</button>
      {goButtonText && (
        <button className="btn btn-sm btn-primary mr-2" onClick={handleGo}>{goButtonText}</button>
      )}
    </div>
  );
};

export default TopAlert;

