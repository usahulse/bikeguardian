import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const HoldToConfirmModal = ({ isVisible, onConfirm, onCancel, actionText }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      progress.setValue(0);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isVisible]);

  const handlePressIn = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    timerRef.current = setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  const handlePressOut = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 200, // Quickly animate back
      useNativeDriver: false,
    }).start();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onCancel();
  };
  
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>HOLD TO CONFIRM</Text>
          <Text style={styles.actionText}>{actionText}</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.progressIndicator, { width: progressWidth }]} />
            <Text style={styles.buttonText}>HOLD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#111827',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  actionText: {
    color: '#00FFFF',
    fontSize: 18,
    marginVertical: 10,
  },
  confirmButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#00A3A3',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    overflow: 'hidden',
  },
  progressIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00FFFF',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HoldToConfirmModal;
