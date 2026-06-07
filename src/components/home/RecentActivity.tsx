import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Eye, Heart, UserPlus } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ACTIVITIES = [
  { id: '1', type: 'view', text: 'Someone viewed your profile', time: '2 hours ago', icon: <Eye size={18} color={colors.primary} /> },
  { id: '2', type: 'interest', text: 'New interest received', time: '5 hours ago', icon: <Heart size={18} color={colors.secondary} /> },
  { id: '3', type: 'match', text: 'Match recommendation added', time: '1 day ago', icon: <UserPlus size={18} color={colors.primary} /> },
];

const RecentActivity = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      <View style={styles.timeline}>
        {ACTIVITIES.map((activity, index) => (
          <View key={activity.id} style={styles.activityRow}>
            <View style={styles.iconContainer}>
              {activity.icon}
            </View>
            {index !== ACTIVITIES.length - 1 && <View style={styles.line} />}
            <View style={styles.content}>
              <Text style={styles.text}>{activity.text}</Text>
              <Text style={styles.time}>{activity.time}</Text>
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
    marginBottom: 40,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 20,
  },
  timeline: {
    marginLeft: 8,
  },
  activityRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentBeige,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 36,
    left: 17,
    width: 2,
    height: 30, // Adjust based on margin
    backgroundColor: colors.border,
    zIndex: 0,
  },
  content: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  text: {
    ...typography.body,
    fontWeight: '500',
  },
  time: {
    ...typography.caption,
    marginTop: 4,
  },
});

export default RecentActivity;
