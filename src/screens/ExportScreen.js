import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExportScreen = ({ navigation }) => {
  const [completedWorks, setCompletedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompletedWorks();
  }, []);

  const fetchCompletedWorks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://192.168.200.238:5000/api/works/completed/${userId}`);

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      // Parse the response as JSON
      const data = JSON.parse(responseText);

      if (response.ok) {
        setCompletedWorks(data);
      } else {
        setError(data.error || 'Failed to fetch completed works');
      }
    } catch (error) {
      console.error('Error fetching completed works:', error);
      setError('An error occurred while fetching completed works');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (workId) => {
    try {
      // Implement payment logic here
      Alert.alert('Success', 'Payment successful');
    } catch (error) {
      Alert.alert('Error', 'An error occurred during payment');
      console.error('Error during payment:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Works</Text>
      {completedWorks.length === 0 ? (
        <Text style={styles.noWorks}>No completed works found.</Text>
      ) : (
        <FlatList
          data={completedWorks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.workCard}>
              <Text style={styles.workTitle}>{item.title}</Text>
              <Text style={styles.workDescription}>{item.description}</Text>
              <Text style={styles.workAmount}>₹ {item.amount}</Text>
              <Text style={styles.workStatus}>Status: {item.status}</Text>
              <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item._id)}>
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
    marginBottom: 20,
  },
  noWorks: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  workCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  workAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  workStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExportScreen;