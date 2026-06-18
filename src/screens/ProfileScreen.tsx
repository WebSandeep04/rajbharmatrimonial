import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Plus, Star, Trash2, Edit2 } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<{name?: string, email?: string, profile_photo?: string} | null>(null);
  
  // Image Gallery State
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/user/images');
      setImages(response.data);
    } catch (err) {
      console.error('Failed to fetch images', err);
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 5 images (1 profile + 4 gallery).');
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            uploadImage(uri);
          }
        }
      }
    );
  };

  const uploadImage = async (uri: string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/user/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.image) {
        if (response.data.image.is_primary) {
          updateLocalProfilePhoto(response.data.image.image_path);
        }
        fetchImages();
      }
    } catch (err) {
      console.error('Failed to upload image', err);
      Alert.alert('Error', 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImage = (id: number) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/user/images/${id}`);
            fetchImages();
            // We should also refresh user data in case the primary image was deleted
            const meRes = await api.get('/user');
            updateLocalProfilePhoto(meRes.data.profile_photo);
          } catch (err) {
            console.error('Failed to delete image', err);
          }
        }
      }
    ]);
  };



  const updateLocalProfilePhoto = async (photoUrl: string) => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userInfo.profile_photo = photoUrl;
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUserData(userInfo);
      }
    } catch (error) {
      console.error('Failed to update local user data', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              
              // Clear AsyncStorage
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userInfo');
              
              // Sign out from Firebase
              if (auth().currentUser) {
                await auth().signOut();
              }
              
              // Sign out from Google
              try {
                await GoogleSignin.signOut();
              } catch (e) {
                // Ignore if not signed in with Google
              }
              
              // Navigate back to Login
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const renderOption = (icon: React.ReactNode, title: string, color: string = colors.textDark) => (
    <TouchableOpacity style={styles.optionRow}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={[styles.optionTitle, { color }]}>{title}</Text>
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const fallbackImage = { uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' };

  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  const pickProfileImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            uploadProfileImage(uri);
          }
        }
      }
    );
  };

  const uploadProfileImage = async (uri: string) => {
    setUploadingProfileImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/user/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.profile_photo) {
        updateLocalProfilePhoto(response.data.profile_photo);
      }
    } catch (err) {
      console.error('Failed to upload profile image', err);
      Alert.alert('Error', 'Failed to update profile picture.');
    } finally {
      setUploadingProfileImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickProfileImage} disabled={uploadingProfileImage}>
            <View>
              <Image 
                source={userData?.profile_photo ? { uri: userData.profile_photo } : fallbackImage}
                style={styles.avatar} 
              />
              <View style={styles.editAvatarBadge}>
                {uploadingProfileImage ? <ActivityIndicator size="small" color="#FFF" /> : <Edit2 size={16} color="#FFF" />}
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.email}>{userData?.email || 'No Email'}</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileSetup' as never, { isEditing: true } as never)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Photos ({images.length}/5)</Text>
            <TouchableOpacity onPress={pickImage} disabled={uploadingImage} style={styles.addPhotoBtn}>
              {uploadingImage ? <ActivityIndicator size="small" color={colors.surface} /> : <Plus size={20} color={colors.surface} />}
            </TouchableOpacity>
          </View>
          
          {images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContainer}>
              {images.map((img) => (
                <View key={img.id} style={styles.galleryImageWrapper}>
                  <Image source={{ uri: img.image_path }} style={styles.galleryImage} />
                  
                  <View style={styles.imageActions}>
                    <TouchableOpacity style={[styles.imageActionBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => deleteImage(img.id)}>
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyGallery}>
              <Text style={{ color: colors.textLight }}>No photos uploaded yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.card}>
            {renderOption(<Settings size={22} color={colors.primary} />, 'Preferences')}
            <View style={styles.divider} />
            {renderOption(<Bell size={22} color={colors.primary} />, 'Notifications')}
            <View style={styles.divider} />
            {renderOption(<Shield size={22} color={colors.primary} />, 'Privacy & Security')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            {renderOption(<HelpCircle size={22} color={colors.textLight} />, 'Help Center')}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <>
                <LogOut size={20} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Log Out</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.secondary,
    marginBottom: 16,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: {
    ...typography.h2,
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 0, // override
  },
  addPhotoBtn: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 20,
  },
  galleryContainer: {
    paddingVertical: 4,
  },
  galleryImageWrapper: {
    width: 120,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },

  imageActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  },
  imageActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyGallery: {
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64, // Align with text
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.2)', // Light red border
    marginBottom: 24,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: colors.border,
    fontSize: 12,
  },
});

export default ProfileScreen;
