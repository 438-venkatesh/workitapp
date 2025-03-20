import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = ({ route, navigation }) => {
  const { work, bid, type } = route.params;

  // Extract work details from bid if type is 'bid'
  const workDetails = type === 'bid' ? bid.bidId : work;

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'work' && workDetails?._id) {
      fetchBids(workDetails._id);
    }
  }, [workDetails]);

  const fetchBids = async (workId) => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/bids/${workId}`);
      const data = await response.json();
      if (response.ok) {
        setBids(data);
      } else {
        console.error('Failed to fetch bids:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      // Ensure workDetails._id exists
      if (!workDetails?._id) {
        Alert.alert('Error', 'Work ID is missing');
        return;
      }

      // Update the work status to "completed"
      const response = await fetch(`http://192.168.200.238:5000/api/works/${workDetails._id}/complete`, {
        method: 'PUT',
      });

      if (response.ok) {
        Alert.alert('Success', 'Work marked as completed');
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        Alert.alert('Error', 'Failed to mark work as completed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while marking work as completed');
      console.error('Error marking work as completed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {type === 'work' ? (
        <>
          <Text style={styles.title}>{workDetails?.title || 'Unknown Work'}</Text>
          <Text style={styles.description}>{workDetails?.description || 'No description available'}</Text>
          <Text style={styles.category}>Category: {workDetails?.category || 'Unknown'}</Text>
          <Text style={styles.amount}>₹ {workDetails?.amount || '0'}</Text>
          <Text style={styles.status}>Status: {workDetails?.status || 'Unknown'}</Text>

          <Text style={styles.subTitle}>Bids</Text>
          <FlatList
            data={bids}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.bidCard}>
                <Text style={styles.bidUser}>User: {item.userId?.username || 'Unknown'}</Text>
                <Text style={styles.bidAmount}>Amount: ₹ {item.bidAmount}</Text>
                <Text style={styles.bidDays}>Delivery Days: {item.deliveryDays}</Text>
                <Text style={styles.bidDescription}>Description: {item.bidDescription}</Text>
                <Text style={styles.bidStatus}>Status: {item.status}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{bid.bidId?.title || 'Unknown Work'}</Text>
          <Text style={styles.description}>{bid.bidDescription}</Text>
          <Text style={styles.category}>Category: {workDetails?.category || 'Unknown'}</Text>
          <Text style={styles.amount}>₹ {bid.bidAmount}</Text>
          <Text style={styles.deliveryDays}>Delivery Days: {bid.deliveryDays}</Text>
          <Text style={styles.status}>Status: {bid.status}</Text>
          <Text style={styles.publisher}>Publisher: {workDetails?.userId?.username || 'Unknown'}</Text>

          {/* Only "Mark as Complete" button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkComplete}>
            <Text style={styles.actionButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bidCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bidUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bidAmount: {
    fontSize: 14,
    color: '#28a745',
  },
  bidDays: {
    fontSize: 14,
    color: '#555',
  },
  bidDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  bidStatus: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
  },
  deliveryDays: {
    fontSize: 14,
    marginBottom: 10,
  },
  publisher: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderScreen;