import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginWithGoogle } from '../store/slices/authSlice';
import { styles } from '../styles/LoginScreenStyles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '117930909252-3qkj2mt82npkevtphenjb1mpadbcvprb.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      const resultAction = await dispatch(loginWithGoogle());
      if (loginWithGoogle.fulfilled.match(resultAction)) {
        const user = resultAction.payload.userInfo;
        const isProfileComplete = !!user.religion_id;

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: isProfileComplete ? 'Main' : 'ProfileSetup' }],
          })
        );
      } else {
        if (resultAction.payload) {
          Alert.alert('Login Failed', resultAction.payload as string);
        }
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
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

export default LoginScreen;
