import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { CheckCircle2, MapPin, Briefcase, GraduationCap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const RecommendedProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches');
        setProfiles(response.data);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const handleConnect = async (userId: number) => {
    if (sentRequests.includes(userId)) return;
    try {
      await api.post('/connections/send', { receiver_id: userId });
      setSentRequests(prev => [...prev, userId]);
    } catch (err) {
      console.error('Failed to send connection request', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recommended Matches</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ margin: 20 }} />
      ) : profiles.length === 0 ? (
        <Text style={{ textAlign: 'center', margin: 20, color: colors.textLight }}>No matches found yet.</Text>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          snapToInterval={CARD_WIDTH + 16} // card width + margin
          decelerationRate="fast"
          snapToAlignment="center"
        >
          {profiles.map((profile) => {
            const hasSent = sentRequests.includes(profile.id);
            return (
              <View key={profile.id} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: profile.image }} style={styles.image} />
                  <LinearGradient
                    colors={colors.gradientOverlay}
                    style={styles.imageOverlay}
                  />
                  
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{profile.matchPercentage}% Match</Text>
                  </View>

                  <View style={styles.imageContent}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                      {profile.verified && <CheckCircle2 size={18} color={colors.secondary} style={styles.verifiedIcon} />}
                    </View>
                  </View>
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.detailRow}>
                    <Briefcase size={16} color={colors.textLight} />
                    <Text style={styles.detailText} numberOfLines={1}>{profile.profession}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <GraduationCap size={16} color={colors.textLight} />
                    <Text style={styles.detailText} numberOfLines={1}>{profile.education}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MapPin size={16} color={colors.textLight} />
                    <Text style={styles.detailText} numberOfLines={1}>{profile.city}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => navigation.navigate('UserProfile', { userId: profile.id })}
                    >
                      <Text style={styles.viewButtonText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.interestButton, hasSent && { backgroundColor: colors.border }]}
                      onPress={() => handleConnect(profile.id)}
                      disabled={hasSent}
                    >
                      <Text style={[styles.interestButtonText, hasSent && { color: colors.textDark }]}>
                        {hasSent ? 'Sent' : 'Connect'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24, 
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.h2,
    fontSize: 22,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  infoContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 12,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.primaryLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  interestButton: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  interestButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RecommendedProfiles;
