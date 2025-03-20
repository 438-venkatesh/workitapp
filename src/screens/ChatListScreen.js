import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const BiddersPublishersScreen = () => {
  const [bidders, setBidders] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedBidder, setSelectedBidder] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedBidders = await AsyncStorage.getItem('bidder');
      const storedPublishers = await AsyncStorage.getItem('publisher');

      if (storedBidders) setBidders([JSON.parse(storedBidders)]);
      if (storedPublishers) setPublishers([JSON.parse(storedPublishers)]);
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Bidders and Publishers</Text>

      <Text style={styles.label}>Bidders</Text>
      <Picker
        selectedValue={selectedBidder}
        onValueChange={(itemValue) => setSelectedBidder(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Bidder" value="" />
        {bidders.map((bidder) => (
          <Picker.Item 
            key={bidder.userId} 
            label={`${bidder.workTitle} → ${bidder.category}`} 
            value={bidder.userId} 
          />
        ))}
      </Picker>

      <Text style={styles.label}>Publishers</Text>
      <Picker
        selectedValue={selectedPublisher}
        onValueChange={(itemValue) => setSelectedPublisher(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Publisher" value="" />
        {publishers.map((publisher) => (
          <Picker.Item 
            key={publisher.userId} 
            label={`${publisher.title} → ${publisher.category}`} 
            value={publisher.userId} 
          />
        ))}
      </Picker>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 20 },
});

export default BiddersPublishersScreen;
