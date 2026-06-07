import React from 'react';
import { StyleSheet, ScrollView, StatusBar, View } from 'react-native';
import TopAppBar from '../components/home/TopAppBar';
import HeroBanner from '../components/home/HeroBanner';
import RecommendedProfiles from '../components/home/RecommendedProfiles';
import SuccessStories from '../components/home/SuccessStories';
import PremiumBanner from '../components/home/PremiumBanner';
import RecentActivity from '../components/home/RecentActivity';
import { colors } from '../theme/colors';

const HomeScreen = () => {
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
