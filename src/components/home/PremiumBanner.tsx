import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Crown, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const PremiumBanner = () => {
  const navigation = useNavigation<any>();
  const shimmerValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const startShimmer = () => {
      shimmerValue.setValue(-1);
      Animated.timing(shimmerValue, {
        toValue: 2,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(startShimmer, 3000);
      });
    };
    startShimmer();
  }, [shimmerValue]);

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [-1, 2],
    outputRange: [-width, width * 2],
  });

  const benefits = [
    'Get Unlimited match',
    'Get Unlimited chat',
    'Get priority visibility',
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslateX }, { skewX: '-20deg' }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            style={{ width: '100%', height: '100%' }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>

        <View style={styles.header}>
          <Crown size={28} color="#FFD700" />
          <Text style={styles.title}>Become Premium</Text>
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

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Premium')}
        >
          <Text style={styles.buttonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 24,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 12,
  },
  benefitsContainer: {
    marginBottom: 24,
    zIndex: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PremiumBanner;
