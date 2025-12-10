import React, { createContext, useState, useContext } from 'react';
import { Audio } from 'expo-av';
import Torch from 'expo-torch';

const AlarmContext = createContext();

export const useAlarm = () => useContext(AlarmContext);

export const AlarmProvider = ({ children }) => {
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [sound, setSound] = useState();
  const [strobeInterval, setStrobeInterval] = useState(null);

  const triggerAlarm = async () => {
    setIsAlarmActive(true);
    
    // Play siren
    // const { sound } = await Audio.Sound.createAsync(
    //    require('../../assets/siren.mp3') // Placeholder - requires actual file
    // );
    // setSound(sound);
    // await sound.playAsync();
    console.log('SIREN'); // Placeholder action

    // Flashlight control
    const interval = setInterval(() => {
        Torch.switchState(!Torch.isTorchOn);
    }, 500);
    setStrobeInterval(interval);

    // Synthesized voice warning
    // This is a placeholder as expo-speech does not support background audio.
    // A more robust solution would involve a native module or a different library.
    console.log('Warning. Protected Vehicle. Step Away.');

  };

  const silenceAlarm = async () => {
    setIsAlarmActive(false);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    if (strobeInterval) {
        clearInterval(strobeInterval);
        Torch.switchState(false);
    }
  };

  return (
    <AlarmContext.Provider
      value={{
        isAlarmActive,
        triggerAlarm,
        silenceAlarm,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};
