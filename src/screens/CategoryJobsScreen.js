import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryJobsScreen = ({ route, navigation }) => {
  const { category, works: initialWorks } = route.params; // Get the category and works from navigation params
  const [userId, setUserId] = useState(null);
  const [works, setWorks] = useState(initialWorks);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);
  // Fetch the current user's ID
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const fetchWorksByCategory = async (category) => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/works/${category}`);
      const data = await response.json();
      if (response.ok) {
        // Filter out freezed works
        const nonFreezedWorks = data.filter((work) => !work.frozen);
        setWorks(nonFreezedWorks);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch works');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching works');
      console.error('Error fetching works:', error);
    }
  };

  // Handle bid click
  const handleBidClick = (item) => {
    if (item.userId === userId) {
      // If the bid is published by the current user, navigate to BidDetailsScreen
      navigation.navigate('BidDetails', { workId: item._id });
    } else {
      // If the bid is published by another user, navigate to JobDetailsScreen
      navigation.navigate('JobDetails', { bid: item });
    }
  };

  // Refresh works when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWorksByCategory(category);
    });
    return unsubscribe;
  }, [navigation, category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={works}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBidClick(item)}>
            <View style={styles.workCard}>
              <Text style={styles.workTitle}>{item.title}</Text>
              <Text style={styles.workDescription}>{item.description}</Text>
              <Text style={styles.workAmount}>₹ {item.amount}</Text>
              <Text >Published by: {username}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
});

export default CategoryJobsScreen;