import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const quote = "Success is not final, failure is not fatal.";
  const words = quote.split(" ");
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Show the animation for 3 seconds before displaying the actual content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        if (index < words.length) {
          setDisplayedText((prev) => prev + " " + words[index]);
          setIndex((prevIndex) => prevIndex + 1);
        } else {
          setDisplayedText("");
          setIndex(0);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [index, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView 
          source={require('../../assets/animations/start.json')} 
          autoPlay 
          loop
          style={styles.loadingAnimation} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>
        <Text style={styles.work}>Work</Text>
        <Text style={styles.it}> It</Text>
      </Text>

      <LottieView 
        source={require('../../assets/animations/splash.json')} 
        autoPlay 
        loop 
        style={styles.animation} 
      />

      <Text style={styles.quoteText}>{displayedText}</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoText: {
    fontSize: 60,
    fontFamily: 'Bold', // Applying Bold font
    marginBottom: 20,
  },
  work: { color: 'black' },
  it: { color: '#007bff' },
  animation: { width: 300, height: 300 },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Medium', // Applying Medium font
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: 200,
    marginTop: 30, // Added margin to move buttons downward
  },
  loginButton: { 
    backgroundColor: '#333',
    marginTop: 10, },
    buttonText: {
      color: '#FFFFFF', // Ensures button text is white
      fontSize: 16,
      fontFamily: 'Bold', // Uses the imported bold font
    },

});

