import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const HeroBanner = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, '#630f28']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Your Perfect Match May Be One Click Away</Text>
        <Text style={styles.subtitle}>
          Discover compatible profiles based on your preferences
        </Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Explore Matches</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    borderRadius: 20,
    padding: 24,
  },
  title: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    ...typography.subtitle,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HeroBanner;
