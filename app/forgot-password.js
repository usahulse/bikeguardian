import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../src/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

import { colors } from '../src/theme/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: colors.primary,
    },
    input: {
        height: 40,
        borderColor: colors.primary,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: colors.text,
    },
});

export default ForgotPasswordScreen;
