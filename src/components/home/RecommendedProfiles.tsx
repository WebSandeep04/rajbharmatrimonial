import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CheckCircle2, MapPin, Briefcase, GraduationCap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {profiles.map((profile) => (
            <View key={profile.id} style={styles.card}>
              <Image source={{ uri: profile.image }} style={styles.image} />
              
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{profile.matchPercentage}% Match</Text>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                  {profile.verified && <CheckCircle2 size={16} color={colors.secondary} style={styles.verifiedIcon} />}
                </View>

                <View style={styles.detailRow}>
                  <Briefcase size={14} color={colors.textLight} />
                  <Text style={styles.detailText}>{profile.profession}</Text>
                </View>

                <View style={styles.detailRow}>
                  <GraduationCap size={14} color={colors.textLight} />
                  <Text style={styles.detailText}>{profile.education}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={14} color={colors.textLight} />
                  <Text style={styles.detailText}>{profile.city}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('UserProfile', { userId: profile.id })}
                  >
                    <Text style={styles.viewButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.interestButton}>
                    <Text style={styles.interestButtonText}>Connect</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Add padding bottom for shadow and spacing
    paddingTop: 8,
  },
  card: {
    width: 280,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    ...typography.h3,
    fontSize: 18,
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    marginRight: 8,
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  interestButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  interestButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default RecommendedProfiles;
