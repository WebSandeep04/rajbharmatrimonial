import React from 'react';
import { StyleSheet, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopAppBar from '../components/home/TopAppBar';
import HeroBanner from '../components/home/HeroBanner';
import QuickStats from '../components/home/QuickStats';
import RecommendedProfiles from '../components/home/RecommendedProfiles';
import SuccessStories from '../components/home/SuccessStories';
import PremiumBanner from '../components/home/PremiumBanner';
import RecentActivity from '../components/home/RecentActivity';
import { colors } from '../theme/colors';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      <TopAppBar />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroBanner />
        <QuickStats />
        <RecommendedProfiles />
        <PremiumBanner />
        <SuccessStories />
        <RecentActivity />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
