import React, { createContext, useContext, useState, ReactNode } from 'react';
import TopAlert from '../components/topAlert';

interface AlertContextType {
  topAlert: { show: boolean; message: string; goButtonText?: string; goButtonUrl?: string };
  showTopAlert: (message: string, goButtonText?: string, goButtonUrl?: string) => void;
  hideTopAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [topAlert, setTopAlert] = useState<{ show: boolean; message: string; goButtonText?: string; goButtonUrl?: string }>({ show: false, message: '' });

  const showTopAlert = (message: string, goButtonText?: string, goButtonUrl?: string) => {
    setTopAlert({ show: true, message, goButtonText, goButtonUrl });
  };

  const hideTopAlert = () => setTopAlert({ show: false, message: '', goButtonText: undefined, goButtonUrl: undefined });

  return (
    <AlertContext.Provider value={{ topAlert, showTopAlert, hideTopAlert }}>
      {children}
      {topAlert.show && (
        <TopAlert
          message={topAlert.message}
          goButtonText={topAlert.goButtonText}
          goButtonUrl={topAlert.goButtonUrl}
          onClose={hideTopAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === null) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
