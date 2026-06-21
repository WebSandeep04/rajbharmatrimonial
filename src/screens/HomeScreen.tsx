import React, { useEffect, useRef } from 'react';
import { ScrollView, StatusBar, View, Animated } from 'react-native';
import TopAppBar from '../components/home/TopAppBar';
import HeroBanner from '../components/home/HeroBanner';
import QuickActions from '../components/home/QuickActions';
import RecommendedProfiles from '../components/home/RecommendedProfiles';
import SuccessStories from '../components/home/SuccessStories';
import NearbyMatches from '../components/home/NearbyMatches';
import PremiumBanner from '../components/home/PremiumBanner';
import { styles } from '../styles/HomeScreenStyles';

const FadeInView = ({ children, delay = 0 }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
    ]).start();
  }, [fadeAnim, translateY, delay]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <TopAppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FadeInView delay={100}>
          <HeroBanner />
        </FadeInView>

        <FadeInView delay={200}>
          <QuickActions />
        </FadeInView>

        <FadeInView delay={300}>
          <RecommendedProfiles />
        </FadeInView>

        <FadeInView delay={400}>
          <NearbyMatches />
        </FadeInView>

        <FadeInView delay={500}>
          <PremiumBanner />
        </FadeInView>

        <FadeInView delay={600}>
          <SuccessStories />
        </FadeInView>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;
