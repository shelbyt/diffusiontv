import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ActiveTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const defaultState = {
  activeTab: 'inspire',
  setActiveTab: () => {}
};

export const ActiveTabContext = createContext<ActiveTabContextType>(defaultState);

interface ActiveTabProviderProps {
  children: ReactNode;
}

export const ActiveTabProvider: React.FC<ActiveTabProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('inspire');

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

// Custom hook for easier consumption of context
export const useActiveTab = () => useContext(ActiveTabContext);
