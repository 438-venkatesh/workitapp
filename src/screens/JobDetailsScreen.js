import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobDetailsScreen = ({ route, navigation }) => {
  const { bid } = route.params; // Get the bid details from navigation params
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [bidDescription, setBidDescription] = useState('');

  const handleSubmitBid = async () => {
    if (!bidAmount || !deliveryDays || !bidDescription) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    if (isNaN(bidAmount) || bidAmount <= 0) {
      Alert.alert('Error', 'Enter a valid bid amount.');
      return;
    }
  
    if (isNaN(deliveryDays) || deliveryDays <= 0) {
      Alert.alert('Error', 'Enter valid delivery days.');
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem('userId'); // Bidder's ID
      const response = await fetch('http://192.168.200.238:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidId: bid._id, // Work ID
          userId, // Bidder ID
          bidAmount: parseFloat(bidAmount),
          deliveryDays: parseInt(deliveryDays),
          bidDescription,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store bidder details in AsyncStorage
        await AsyncStorage.setItem('bidder', JSON.stringify({ userId, workTitle: bid.title,category: bid.category  }));
  
        Alert.alert('Success', 'Bid submitted successfully');
        navigation.replace('MainTabs', { screen: 'Profile' });
      } else {
        Alert.alert('Error', data.error || 'Failed to submit bid');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the bid');
      console.error('Error submitting bid:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bid.title}</Text>
      <Text style={styles.description}>{bid.description}</Text>
      <Text style={styles.amount}>₹ {bid.amount}</Text>

      <Text style={styles.label}>How much amount do you need?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your bid amount"
        value={bidAmount}
        onChangeText={setBidAmount}
      />

      <Text style={styles.label}>Project Delivery Days</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter delivery days"
        value={deliveryDays}
        onChangeText={setDeliveryDays}
      />

      <Text style={styles.label}>Describe your approach</Text>
      <TextInput
        style={styles.textBox}
        placeholder="Write about your work plan..."
        value={bidDescription}
        onChangeText={setBidDescription}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBid}>
        <Text style={styles.submitButtonText}>Submit Bid</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;