import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { auth } from '../src/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AppContext } from '../src/context/AppContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(AppContext);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkStoredCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsAuthenticated(true);

      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
      } else {
        await AsyncStorage.removeItem('email');
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.switchContainer}>
        <Text>Remember Me</Text>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
      </View>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Sign Up" onPress={() => router.push('/signup')} />
      <Button title="Forgot Password?" onPress={() => router.push('/forgot-password')} />
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        color: colors.text,
    },
});
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
    },
});

export default LoginScreen;
