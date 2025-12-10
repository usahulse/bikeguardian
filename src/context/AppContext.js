import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadCachedProfile = async () => {
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          setUserProfile(JSON.parse(cachedProfile));
        }
      } catch (error) {
        console.error('Failed to load cached profile', error);
      }
    };
    loadCachedProfile();
  }, []);

  const fetchAndCacheProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profile = docSnap.data();
        setUserProfile(profile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Failed to fetch and cache profile', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: (newUser) => {
          setUser(newUser);
          if (newUser) {
            fetchAndCacheProfile(newUser.uid);
          }
        },
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
