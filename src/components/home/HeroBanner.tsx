import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 40; 

const SLIDES = [
  {
    id: 1,
    title: 'Find Your Perfect Match ❤️',
    subtitle: 'Discover profiles that truly match your values.',
    buttonText: 'Explore Now',
  },
  {
    id: 2,
    title: 'Verified Profiles ✓',
    subtitle: 'Connect with genuine and trusted members.',
    buttonText: 'Get Verified',
  },
  {
    id: 3,
    title: 'Success Stories 💍',
    subtitle: 'Your soulmate may be just one click away.',
    buttonText: 'Read Stories',
  }
];

const HeroBanner = () => {
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= SLIDES.length) {
        nextIndex = 0;
      }
      scrollViewRef.current?.scrollTo({ x: nextIndex * SLIDE_WIDTH, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={{ width: SLIDE_WIDTH }}>
            <LinearGradient
              colors={colors.gradientPrimary}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.circle1} />
              <View style={styles.circle2} />
      
              <View style={styles.content}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  gradient: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 180,
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
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '800',
    fontSize: 22,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#D1D5DB',
  },
});

export default HeroBanner;
