import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

const BidDetailsScreen = ({ route }) => {
  const { workId } = route.params; // Get the work ID from navigation params
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAllocated, setIsAllocated] = useState(false); // Track if the work is allocated

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`http://192.168.200.238:5000/api/bids/${workId}`);
        const data = await response.json();
        if (response.ok) {
          // Filter out freezed bids
          const nonFreezedBids = data.filter((bid) => !bid.freezed);
          setBids(nonFreezedBids);

          // Check if the work is allocated
          const workResponse = await fetch(`http://192.168.200.238:5000/api/works/${workId}`);
          const workData = await workResponse.json();
          if (workResponse.ok) {
            setIsAllocated(workData.isAllocated);
          }
        } else {
          console.error('Failed to fetch bids:', data.error);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [workId]);

  const handleAcceptBid = async (bidId, userId) => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/bids/${bidId}/accept`, {
        method: 'PUT',
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      // Parse the response as JSON
      const data = JSON.parse(responseText);

      if (response.ok) {
        Alert.alert('Success', 'Bid accepted successfully');
        setIsAllocated(true); // Freeze the bidding form
        // Update the local state to reflect the accepted bid
        setBids((prevBids) =>
          prevBids.map((bid) => (bid._id === bidId ? { ...bid, status: 'accepted' } : bid))
        );

        // Send notifications to both publisher and bidder
        await fetch('http://192.168.200.238:5000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: route.params.userId, // Publisher's user ID
            message: `You have assigned your work to ${bids.find(bid => bid._id === bidId).userId.username}`,
            type: 'work',
          }),
        });

        await fetch('http://192.168.200.238:5000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, // Bidder's user ID
            message: 'Owner accepts your bid request',
            type: 'bid',
          }),
        });
      } else {
        Alert.alert('Error', data.error || 'Failed to accept bid');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while accepting the bid');
      console.error('Error accepting bid:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bids for this Work</Text>
      {isAllocated && (
        <Text style={styles.allocatedText}>This work has been allocated to a bidder.</Text>
      )}
      <FlatList
        data={bids}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bidCard}>
            <Text style={styles.bidUser}>User: {item.userId.username}</Text>
            <Text style={styles.bidAmount}>Amount: ₹ {item.bidAmount}</Text>
            <Text style={styles.bidDays}>Delivery Days: {item.deliveryDays}</Text>
            <Text style={styles.bidDescription}>Description: {item.bidDescription}</Text>
            <Text style={styles.bidStatus}>Status: {item.status}</Text>
            {item.status === 'pending' && !isAllocated && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptBid(item._id, item.userId._id)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            )}
          </View>
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
  allocatedText: {
    fontSize: 16,
    color: '#dc3545',
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
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BidDetailsScreen;