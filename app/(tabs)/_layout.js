import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/theme';

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.primary,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Security' }} />
      <Tabs.Screen name="ride" options={{ title: 'Bike Ride' }} />
      <Tabs.Screen name="find" options={{ title: 'Find Bike' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
};
