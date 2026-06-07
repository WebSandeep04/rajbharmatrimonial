import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Bell, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const TopAppBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.name}>Sandeep</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.premiumBadge}>
          <ShieldCheck size={16} color="#FFFFFF" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Bell size={24} color={colors.textDark} />
          <View style={styles.badgeIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    ...typography.caption,
    color: colors.textLight,
  },
  name: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  premiumText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  badgeIndicator: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 10,
    height: 10,
    backgroundColor: colors.error,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default TopAppBar;
