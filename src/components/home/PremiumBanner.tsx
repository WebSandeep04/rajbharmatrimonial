import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const PremiumBanner = () => {
  const benefits = [
    'Unlimited Interests',
    'Direct Messaging',
    'Contact Details Access',
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, '#B8860B']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Crown size={28} color={colors.primary} />
          <Text style={styles.title}>Unlock Premium Features</Text>
        </View>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Check size={14} color={colors.primary} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 5,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginLeft: 12,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  benefitText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PremiumBanner;
