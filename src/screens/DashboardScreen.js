import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert ,StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  { id: 1, title: 'Web Development' },
  { id: 2, title: 'Arts & Crafts' },
  { id: 3, title: 'Graphic Design' },
  { id: 4, title: 'AI & ML' },
];

const DashboardScreen = ({ navigation }) => {
  const [instituteName, setInstituteName] = useState('');
  const [works, setWorks] = useState([]);
  const [notifications, setNotifications] = useState([]); // Add this line
  
  // const handleLogout = async () => {
  //   console.log('Logout button clicked'); // Debugging log
  //   try {
  //     await AsyncStorage.removeItem('userToken'); // Clear the user token
  //     console.log('userToken removed'); // Debugging log
  //     navigation.replace('Login'); // Redirect to the Login Screen
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // };


  useEffect(() => {
    const fetchInstituteName = async () => {
      const name = await AsyncStorage.getItem('instituteName');
      if (name) {
        setInstituteName(name);
      }
    };
    fetchInstituteName();

    

    fetchInstituteName();
    
  }, []);
  const handleNotificationClick = (notification) => {
    if (notification.type === 'work') {
      navigation.navigate('JobDetails', { bid: { _id: notification.relatedId } });
    } else if (notification.type === 'bid') {
      navigation.navigate('JobDetails', { bid: { _id: notification.relatedId } });
    }
  };
  
  const fetchWorksByCategory = async (category) => {
    console.log('Fetching works for category:', category);
    if (!navigation) {
      console.error('Navigation prop is undefined');
      return;
    }
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/works/${category}`);
      const data = await response.json();
      console.log('API Response:', data);
      if (response.ok) {
        setWorks(data);
        navigation.navigate('CategoryJobs', { category, works: data }); // Navigate with data
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch works');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching works');
      console.error('Error fetching works:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 15 }}>
      {/* Header Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>WorkIt</Text>
        <View style={{ flexDirection: 'row' }}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatIcon} onPress={() => navigation.navigate('ChatListScreen')}>
        <Text style={styles.chatIconText}>💬</Text>
      </TouchableOpacity>
      <View style={styles.notifications}>
        {notifications.map(notification => (
          <TouchableOpacity key={notification._id} style={styles.notification}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </TouchableOpacity>
        ))}
      </View>
        </View>
      </View>

      {/* Institution Name Placeholder */}
      <Text style={{ fontSize: 14, color: 'gray', marginVertical: 10 }}>
        {instituteName || 'Rajiv Gandhi University of Knowledge Technologies, Nuzvid'}
      </Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationClick(item)}>
          <View style={styles.notificationCard}>
            <Text style={styles.notificationMessage}>{item.message}</Text>
              {!item.isRead && <View style={styles.unreadIndicator} />}
          </View>
          </TouchableOpacity>
        )}
      />
      {/* Categories Grid */}
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => fetchWorksByCategory(item.title)}
            style={{
              backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'][item.id % 4], // Different colors
              flex: 1,
              margin: 5,
              height: 100,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
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
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  notificationBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instituteText: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 10,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  bidButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bidButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryCard: {
    flex: 1,
    margin: 5,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
