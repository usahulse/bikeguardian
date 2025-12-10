import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Camera } from 'expo-camera';
import StatusPanel from '../../src/components/StatusPanel';
import { useLocation } from '../../src/context/LocationContext.js';
import { useRecovery } from '../../src/context/RecoveryContext';

const FindBikeScreen = () => {
  const { location } = useLocation();
  const { chirp, flash } = useRecovery();

  const handleChirp = () => {
    chirp();
  };

  const handleFlash = () => {
    flash();
  };

  return (
    <View style={styles.container}>
      <StatusPanel isArmed={false} />
      <MapView
        style={styles.map}
        showsUserLocation
        region={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : null}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Bike's Location"
          />
        )}
      </MapView>
      <Camera style={styles.pipCamera} type={Camera.Constants.Type.back} />
      <View style={styles.controls}>
        <Button title="Chirp" onPress={handleChirp} />
        <Button title="Flash" onPress={handleFlash} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pipCamera: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00FFFF',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default FindBikeScreen;
