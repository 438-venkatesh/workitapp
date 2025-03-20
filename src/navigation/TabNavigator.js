 import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import PublishWorkScreen from '../screens/PublishWorkScreen';
import ExportScreen from '../screens/ExportScreen'; // Import Orders screen
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
    tabBarIcon: ({ color, size }) => {
      let iconName;
          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'PublishWork') iconName = 'add-circle-outline';
          else if (route.name === 'Orders') iconName = 'briefcase-outline'; // Orders icon
          else if (route.name === 'BidConfirmation') iconName = 'person-outline';

      return <Ionicons name={iconName} size={size} color={color} />;
    },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ fontSize: 12, fontWeight: focused ? 'bold' : 'normal', color }}>
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="PublishWork" component={PublishWorkScreen} />
      <Tab.Screen name="Export" component={ExportScreen} /> {/* New Orders Screen */}
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
};

export default TabNavigator;
