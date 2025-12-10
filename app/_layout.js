import React from 'react';
import { AppProvider } from '../src/context/AppContext';
import { LocationProvider } from '../src/context/LocationContext';
import { CameraProvider } from '../src/context/CameraContext';
import { PINProvider } from '../src/context/PINContext';
import { AlarmProvider, useAlarm } from '../src/context/AlarmContext';
import { RideProvider } from '../src/context/RideContext';
import { RecoveryProvider } from '../src/context/RecoveryContext';
import AlarmTriggeredView from '../src/components/AlarmTriggeredView';
import { Slot } from 'expo-router';

const AppLayout = () => {
  const { isAlarmActive } = useAlarm();
  return (
    <>
      <Slot />
      {isAlarmActive && <AlarmTriggeredView />}
    </>
  );
};

const RootLayout = () => {
  return (
    <AppProvider>
      <LocationProvider>
        <CameraProvider>
          <PINProvider>
            <AlarmProvider>
                <RideProvider>
                    <RecoveryProvider>
                        <AppLayout />
                    </RecoveryProvider>
                </RideProvider>
            </AlarmProvider>
          </PINProvider>
        </CameraProvider>
      </LocationProvider>
    </AppProvider>
  );
};

export default RootLayout;
