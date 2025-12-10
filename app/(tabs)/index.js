import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import HoldToConfirmModal from '../../src/components/HoldToConfirmModal';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusPanel from '../../src/components/StatusPanel';
import { useLocation } from '../../src/context/LocationContext';
import { useCamera } from '../../src/context/CameraContext';

const SecurityScreen = () => {
  const [isArmed, setIsArmed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { startBackgroundLocation, stopBackgroundLocation, armGeofence, disarmGeofence } = useLocation();
  const { requestPermission, startMotionDetection, stopMotionDetection } = useCamera();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleArmDisarmPress = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    const newArmedState = !isArmed;

    if (newArmedState) { // Arming the system
      setIsArmed(true);
      startBackgroundLocation();
      armGeofence();
      startMotionDetection();
      setIsModalVisible(false);
    } else { // Disarming the system
      const pin = await AsyncStorage.getItem('pin');
      if (pin) {
        router.push({ pathname: '/pin-entry', params: { isSettingPin: false } });
        // After correct PIN entry, we would then call the disarm functions.
        // For now, we will assume the PIN is correct and disarm immediately.
        setIsArmed(false);
        stopBackgroundLocation();
        disarmGeofence();
        stopMotionDetection();
      } else {
        setIsArmed(false);
        stopBackgroundLocation();
        disarmGeofence();
        stopMotionDetection();
      }
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusPanel isArmed={isArmed} />
      <Text style={styles.statusText}>
        SYSTEM STATUS: {isArmed ? 'ARMED' : 'DISARMED'}
      </Text>
      <TouchableOpacity
        style={[styles.button, isArmed ? styles.armedButton : styles.disarmedButton]}
        onPress={handleArmDisarmPress}
      >
        <Text style={styles.buttonText}>{isArmed ? 'DISARM' : 'ARM'}</Text>
      </TouchableOpacity>
      <HoldToConfirmModal
        isVisible={isModalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        actionText={isArmed ? 'DISARM SYSTEM' : 'ARM SYSTEM'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827', // Dark theme background
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100, // Makes it a circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  disarmedButton: {
    backgroundColor: '#00A3A3', // Cyan
    borderColor: '#00FFFF',
  },
  armedButton: {
    backgroundColor: '#A30000', // Neon Red
    borderColor: '#FF0000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default SecurityScreen;
