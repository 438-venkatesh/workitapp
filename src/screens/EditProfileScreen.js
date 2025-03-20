import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import editProfileAnimation from '../../assets/animations/Signup.json'; // Ensure correct path

const EditProfileScreen = ({ navigation }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView source={editProfileAnimation} autoPlay loop style={styles.lottie} />
      </View>

      {/* Wallet Balance Display */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Wallet Balance: $100.00</Text>
      </View>

      {/* Theme Selection */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Theme</Text>
        <TouchableOpacity onPress={() => setIsDarkTheme(!isDarkTheme)}>
          <Text style={styles.themeText}>{isDarkTheme ? 'Dark' : 'Light'}</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Toggle */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      {/* Buttons */}
      {[
        { title: 'Withdraw Balance' },
        { title: 'Support' },
        { title: 'Terms & Conditions' },
        { title: 'About Us' },
        { title: 'Logout' },
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.button}>
          <Text style={styles.buttonText}>{item.title}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  balanceContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
  },
  themeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default EditProfileScreen;
