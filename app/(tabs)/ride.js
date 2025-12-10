import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, TextInput } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import StatusPanel from '../../src/components/StatusPanel';
import { useLocation } from '../../src/context/LocationContext';
import { useRide } from '../../src/context/RideContext';
import { AppContext } from '../../src/context/AppContext';

const BikeRideScreen = () => {
    const { location } = useLocation();
    const { isRideActive, startTime, distance, calories, path, route, progress, startRide, endRide, getRoute } = useRide();
    const { user } = useContext(AppContext);
    const [destination, setDestination] = useState('');

    const handleNavigation = () => {
        if(location) {
            getRoute(`${location.coords.latitude},${location.coords.longitude}`, destination);
        }
    }

    const getDuration = () => {
        if (!isRideActive || !startTime) return '00:00';
        const diff = new Date() - startTime;
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

  return (
    <SafeAreaView style={styles.container}>
      <StatusPanel isArmed={false} />
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Polyline coordinates={path} strokeColor="#00FFFF" strokeWidth={3} />
        <Polyline coordinates={route} strokeColor="#00FF00" strokeWidth={3} />
      </MapView>
      <View style={styles.navigationContainer}>
        <TextInput
            style={styles.input}
            placeholder="Enter Destination"
            value={destination}
            onChangeText={setDestination}
        />
        <Button title="Go" onPress={handleNavigation} />
      </View>
      <View style={styles.hud}>
        <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>SPEED</Text>
            <Text style={styles.hudValue}>{location ? (location.coords.speed * 2.23694).toFixed(1) : 0} MPH</Text>
        </View>
        <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>DISTANCE</Text>
            <Text style={styles.hudValue}>{(distance * 0.000621371).toFixed(2)} MI</Text>
        </View>
        <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>DURATION</Text>
            <Text style={styles.hudValue}>{getDuration()}</Text>
        </View>
        <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>CALORIES</Text>
            <Text style={styles.hudValue}>{calories.toFixed(0)}</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
      </View>
      <View style={styles.controls}>
        <Button title={isRideActive ? "End Ride" : "Start Ride"} onPress={isRideActive ? () => endRide(user) : startRide} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    navigationContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 8,
    },
    map: {
        flex: 1,
    },
    hud: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 10,
    },
    hudItem: {
        alignItems: 'center',
    },
    hudLabel: {
        color: '#00FFFF',
        fontSize: 12,
    },
    hudValue: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        height: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#00FFFF',
        borderRadius: 5,
    },
});

export default BikeRideScreen;
