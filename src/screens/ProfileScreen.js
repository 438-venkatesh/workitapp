import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('myWorks');
  const [works, setWorks] = useState([]);
  const [bids, setBids] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      if (activeTab === 'myWorks') {
        fetchMyWorks();
      } else {
        fetchMyBids();
      }
    }
  }, [userId, activeTab]);

  const fetchMyWorks = async () => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/works/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setWorks(data);
      } else {
        console.error('Failed to fetch works:', data.error);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };
  
  const fetchMyBids = async () => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/bids/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        const acceptedBids = data.filter((bid) => bid.status === 'accepted');
        setBids(acceptedBids);
      } else {
        console.error('Failed to fetch bids:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleWorkPress = (work) => {
    navigation.navigate('Order', { work, type: 'work' });
  };

  const handleBidPress = (bid) => {
    navigation.navigate('Order', { bid, type: 'bid' });
  };
  const handleChatWithBidder = (bidderId, bidderName) => {
      navigation.navigate('ChatScreen', { receiverId: bidderId, receiverName: bidderName });
  };
  
  const handleChatWithPublisher = (publisherId, publisherName) => {
    navigation.navigate('ChatScreen', { receiverId: publisherId, receiverName: publisherName });
  };
  
  return (
    <View style={styles.container}>
      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'myWorks' && styles.activeButton]}
          onPress={() => setActiveTab('myWorks')}
        >
          <Text style={[styles.toggleText, activeTab === 'myWorks' && styles.activeText]}>My Works</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'myBids' && styles.activeButton]}
          onPress={() => setActiveTab('myBids')}
        >
          <Text style={[styles.toggleText, activeTab === 'myBids' && styles.activeText]}>My Bids</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'myWorks' && (
  <FlatList
    data={works}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleWorkPress(item)}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Text style={styles.cardCategory}>Category: {item.category}</Text>
          <Text style={styles.cardAmount}>₹ {item.amount}</Text>
          <Text style={styles.cardStatus}>Status: {item.status}</Text>
          {item.isAllocated && (
            <>
              <Text style={styles.cardBidder}>Bidder: {item.userId?.username || 'Unknown'}</Text>
              <Text style={styles.cardWinningAmount}>Winning Bid: ₹ {item.winningBidAmount}</Text>
              <TouchableOpacity 
  style={styles.chatButton} 
  onPress={() => handleChatWithBidder(item.winningBidder?._id, item.winningBidder?.username)}
>
  <Text style={styles.chatButtonText}>Chat with Bidder</Text>
</TouchableOpacity>
            </>
          )}
          {item.status === 'completed' && (
            <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item._id)}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )}
  />
)}

{activeTab === 'myBids' && (
  <FlatList
    data={bids}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleBidPress(item)}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.bidId?.title || 'Unknown Work'}</Text>
          <Text style={styles.cardDescription}>{item.bidDescription}</Text>
          <Text style={styles.cardCategory}>Category: {item.bidId?.category || 'Unknown'}</Text>
          <Text style={styles.cardAmount}>₹ {item.bidAmount}</Text>
          <Text style={styles.cardDeliveryDays}>Delivery Days: {item.deliveryDays}</Text>
          <Text style={styles.cardStatus}>Status: {item.status}</Text>
          <Text style={styles.cardPublisher}>Published by: {item.userId?.username || 'Unknown'}</Text>
          <TouchableOpacity 
  style={styles.chatButton} 
  onPress={() => handleChatWithPublisher(item.bidId?.userId?._id, item.bidId?.userId?.username)}
>
  <Text style={styles.chatButtonText}>Chat with Publisher</Text>
</TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 16,
    color: '#555',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: '#555',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  cardStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  cardBidder: {
    fontSize: 14,
    marginTop: 5,
  },
  cardWinningAmount: {
    fontSize: 14,
    marginTop: 5,
  },
  cardDeliveryDays: {
    fontSize: 14,
    marginTop: 5,
  },
  cardPublisher: {
    fontSize: 14,
    marginTop: 5,
  },
  chatButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ProfileScreen;