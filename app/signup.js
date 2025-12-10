import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../src/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { AppContext } from '../src/context/AppContext';
import { router } from 'expo-router';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [bikeDetails, setBikeDetails] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated, setUser } = useContext(AppContext);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        name,
        bikeDetails,
        bodyWeight,
      });

      setUser(user);
      setIsAuthenticated(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bike Details"
        value={bikeDetails}
        onChangeText={setBikeDetails}
      />
      <TextInput
        style={styles.input}
        placeholder="Body Weight (kg)"
        value={bodyWeight}
        onChangeText={setBodyWeight}
        keyboardType="numeric"
      />
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
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Already have an account? Login" onPress={() => router.push('/login')} />
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

export default SignupScreen;
