import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Briefcase, GraduationCap, CheckCircle2, X } from 'lucide-react-native';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const UserProfileScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const userId = route.params?.userId;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, statusRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/connections/status/${userId}`)
        ]);
        setProfile(profileRes.data);
        setConnectionStatus(statusRes.data.status);
        if (statusRes.data.connection_id) setConnectionId(statusRes.data.connection_id);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  const handleConnect = async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      if (connectionStatus === 'none') {
        const res = await api.post('/connections/send', { receiver_id: userId });
        setConnectionStatus('request_sent');
        setConnectionId(res.data.connection.id);
      } else if (connectionStatus === 'request_received') {
        await api.post(`/connections/${connectionId}/respond`, { action: 'accept' });
        setConnectionStatus('connected');
      }
    } catch (err) {
      console.error('Connection action failed', err);
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>User not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
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

      {connectionStatus !== 'connected' && (
        <View style={styles.footer}>
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
        </View>
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    ...typography.h2,
    fontSize: 28,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 8,
  },
  quickInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  quickInfoItem: {
    alignItems: 'center',
  },
  quickInfoText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 12,
  },
  bioText: {
    ...typography.body,
    lineHeight: 24,
  },
  galleryContainer: {
    paddingVertical: 8,
  },
  galleryImageWrapper: {
    width: 140,
    height: 180,
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
    resizeMode: 'cover',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  connectButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default UserProfileScreen;
