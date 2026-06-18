import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TopAppBar from '../components/home/TopAppBar';

const MessagesScreen = () => {
  return (
    <View style={styles.safeArea}>
      <TopAppBar />
      <View style={styles.container}>
        <Text style={typography.h2}>Your Messages</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default MessagesScreen;
