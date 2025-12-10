import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Button
        title="Set Security PIN"
        onPress={() => router.push({ pathname: '/pin-entry', params: { isSettingPin: true } })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default SettingsScreen;
