import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Animated, Alert } from 'react-native';
import { CheckCircle2, Heart, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';
import { colors } from '../../theme/colors';
import CustomAlert from '../common/CustomAlert';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_HEIGHT = 400;

const AnimatedActionButton = ({ icon: Icon, color, onPress, isLeft }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.8, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.actionButton, isLeft ? styles.skipButton : styles.likeButton]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon size={28} color={color} fill={isLeft ? 'transparent' : color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const RecommendedProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [premiumAlertVisible, setPremiumAlertVisible] = useState(false);
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

  const [actedProfiles, setActedProfiles] = useState<number[]>([]);

  const handleLike = async (userId: number) => {
    if (actedProfiles.includes(userId)) return;
    try {
      await api.post('/connections/send', { receiver_id: userId });
      setActedProfiles(prev => [...prev, userId]);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.data?.error_code === 'PREMIUM_REQUIRED') {
        setPremiumAlertVisible(true);
      } else {
        console.error('Failed to send connection request', err);
      }
    }
  };

  const handleSkip = (userId: number) => {
    setActedProfiles(prev => [...prev, userId]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
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
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {profiles.map((profile) => {
            if (actedProfiles.includes(profile.id)) return null;

            return (
              <View key={profile.id} style={styles.card}>
                <TouchableOpacity 
                  activeOpacity={0.9} 
                  onPress={() => navigation.navigate('UserProfile', { userId: profile.id })}
                  style={styles.imageContainer}
                >
                  <Image source={{ uri: profile.image }} style={styles.image} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.gradientOverlay}
                  />
                  
                  <View style={styles.topBadges}>
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={14} color={colors.primary} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>

                  <View style={styles.glassmorphismPanel}>
                    <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                    <Text style={styles.detailsText}>{profile.profession}</Text>
                    <Text style={styles.detailsText}>{profile.city}</Text>
                    
                    <View style={styles.bottomRow}>
                      <Text style={styles.matchPercentage}>{profile.matchPercentage}% Match</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Floating Actions */}
                <View style={styles.actionsContainer}>
                  <AnimatedActionButton 
                    icon={X} 
                    color="#6B7280" 
                    isLeft={true} 
                    onPress={() => handleSkip(profile.id)} 
                  />
                  <AnimatedActionButton 
                    icon={Heart} 
                    color={colors.primary} 
                    isLeft={false} 
                    onPress={() => handleLike(profile.id)} 
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <CustomAlert
        visible={premiumAlertVisible}
        title="Premium Required"
        message="You have reached your daily limit for connection requests. Upgrade to Premium to send unlimited requests!"
        onClose={() => setPremiumAlertVisible(false)}
        onConfirm={() => {
          setPremiumAlertVisible(false);
          navigation.navigate('Premium');
        }}
        confirmText="Upgrade"
        cancelText="Cancel"
        showCrownIcon={true}
      />
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
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30, 
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 28,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  topBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
    marginLeft: 4,
  },
  glassmorphismPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 35,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  matchPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accentRoseGold,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    zIndex: 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  likeButton: {
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
});

export default RecommendedProfiles;
