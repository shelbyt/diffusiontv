// context/UserContext.js

import React, { createContext, useState } from 'react';

type UserStateType = {
  isAuthenticated: boolean;
  prismaUUID: null;
  userInfo: null;
  isProcessing: boolean;
  error:boolean;
} | null;

export const UserContext = createContext<{
  userState: UserStateType;
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>;
}>({
  userState: null,
  setUserState: () => { }
});

export const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserStateType>({
    isAuthenticated: false,
    prismaUUID: null,
    userInfo: null,
    isProcessing: false,
    error: false
  });


  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};
