import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import signupAnimation from '../../assets/animations/publish.json';
import splashAnimation from '../../assets/animations/get.json'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
const PublishWorkScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (showAnimation) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [showAnimation, navigation]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setSelectedCategory('');
  };

  const handlePublish = async () => {
    if (!title || !description || !amount || !selectedCategory) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }
  
    setShowAnimation(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
  
      const workResponse = await fetch('http://192.168.200.238:5000/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          category: selectedCategory,
          userId, // Store publisher ID
        }),
      });
  
      const workData = await workResponse.json();
      if (!workResponse.ok) {
        throw new Error(workData.error || 'Failed to publish work');
      }
  
      // Store publisher in AsyncStorage
      await AsyncStorage.setItem('publisher', JSON.stringify({  userId, title, category: selectedCategory }));
  
      Alert.alert('Success', 'Work published successfully');
      clearForm();
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while publishing the work');
      console.error('Error during submission:', error);
    } finally {
      setShowAnimation(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }} keyboardShouldPersistTaps="handled">
        
        {/* Show Animation and Hide UI */}
        {showAnimation ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 500 }}>
            <LottieView source={splashAnimation} autoPlay loop={false} style={{ width: 200, height: 200 }} />
          </View>
        ) : (
          <>
            {/* Back Arrow */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>

            {/* Lottie Animation */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <LottieView source={signupAnimation} autoPlay loop style={{ width: 150, height: 150 }} />
            </View>

            {/* Title */}
            <Text style={styles.heading}>Publish Work</Text>

            {/* Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
            />

            {/* Description Input */}
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Description"
              multiline
              value={description}
              onChangeText={setDescription}
              returnKeyType="done"
            />

            {/* Currency and Amount */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <View style={[styles.input, { width: 80, alignItems: 'center' }]}>
                <Text style={styles.label}>₹ INR</Text>
              </View>
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 10 }]}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                returnKeyType="done"
              />
            </View>

            {/* Category Picker */}
            <View style={[styles.input, { padding: 0 }]}>
              <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory} style={{ height: 50 }}>
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Web Development" value="Web Development" />
                <Picker.Item label="Arts & Crafts" value="Arts & Crafts" />
                <Picker.Item label="Graphic Design" value="Graphic Design" />
              </Picker>
            </View>

            {/* Clear Button */}
            <TouchableOpacity onPress={clearForm} style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>

            {/* Publish Button */}
            <TouchableOpacity style={styles.button} onPress={handlePublish}>
              <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  heading: {
    fontSize: 24,
    fontFamily: 'Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Regular',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Medium',
  },
  clearButton: {
    fontSize: 16,
    fontFamily: 'Medium',
    color: 'blue',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Medium',
    color: 'white',
  },
};

export default PublishWorkScreen;