import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import { styles } from '../styles/ProfileScreenStyles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { 
  fetchMyImages, 
  uploadMyImage, 
  deleteMyImage, 
  uploadMyProfileImage 
} from '../store/slices/myProfileSlice';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const { 
    images, 
    uploadingImage, 
    uploadingProfileImage 
  } = useAppSelector((state) => state.myProfile);
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    dispatch(fetchMyImages());
  }, [dispatch]);

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
        if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            dispatch(uploadMyImage(uri));
          }
        }
      }
    );
  };

  const deleteImage = (id: number) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          dispatch(deleteMyImage(id));
        }
      }
    ]);
  };

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
            dispatch(uploadMyProfileImage(uri));
          }
        }
      }
    );
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
              
              await dispatch(logoutUser()).unwrap();
              
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
                source={userInfo?.profile_photo ? { uri: userInfo.profile_photo } : fallbackImage}
                style={styles.avatar} 
              />
              <View style={styles.editAvatarBadge}>
                {uploadingProfileImage ? <ActivityIndicator size="small" color="#FFF" /> : <Edit2 size={16} color="#FFF" />}
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
          <Text style={styles.email}>{userInfo?.email || 'No Email'}</Text>
          
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

export default ProfileScreen;
