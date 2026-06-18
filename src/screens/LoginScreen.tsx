import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '117930909252-3qkj2mt82npkevtphenjb1mpadbcvprb.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
      const firebaseToken = await auth().currentUser?.getIdToken();
      
      if (!firebaseToken) {
        throw new Error('Failed to retrieve Firebase ID token');
      }

      const response = await api.post('/auth/google-login', {
        id_token: firebaseToken,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));

        const user = response.data.user;
        const isProfileComplete = !!user.religion_id;

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: isProfileComplete ? 'Main' : 'ProfileSetup' }],
          })
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // in progress
      } else {
        Alert.alert('Login Failed', error.message || 'An error occurred during login');
        console.error('Login error:', error);
      }
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
    <LinearGradient 
      colors={[colors.background, colors.accentBeige]} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar hidden={true} />
        
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>RM</Text>
            </View>
            <Text style={typography.h2}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey towards a meaningful relationship.
            </Text>
          </View>

          {/* Action Section */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              onPress={onGoogleButtonPress}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <View style={styles.buttonContent}>
                  <View style={styles.gIconContainer}>
                    <Text style={styles.gText}>G</Text>
                  </View>
                  <Text style={styles.buttonText}>Continue with Google</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing, you agree to our </Text>
              <View style={styles.linksRow}>
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
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  logoText: {
    color: colors.secondary,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gIconContainer: {
    marginRight: 12,
  },
  gText: {
    color: '#DB4437',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  footerText: {
    color: colors.textLight,
    fontSize: 13,
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LoginScreen;
