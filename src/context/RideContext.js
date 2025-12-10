import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { decode } from '@googlemaps/polyline-codec';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const RideContext = createContext();

export const useRide = () => useContext(RideContext);

export const RideProvider = ({ children }) => {
  const [isRideActive, setIsRideActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [path, setPath] = useState([]);
  const [route, setRoute] = useState([]);
  const [progress, setProgress] = useState(0);

  const startRide = () => {
    setIsRideActive(true);
    setStartTime(new Date());
  };

  const endRide = async (user) => {
    setIsRideActive(false);
    
    const tripData = {
        startTime,
        distance,
        calories,
        path,
        endTime: new Date(),
    };

    try {
        await addDoc(collection(db, 'users', user.uid, 'trips'), tripData);
    } catch(error) {
        console.error(error);
    }
  };
  
  const getRoute = async (origin, destination) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=bicycling&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const points = decode(response.data.routes[0].overview_polyline.points);
        const routeCoordinates = points.map(point => ({
            latitude: point[0],
            longitude: point[1]
        }));
        setRoute(routeCoordinates);
        
        let totalDistance = 0;
        for(let i = 0; i < routeCoordinates.length - 1; i++) {
            totalDistance += calculateDistance(routeCoordinates[i].latitude, routeCoordinates[i].longitude, routeCoordinates[i+1].latitude, routeCoordinates[i+1].longitude);
        }
    } catch (error) {
        console.error(error);
    }
  }

  const updateRideStats = (newLocation, userProfile) => {
      if(!isRideActive) return;

      const newPath = [...path, { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude }];
      setPath(newPath);

      if(newPath.length > 1) {
          const lastPoint = newPath[newPath.length - 2];
          const newDistance = distance + calculateDistance(lastPoint.latitude, lastPoint.longitude, newLocation.coords.latitude, newLocation.coords.longitude);
          setDistance(newDistance);
      }
      
      const durationInMinutes = (new Date() - startTime) / 60000;
      const speedInMph = newLocation.coords.speed * 2.23694;
      let mets = 0;
      if (speedInMph < 10) mets = 4.0;
      else if (speedInMph < 12) mets = 6.8;
      else if (speedInMph < 14) mets = 8.0;
      else if (speedInMph < 16) mets = 10.0;
      else if (speedInMph < 20) mets = 12.0;
      else mets = 15.8;

      // Use a default weight of 75kg if bodyWeight is not set
      const bodyWeight = (userProfile && userProfile.bodyWeight) ? userProfile.bodyWeight : 75;
      let calculatedCalories = (mets * bodyWeight * 3.5) / 200 * durationInMinutes;

      if(userProfile && userProfile.bikeDetails && userProfile.bikeDetails.toLowerCase().includes('electric')) {
          calculatedCalories *= 0.6; // 40% reduction for electric bikes
      }
      
      setCalories(calculatedCalories);

      if (route.length > 0) {
        const totalDistance = 0;
        for(let i = 0; i < route.length - 1; i++) {
            totalDistance += calculateDistance(route[i].latitude, route[i].longitude, route[i+1].latitude, route[i+1].longitude);
        }
        setProgress((distance / totalDistance) * 100);
      }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
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

  return (
    <RideContext.Provider
      value={{
        isRideActive,
        startTime,
        distance,
        calories,
        path,
        route,
        progress,
        startRide,
        endRide,
        updateRideStats,
        getRoute
      }}
    >
      {children}
    </RideContext.Provider>
  );
};
