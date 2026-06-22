import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';

const TopAppBar = () => {
  const [userData, setUserData] = useState<{ name?: string, profile_photo?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          setUserData(JSON.parse(userInfo));
        }
      } catch (error) {
        console.error('Failed to load user info', error);
      }
    };
    fetchUser();
  }, []);

  const navigation = useNavigation<any>();
  const fallbackImage = { uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' };

  const handleNotificationPress = async () => {
    try {
      const pref = await AsyncStorage.getItem('notificationsEnabled');
      
      if (pref === 'false') {
        // Notifications were explicitly turned off in Profile
        Alert.alert(
          'Notifications Disabled',
          'You have disabled push notifications. Would you like to turn them on to receive updates?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Turn On', 
              onPress: async () => {
                await AsyncStorage.setItem('notificationsEnabled', 'true');
                const { NotificationService } = require('../../services/NotificationService');
                await NotificationService.requestUserPermission();
                navigation.navigate('Notifications');
              }
            }
          ]
        );
      } else {
        // Check system permission if not explicitly disabled
        const { NotificationService } = require('../../services/NotificationService');
        await NotificationService.requestUserPermission();
        navigation.navigate('Notifications');
      }
    } catch (e) {
      console.log('Error handling notification press', e);
      navigation.navigate('Notifications');
    }
  };

  return (
    <LinearGradient
      colors={[colors.accentBeige, colors.surface]}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.profileSection} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={userData?.profile_photo ? { uri: userData.profile_photo } : fallbackImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.name}>{userData?.name?.split(' ')[0] || 'User'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
          <Bell size={24} color={colors.textDark} />
          <View style={styles.badgeIndicator} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  badgeIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default TopAppBar;
