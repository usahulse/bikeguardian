import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from '../context/LocationContext';
import { colors } from '../theme/theme';
// Mock data for battery and network
const battery = '92%';
const network = 'LTE';

const StatusPanel = ({ isArmed }) => {
  const { location } = useLocation();
  const coords = location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'N/A';

  return (
    <View style={styles.container}>
      <View style={styles.telemetry}>
        <Text style={styles.telemetryText}>GPS: {coords}</Text>
        <Text style={styles.telemetryText}>BAT: {battery}</Text>
        <Text style={styles.telemetryText}>NET: {network}</Text>
      </View>
      <View style={[styles.shield, isArmed ? styles.armed : styles.disarmed]}>
        <Text style={styles.shieldText}>{isArmed ? 'ARMED' : 'DISARMED'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  telemetry: {
    flex: 1,
  },
  telemetryText: {
    color: colors.text,
    fontSize: 12,
  },
  shield: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  armed: {
    backgroundColor: colors.danger,
  },
  disarmed: {
    backgroundColor: colors.success,
  },
  shieldText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default StatusPanel;
