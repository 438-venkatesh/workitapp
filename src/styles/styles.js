import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  logo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  searchBar: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  publishButton: { backgroundColor: 'blue', padding: 15, borderRadius: 5, alignItems: 'center' },
  publishButtonText: { color: '#fff', fontWeight: 'bold' },
  categoryBox: { padding: 15, backgroundColor: '#ddd', marginVertical: 5, borderRadius: 5 },
  categoryText: { fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 18, marginRight: 10 },
  profileHeader: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  profileName: { fontSize: 22, fontWeight: 'bold' },
  profileRole: { fontSize: 16, color: 'gray' },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  bidItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#eee', borderRadius: 5, marginTop: 5 },
  bidButton: { backgroundColor: '#00bfff', padding: 5, borderRadius: 5 }
});

export default styles;
