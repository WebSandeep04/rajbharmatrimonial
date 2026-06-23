import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { createPaymentOrder, verifyPaymentSignature } from '../services/payment';
import { CheckCircle2, ChevronLeft, Crown } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../store/hooks';
import { updateUserInfo } from '../store/slices/authSlice';

const PremiumScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const plans = [
    { name: 'Monthly Plan', price: '₹99 / month', recommended: true },
  ];

  const features = [
    'Get Unlimited match',
    'Get Unlimited chat',
    'Get priority visibility',
  ];

  const handlePayment = async () => {
    try {
      const amount = 99; // Base amount for the plan
      const orderData = await createPaymentOrder(amount, 'Premium Membership Monthly Plan');

      if (!orderData.success) {
        Alert.alert('Error', 'Failed to create payment order. Please try again later.');
        return;
      }

      const options = {
        description: 'Premium Membership Monthly Plan',
        currency: orderData.currency,
        key: orderData.key, // Dynamically use the key from backend
        amount: orderData.amount * 100, // Amount is in currency subunits
        name: 'Rajbhar Matrimonial',
        order_id: orderData.order_id,
        prefill: {
          email: 'test@example.com',
          contact: '9999999999',
          name: 'Test User'
        },
        theme: { color: colors.primary }
      };

      RazorpayCheckout.open(options).then(async (data: any) => {
        try {
          const verifyData = await verifyPaymentSignature({
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature
          });

          if (verifyData.success) {
            Alert.alert('Success', 'Payment Successful! Enjoy your Premium features.');
            
            // Update Redux state
            dispatch(updateUserInfo({ is_premium: true }));
            
            // Update AsyncStorage
            const userInfoStr = await AsyncStorage.getItem('userInfo');
            if (userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              userInfo.is_premium = true;
              await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
            
            navigation.goBack();
          } else {
            Alert.alert('Error', 'Payment verification failed on server.');
          }
        } catch (verifyError) {
          console.error(verifyError);
          Alert.alert('Error', 'Payment verification error.');
        }
      }).catch((error: any) => {
        Alert.alert('Error', `Payment Cancelled/Failed: ${error.description || error.message}`);
      });

    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while initiating payment.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.9} onPress={handlePayment}>
          <Text style={styles.subscribeButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
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
    marginTop: 20,
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
    paddingBottom: 40,
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
