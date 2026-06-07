import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import api from '../services/api';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '117930909252-3qkj2mt82npkevtphenjb1mpadbcvprb.apps.googleusercontent.com', // Web Client ID from Firebase Console
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential in Firebase
      await auth().signInWithCredential(googleCredential);
      
      // Retrieve the Firebase ID Token (this is what the Laravel Firebase Admin SDK expects)
      const firebaseToken = await auth().currentUser?.getIdToken();
      
      if (!firebaseToken) {
        throw new Error('Failed to retrieve Firebase ID token');
      }

      // Send the Firebase token to your Laravel backend
      const response = await api.post('/auth/google-login', {
        id_token: firebaseToken,
      });

      if (response.data && response.data.token) {
        // Store Sanctum token securely
        await AsyncStorage.setItem('userToken', response.data.token);
        
        // Store user profile details (optional)
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));

        // Navigate to Home
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('Error', 'Play services not available');
      } else {
        // some other error happened
        Alert.alert('Login Failed', error.message || 'An error occurred during login');
        console.error('Login error:', error);
      }
      
      // Attempt to sign out of google if something failed locally
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>RM</Text>
          </View>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Rajbhar Matrimonial</Text>
          <Text style={styles.tagline}>
            A premium, trusted, and elegant platform to find your perfect life partner.
          </Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={onGoogleButtonPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View style={styles.buttonContent}>
                {/* Normally an SVG Google logo goes here */}
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.buttonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> and </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#666666',
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  linkText: {
    color: '#E53935',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default LoginScreen;
