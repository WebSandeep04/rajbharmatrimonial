import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const HeroBanner = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientPrimary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.content}>
          <Text style={styles.title}>Your Perfect Match May Be One Click Away</Text>
          <Text style={styles.subtitle}>
            Discover compatible profiles based on your preferences
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.buttonText}>Explore Matches</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  gradient: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -20,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -30,
  },
  content: {
    padding: 24,
    zIndex: 2,
  },
  title: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 34,
    fontSize: 26,
  },
  subtitle: {
    ...typography.subtitle,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 28,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default HeroBanner;
