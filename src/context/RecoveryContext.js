import React, { createContext, useContext } from 'react';
import { Audio } from 'expo-av';
import Torch from 'expo-torch';

const RecoveryContext = createContext();

export const useRecovery = () => useContext(RecoveryContext);

export const RecoveryProvider = ({ children }) => {
  const chirp = async () => {
    // const { sound } = await Audio.Sound.createAsync(
    //    require('../../assets/chirp.mp3') // Placeholder - requires actual file
    // );
    // await sound.playAsync();
    console.log('CHIRP'); // Placeholder action
  };

  const flash = () => {
    Torch.switchState(true);
    setTimeout(() => Torch.switchState(false), 1000);
  };

  return (
    <RecoveryContext.Provider
      value={{
        chirp,
        flash,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};
