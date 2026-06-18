import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Bell, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

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

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.profileSection} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={userData?.profile_photo ? { uri: userData.profile_photo } : fallbackImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.name}>{userData?.name?.split(' ')[0] || 'User'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <View style={styles.premiumBadge}>
          <ShieldCheck size={16} color="#FFFFFF" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Bell size={24} color={colors.textDark} />
          <View style={styles.badgeIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    ...typography.caption,
    color: colors.textLight,
  },
  name: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  premiumText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  badgeIndicator: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 10,
    height: 10,
    backgroundColor: colors.error,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default TopAppBar;
