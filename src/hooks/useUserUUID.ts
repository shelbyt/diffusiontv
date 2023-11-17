// hooks/useUserUUID.js
import { useContext, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserContext } from '../state/UserContext';

const useUserUUID = () => {
  const { userState, setUserState } = useContext(UserContext);
  const { user } = useUser();

  useEffect(() => {
    if (user && (!userState || !userState.prismaUUID)) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setUserState({
      ...userState,
      isAuthenticated: userState?.isAuthenticated || false,
      prismaUUID: userState?.prismaUUID || null,
      userInfo: userState?.userInfo || null, // Add this line
      isProcessing: true,
      error: false
    });

    try {
      const response = await fetch(`/api/me/${user?.sub}`);
      if (response.ok) {
        const userData = await response.json();
        setUserState({
          ...userState,
          prismaUUID: userData.id,
          userInfo: userData, // Store additional user info
          isProcessing: false,
          //isAuthenticated: userState?.isAuthenticated ?? false,
          isAuthenticated: true,
          error: false
        });
      } else {
        console.error('Error fetching user data:', response.statusText);
        setUserState({
          ...userState,
          isAuthenticated:  false,
          prismaUUID:  null,
          userInfo:  null, // Add this line
          isProcessing: false,
          error: true
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserState({
        ...userState,
        isAuthenticated: false,
        prismaUUID: null,
        userInfo: null, // Add this line
        isProcessing: false,
        error: true
      });
    }
  }

  return { userState, fetchUserData };
};

export default useUserUUID;
