import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import api from '../services/api';

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      } else {
        // Fetch from API if not in storage
        const response = await api.get('/profile');
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
          await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // 1. Call Laravel Logout API
      try {
        await api.post('/logout');
      } catch (apiError) {
        console.error('Laravel logout error:', apiError);
        // Continue logout flow locally even if server fails
      }

      // 2. Remove Local Token
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');

      // 3. Firebase Sign Out
      try {
        await auth().signOut();
      } catch (firebaseError) {
        console.error('Firebase sign out error:', firebaseError);
      }

      // 4. Google Sign Out
      try {
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.error('Google sign out error:', googleError);
      }

      // 5. Redirect to Login Screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      Alert.alert('Logout Error', 'An unexpected error occurred while logging out.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{userInfo?.name || 'Loading...'}</Text>
          <Text style={styles.userEmail}>{userInfo?.email || 'Loading...'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#E53935" />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#E53935',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#757575',
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E53935',
    backgroundColor: 'transparent',
    minWidth: 200,
    alignItems: 'center',
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
