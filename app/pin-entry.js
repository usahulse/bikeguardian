import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { usePIN } from '../src/context/PINContext';
import { router, useLocalSearchParams } from 'expo-router';

const PINEntryScreen = () => {
  const [pin, setPin] = useState('');
  const { setPIN, checkPIN } = usePIN();
  const { isSettingPin } = useLocalSearchParams();

  const handleConfirm = async () => {
    if (isSettingPin) {
      await setPIN(pin);
      Alert.alert('PIN Set', 'Your PIN has been set successfully.');
      router.back();
    } else {
      const isCorrect = await checkPIN(pin);
      if (isCorrect) {
        // Here, we would typically notify the SecurityScreen that the PIN was correct.
        // For now, we will just navigate back.
        router.back();
      } else {
        Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSettingPin ? 'Set Your PIN' : 'Enter Your PIN'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
      />
      <Button title="Confirm" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default PINEntryScreen;
