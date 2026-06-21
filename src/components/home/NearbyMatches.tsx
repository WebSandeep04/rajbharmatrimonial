import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { colors } from '../../theme/colors';

const NearbyMatches = () => {
  const [nearby, setNearby] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        // Just fetching matches and limiting for display purposes of "nearby"
        const response = await api.get('/matches');
        setNearby(response.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch nearby matches', err);
      }
    };
    fetchNearby();
  }, []);

  if (nearby.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches Near You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {nearby.map((user) => (
          <TouchableOpacity 
            key={user.id} 
            style={styles.card}
            onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
            activeOpacity={0.8}
          >
            <Image source={{ uri: user.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color={colors.textLight} />
                <Text style={styles.locationText}>{user.city}</Text>
              </View>
              <Text style={styles.distance}>2 km away</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 6,
    paddingRight: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  distance: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default NearbyMatches;
