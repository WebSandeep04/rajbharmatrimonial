import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Navigate to Main
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          );
        } else {
          // Navigate to Login
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        }
      } catch (e) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    };

    // Simulate a brief loading time for the splash screen
    setTimeout(checkToken, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Placeholder for Logo */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.title}>Rajbhar Matrimonial</Text>
        <Text style={styles.tagline}>Find your perfect match today</Text>
      </View>
      <ActivityIndicator size="large" color="#E53935" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 50,
  },
});

export default SplashScreen;
