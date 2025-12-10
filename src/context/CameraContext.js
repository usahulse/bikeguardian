import React, { createContext, useState, useContext } from 'react';
import { Camera } from 'expo-camera';
import { useAlarm } from './AlarmContext';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isMotionDetectionActive, setIsMotionDetectionActive] = useState(false);
  const { triggerAlarm } = useAlarm();

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const startMotionDetection = () => {
    if (hasPermission) {
      setIsMotionDetectionActive(true);
      // TODO: Implement motion detection logic
    }
  };

  const stopMotionDetection = () => {
    setIsMotionDetectionActive(false);
  };
  
  // Placeholder for AI verification
  const verifyImageWithAI = async (snapshot) => {
    console.log('Verifying image with AI...');
    // This is where the call to Google Gemini Vision API will be made.
    // For now, we'll just simulate a 'Threat' detection.
    const result = 'Threat';
    if(result === 'Threat') {
        triggerAlarm();
        recordAndUploadVideo();
    }
    return result;
  };

  const recordAndUploadVideo = async () => {
      console.log('Recording and uploading video...');
      // Placeholder for recording a 10-second video and uploading to Firebase Storage
  }

  return (
    <CameraContext.Provider
      value={{
        hasPermission,
        isMotionDetectionActive,
        requestPermission,
        startMotionDetection,
        stopMotionDetection,
        verifyImageWithAI
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
