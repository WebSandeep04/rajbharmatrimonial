import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import TopAppBar from '../components/home/TopAppBar';
import HeroBanner from '../components/home/HeroBanner';
import RecommendedProfiles from '../components/home/RecommendedProfiles';
import SuccessStories from '../components/home/SuccessStories';
import PremiumBanner from '../components/home/PremiumBanner';
import RecentActivity from '../components/home/RecentActivity';
import { styles } from '../styles/HomeScreenStyles';
import { useAppSelector } from '../store/hooks';

const HomeScreen = () => {
  // Example of using the home slice
  const { isRefreshing } = useAppSelector((state) => state.home);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <TopAppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroBanner />
        <RecommendedProfiles />
        <PremiumBanner />
        <SuccessStories />
        <RecentActivity />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
