import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';

const AlarmTriggeredView = () => {
    const { location, geofence } = useLocation();
    const [path, setPath] = React.useState([]);

    React.useEffect(() => {
        if (location) {
            setPath([...path, { latitude: location.coords.latitude, longitude: location.coords.longitude }]);
        }
    }, [location]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ALARM TRIGGERED</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: geofence ? geofence.latitude : 37.78825,
            longitude: geofence ? geofence.longitude : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
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
            <Polyline
                coordinates={path}
                strokeColor="#FFA500" // Amber
                strokeWidth={3}
            />
        </MapView>
        <View style={styles.hud}>
            <Text style={styles.hudText}>Speed: {location ? location.coords.speed.toFixed(1) : 0} m/s</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#A30000', // Neon Red
    zIndex: 999, // Ensure it's on top
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Black
    margin: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default AlarmTriggeredView;
