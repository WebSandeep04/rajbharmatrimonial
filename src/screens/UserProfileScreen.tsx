import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Briefcase, GraduationCap, CheckCircle2, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { styles } from '../styles/UserProfileScreenStyles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile, handleConnectAction, resetUserProfile } from '../store/slices/userProfileSlice';

const UserProfileScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const userId = route.params?.userId;
  const dispatch = useAppDispatch();

  const { profile, loading, connectionStatus, connectionId, connecting } = useAppSelector((state) => state.userProfile);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchUserProfile(userId));
      }
      return () => {
        dispatch(resetUserProfile());
      };
    }, [userId, dispatch])
  );

  const handleConnect = () => {
    if (connecting) return;
    dispatch(handleConnectAction({ userId, connectionStatus, connectionId }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>User not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.primary }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedImage(profile.image)}>
            <Image source={{ uri: profile.image }} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            {profile.verified && <CheckCircle2 size={24} color={colors.secondary} style={styles.verifiedIcon} />}
          </View>

          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.locationText}>{profile.city}, {profile.state}</Text>
          </View>

          <View style={styles.quickInfoSection}>
            <View style={styles.quickInfoItem}>
              <Briefcase size={20} color={colors.primary} />
              <Text style={styles.quickInfoText}>{profile.profession}</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <GraduationCap size={20} color={colors.primary} />
              <Text style={styles.quickInfoText}>{profile.education}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {profile.name.split(' ')[0]}</Text>
            <Text style={styles.bioText}>{profile.bio || 'This user has not written a bio yet.'}</Text>
          </View>

          {profile.gallery && profile.gallery.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContainer}>
                {profile.gallery.map((imgUri: string, idx: number) => (
                  <TouchableOpacity key={idx} style={styles.galleryImageWrapper} activeOpacity={0.9} onPress={() => setSelectedImage(imgUri)}>
                    <Image source={{ uri: imgUri }} style={styles.galleryImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Religious Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Religion</Text><Text style={styles.detailValue}>{profile.religion}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Caste</Text><Text style={styles.detailValue}>{profile.caste}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Gotra</Text><Text style={styles.detailValue}>{profile.gotra}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Nakshatra</Text><Text style={styles.detailValue}>{profile.nakshatra}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Rashi</Text><Text style={styles.detailValue}>{profile.rashi}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Manglik</Text><Text style={styles.detailValue}>{profile.manglik_status}</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Profile For</Text><Text style={styles.detailValue}>{profile.profile_created_for}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Marital Status</Text><Text style={styles.detailValue}>{profile.marital_status}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Height</Text><Text style={styles.detailValue}>{profile.height}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Weight</Text><Text style={styles.detailValue}>{profile.weight}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Body Type</Text><Text style={styles.detailValue}>{profile.body_type}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Complexion</Text><Text style={styles.detailValue}>{profile.complexion}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Blood Group</Text><Text style={styles.detailValue}>{profile.blood_group}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Income</Text><Text style={styles.detailValue}>{profile.income}</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Diet</Text><Text style={styles.detailValue}>{profile.diet}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Smoking</Text><Text style={styles.detailValue}>{profile.smoking}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Drinking</Text><Text style={styles.detailValue}>{profile.drinking}</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Family Type</Text><Text style={styles.detailValue}>{profile.family_type}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Brothers</Text><Text style={styles.detailValue}>{profile.no_of_brothers}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Sisters</Text><Text style={styles.detailValue}>{profile.no_of_sisters}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Father Name</Text><Text style={styles.detailValue}>{profile.father_name}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Father Job</Text><Text style={styles.detailValue}>{profile.father_occupation}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Mother Name</Text><Text style={styles.detailValue}>{profile.mother_name}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>Mother Job</Text><Text style={styles.detailValue}>{profile.mother_occupation}</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {connectionStatus !== 'connected' ? (
          <TouchableOpacity
            style={[styles.connectButton, connectionStatus === 'request_sent' && styles.connectButtonDisabled]}
            onPress={handleConnect}
            disabled={connectionStatus === 'request_sent' || connecting}
          >
            <Text style={styles.connectButtonText}>
              {connecting ? 'Processing...' :
                connectionStatus === 'none' ? 'Connect Now' :
                  connectionStatus === 'request_sent' ? 'Request Sent' :
                    connectionStatus === 'request_received' ? 'Accept Request' :
                      'Connected'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: colors.secondary || '#D4A373' }]}
            onPress={() => navigation.navigate('Chat', {
              targetUser: {
                id: userId,
                name: profile.name,
                avatar: profile.image || profile.profile_photo
              }
            })}
          >
            <Text style={styles.connectButtonText}>Send Message</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={!!selectedImage} transparent={true} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelectedImage(null)}>
            <X size={28} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage || '' }} style={styles.fullScreenImage} />
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default UserProfileScreen;
