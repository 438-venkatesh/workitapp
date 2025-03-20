import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens.............. 
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import GetStartedScreen from './src/screens/GetStartedScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PublishWorkScreen from './src/screens/PublishWorkScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CategoryJobsScreen from './src/screens/CategoryJobsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import WorkDetailsScreen from './src/screens/WorkDetailsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import BidDetailsScreen from './src/screens/BidDetailsScreen';
import ExportScreen from './src/screens/ExportScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatListScreen from './src/screens/ChatListScreen';
// EditProfileScreen
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        'Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function MainTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'home';
            else if (route.name === 'Publish') iconName = 'add-circle';
            else if (route.name === 'Profile') iconName = 'person';
            else if (route.name === 'orders') iconName = 'briefcase-outline';
            else if (route.name === 'Notification') iconName = 'notifications';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
          
        
        <Tab.Screen name="Publish" component={PublishWorkScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        
        <Tab.Screen name="Export" component={ExportScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="CategoryJobs" component={CategoryJobsScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="BidDetails" component={BidDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Order" component={OrdersScreen} />
        {/* BidConfirmationScreen */}
        {/* WorkDetailsScreen */}
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />

        <Stack.Screen name="WorkDetails" component={WorkDetailsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}