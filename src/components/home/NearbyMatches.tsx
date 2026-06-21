import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNearbyMatches } from '../../store/slices/nearbyMatchesSlice';
import { colors } from '../../theme/colors';
import { styles } from '../../styles/NearbyMatchesStyles';

const NearbyMatches = () => {
  const dispatch = useAppDispatch();
  const { nearby, loading } = useAppSelector((state) => state.nearbyMatches);
  const navigation = useNavigation<any>();

  useEffect(() => {
    dispatch(fetchNearbyMatches());
  }, [dispatch]);

  if (loading || nearby.length === 0) return null;

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
                <Text style={styles.locationText}>{user.city || user.city_name || 'Nearby'}</Text>
              </View>
              <Text style={styles.distance}>Nearby Match</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default NearbyMatches;
