import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Users, Eye, MessageSquare } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QuickStats = () => {
  const stats = [
    { id: '1', title: 'New Matches', count: '12', icon: <Users size={24} color={colors.primary} /> },
    { id: '2', title: 'Profile Views', count: '48', icon: <Eye size={24} color={colors.secondary} /> },
    { id: '3', title: 'Interests', count: '5', icon: <Heart size={24} color={colors.error} /> },
    { id: '4', title: 'Messages', count: '3', icon: <MessageSquare size={24} color="#4A90E2" /> },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.card}>
            <View style={styles.iconContainer}>{stat.icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.count}>{stat.count}</Text>
              <Text style={styles.title}>{stat.title}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  title: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});

export default QuickStats;
