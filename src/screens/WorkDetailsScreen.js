import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const WorkDetailsScreen = ({ route }) => {
  const { work } = route.params;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('details');

  const proposals = [
    { id: '1', name: 'John Doe', price: '$50', description: 'I have experience in this field and can deliver quality work.' },
    { id: '2', name: 'Jane Smith', price: '$45', description: 'I am skilled in this area and can complete it within the deadline.' },
    { id: '3', name: 'Michael Brown', price: '$60', description: 'I will ensure the best results for your project.' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" style={{ marginTop: 20 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Details</Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'details' && styles.activeButton]}
          onPress={() => setActiveTab('details')}>
          <Text style={[styles.toggleText, activeTab === 'details' && styles.activeText]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'proposals' && styles.activeButton]}
          onPress={() => setActiveTab('proposals')}>
          <Text style={[styles.toggleText, activeTab === 'proposals' && styles.activeText]}>Proposals</Text>
        </TouchableOpacity>
      </View>

      {/* Work Details Section */}
      {activeTab === 'details' ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{work.title}</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{work.description}</Text>
          </View>
          <Text style={styles.label}>Price: <Text style={styles.value}>{work.price}</Text></Text>
          <Text style={styles.label}>Category: <Text style={styles.value}>{work.category}</Text></Text>
          <Text style={styles.label}>Total Bids: <Text style={styles.value}>{proposals.length}</Text></Text>
        </View>
      ) : (
        // Proposals Section
        <FlatList
          data={proposals.slice(0, 3)} // Show only first 3 bids
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.proposalCard}>
              <Text style={styles.bidderName}>Bidder Name: <Text style={styles.value}>{item.name}</Text></Text>
              <Text style={styles.bidderPrice}>Bidder Price: <Text style={styles.value}>{item.price}</Text></Text>
              <Text style={styles.bidderDescription}>Bidder Description: <Text style={styles.value}>{item.description}</Text></Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.messageButton}>
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.assignButton}>
                  <Text style={styles.buttonText}>Assign</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportButton}>
                  <Text style={styles.buttonText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // Prevents cutoff
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center' },

  // Toggle Buttons
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15, backgroundColor: '#f0f0f0', borderRadius: 20, padding: 5 },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeButton: { backgroundColor: '#007bff', borderRadius: 20 },
  toggleText: { fontSize: 16, color: '#555' },
  activeText: { color: '#fff', fontWeight: 'bold' },

  // Work Details Section
  detailsContainer: { padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  descriptionBox: { backgroundColor: '#f5f5f5', padding: 10, borderRadius: 10, marginBottom: 10 },
  descriptionText: { fontSize: 16, color: '#555' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { fontWeight: 'normal', color: '#007bff' },

  // Proposals Section
  proposalCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  bidderName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  bidderPrice: { fontSize: 14, color: '#777', marginVertical: 2 },
  bidderDescription: { fontSize: 14, color: '#555', marginBottom: 5 },
  
  // Buttons Row
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  messageButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 2, alignItems: 'center' },
  assignButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 2, alignItems: 'center' },
  reportButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 2, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default WorkDetailsScreen;
