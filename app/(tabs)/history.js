import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { AppContext } from '../../src/context/AppContext';
import { useContext } from 'react';

const HistoryScreen = () => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users', user.uid, 'trips'), orderBy('startTime', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tripsData = [];
        querySnapshot.forEach((doc) => {
          tripsData.push({ ...doc.data(), id: doc.id });
        });
        setTrips(tripsData);
      });
      return unsubscribe;
    }
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.tripItem}>
      <Text>Date: {new Date(item.startTime.seconds * 1000).toLocaleDateString()}</Text>
      <Text>Distance: {(item.distance * 0.000621371).toFixed(2)} MI</Text>
      <Text>Calories: {item.calories.toFixed(0)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tripItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HistoryScreen;
