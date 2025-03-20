import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch the current user's ID
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch notifications for the user
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/notifications/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://192.168.200.238:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Update the local state to reflect the notification as read
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId ? { ...notification, isRead: true } : notification
          )
        );
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notificationCard, item.isRead && styles.readNotification]}
              onPress={() => markAsRead(item._id)}
            >
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              {!item.isRead && <View style={styles.unreadIndicator} />}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noNotifications: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  readNotification: {
    backgroundColor: '#e0e0e0',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
});

export default NotificationScreen;