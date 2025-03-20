import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetStartedScreen({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instituteName, setInstituteName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
      
      const response = await fetch('http://192.168.200.238:5000/api/institution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Store institution details for this user
          instituteName,
          idNumber,
          year,
          branch,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await AsyncStorage.setItem('instituteName', instituteName); // Store institution name locally
        navigation.replace('MainTabs'); // Navigate to Dashboard after filling the form
      } else {
        Alert.alert('Error', data.error || 'Failed to save institution data');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form');
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <View style={styles.container}>
      {isSubmitting ? (
        <LottieView 
          source={require('../../assets/animations/get.json')} 
          autoPlay 
          loop={false} 
          style={styles.lottieSuccess} 
        />
      ) : (
        <>
          <LottieView 
            source={require('../../assets/animations/getstart.json')} 
            autoPlay 
            loop 
            style={styles.lottie} 
          />
          <Text style={styles.title}>Get Started...</Text>
      <TextInput
        placeholder="Institute Name"
        style={styles.input}
        value={instituteName}
        onChangeText={setInstituteName}
            editable={!isSubmitting} 
      />
      <TextInput
        placeholder="ID Number"
        style={styles.input}
        value={idNumber}
        onChangeText={setIdNumber}
        keyboardType="numeric"
            editable={!isSubmitting} 
      />
      <TextInput
        placeholder="Year"
        style={styles.input}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
            editable={!isSubmitting} 
      />
      <TextInput
        placeholder="Branch"
        style={styles.input}
        value={branch}
        onChangeText={setBranch}
            editable={!isSubmitting} 
      />
          <TouchableOpacity 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            disabled={isSubmitting}
          >
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  lottieSuccess: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: 'Medium',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Bold',
  },
});