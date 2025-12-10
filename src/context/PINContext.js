import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PINContext = createContext();

export const usePIN = () => useContext(PINContext);

export const PINProvider = ({ children }) => {
  const [pin, setPin] = useState(null);

  const setPIN = async (newPin) => {
    setPin(newPin);
    await AsyncStorage.setItem('pin', newPin);
  };
  
  const checkPIN = async (pinToCheck) => {
      const storedPin = await AsyncStorage.getItem('pin');
      return pinToCheck === storedPin;
  }

  return (
    <PINContext.Provider
      value={{
        pin,
        setPIN,
        checkPIN
      }}
    >
      {children}
    </PINContext.Provider>
  );
};
