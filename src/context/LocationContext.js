import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { useAlarm } from './AlarmContext';
import { useRide } from './RideContext';
import { AppContext } from './AppContext';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [geofence, setGeofence] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { triggerAlarm } = useAlarm();
  const { updateRideStats } = useRide();
  const { userProfile } = useContext(AppContext);

  const startBackgroundLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    
    status = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
        return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
        updateRideStats(newLocation, userProfile);
        if (geofence) {
          const distance = calculateDistance(
            newLocation.coords.latitude,
            newLocation.coords.longitude,
            geofence.latitude,
            geofence.longitude
          );
          if (distance > geofence.radius) {
            triggerAlarm();
          }
        }
      }
    );
  };
  
  const stopBackgroundLocation = () => {
      Location.stopLocationUpdatesAsync();
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  const armGeofence = (radius = 15) => {
    if (location) {
      const newGeofence = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radius,
      };
      setGeofence(newGeofence);
    }
  };
  
  const disarmGeofence = () => {
      setGeofence(null);
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        geofence,
        errorMsg,
        startBackgroundLocation,
        stopBackgroundLocation,
        armGeofence,
        disarmGeofence
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
