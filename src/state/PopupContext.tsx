import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoginModal from '../components/login/loginPreview';

interface PopupContextProps {
  children: ReactNode;
}

interface PopupContextInterface {
  showLoginModal: boolean;
  handleLogin: () => void;
  handleCloseModal: () => void; // New method to close the modal
}

const PopupContext = createContext<PopupContextInterface | null>(null);

export const PopupProvider = ({ children }: PopupContextProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = () => {
   console.log("Opening login modal");

    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const contextValue = {
    showLoginModal,
    handleLogin,
    handleCloseModal // Include this in the context value
  };

  return (
    <PopupContext.Provider value={contextValue}>
      {children}
      <LoginModal />
    </PopupContext.Provider>
  );
}

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};