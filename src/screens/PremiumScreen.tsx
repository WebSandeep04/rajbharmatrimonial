import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, ChevronLeft, Crown } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

const PremiumScreen = () => {
  const navigation = useNavigation<any>();

  const plans = [
    { name: '1 Month', price: '₹999', recommended: false },
    { name: '3 Months', price: '₹2499', recommended: true },
    { name: '6 Months', price: '₹3999', recommended: false },
  ];

  const features = [
    'See exactly who liked your profile',
    'Unlimited direct messages without matching',
    'Access to contact details (phone/email)',
    'Priority profile visibility in search',
    'Advanced search filters (Education, Income)',
    'Premium badge on your profile',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Crown size={48} color="#FFD700" style={{ marginBottom: 16 }} />
          <Text style={styles.heroTitle}>Rajbhar Premium</Text>
          <Text style={styles.heroSubtitle}>Find your perfect match 3x faster with exclusive features.</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Why Upgrade?</Text>
          
          <View style={styles.featuresList}>
            {features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <CheckCircle2 size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Choose a Plan</Text>
          
          {plans.map((plan, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.planCard, plan.recommended && styles.planCardRecommended]}
              activeOpacity={0.8}
            >
              {plan.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Most Popular</Text>
                </View>
              )}
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
              </View>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.9}>
          <Text style={styles.subscribeButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroSection: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  featuresList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 15,
    color: colors.textDark,
    flex: 1,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardRecommended: {
    borderColor: colors.primary,
    backgroundColor: colors.accentBeige,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PremiumScreen;
