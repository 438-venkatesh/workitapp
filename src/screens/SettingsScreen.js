import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import settingsAnimation from '../../assets/animations/setting.json'; // Ensure the correct path

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header with Back Arrow & Aligned "Settings" Text */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Lottie Animation at the Top */}
      <View style={styles.animationContainer}>
        <LottieView source={settingsAnimation} autoPlay loop style={styles.lottie} />
      </View>

      {/* Profile Information */}
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/60' }} 
          style={styles.profileImage} 
        />
        <View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>johndoe@email.com</Text>
        </View>
      </View>

      {/* Settings Options */}
      {[
        { title: 'Edit Profile', icon: 'person-outline', navigateTo: 'EditProfile' },
        { title: 'Work History', icon: 'briefcase-outline' },
        { title: 'Themes', icon: 'color-palette-outline' },
        { title: 'Privacy Policy', icon: 'lock-closed-outline' },
        { title: 'Help & Support', icon: 'help-circle-outline' },
        { title: 'Logout', icon: 'log-out-outline' },
      ].map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.optionRow} 
          onPress={() => item.navigateTo && navigation.navigate(item.navigateTo)}
        >
          <Ionicons name={item.icon} size={24} color="black" />
          <Text style={styles.optionText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: -20, // Adjust this for proper spacing
  },
  lottie: {
    width: 150,
    height: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Bold',
    marginLeft: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Bold',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: 'gray',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Medium',
    marginLeft: 10,
  },
});

export default SettingsScreen;
