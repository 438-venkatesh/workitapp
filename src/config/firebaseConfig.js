// Import Firebase modules using the modular syntax
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7267c4OURyx4YJNKgL7m3j2mfkLm7vk",
  authDomain: "notifications-98c4e.firebaseapp.com",
  projectId: "notifications-98c4e",
  storageBucket: "notifications-98c4e.appspot.com",
  messagingSenderId: "760055487731",
  appId: "1:760055487731:web:0d08d7104e80d18eb5ab86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };