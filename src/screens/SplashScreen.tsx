import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { loadUserFromStorage } from '../store/slices/authSlice';
import { styles } from '../styles/SplashScreenStyles';

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const resultAction = await dispatch(loadUserFromStorage());
        if (loadUserFromStorage.fulfilled.match(resultAction)) {
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
  }, [navigation, dispatch]);

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

export default SplashScreen;
