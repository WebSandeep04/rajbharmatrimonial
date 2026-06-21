import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Heart, Sparkles, MessageCircle, Crown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';

const ACTIONS = [
  { id: 'discover', title: 'Discover Matches', subtitle: 'Profiles selected for you', icon: Heart, color: '#E91E63', screen: 'Matches' },
  { id: 'interests', title: 'Interests', subtitle: 'People who liked you', icon: Sparkles, color: '#9C27B0', screen: 'Matches' },
  { id: 'chats', title: 'Chats', subtitle: 'Continue conversations', icon: MessageCircle, color: '#3B82F6', screen: 'Chat' },
  { id: 'premium', title: 'Premium', subtitle: 'Unlock exclusive features', icon: Crown, color: '#F59E0B', screen: 'Premium' },
];

const ActionCard = ({ item }: { item: typeof ACTIONS[0] }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<any>();

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Navigate if screen exists, or log for now
    if (item.screen) {
      try {
        navigation.navigate(item.screen);
      } catch (e) {
        console.log(`Navigation to ${item.screen} failed.`);
      }
    }
  };

  const IconComponent = item.icon;

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} onPress={handlePress}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <IconComponent size={28} color={item.color} />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const QuickActions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {ACTIONS.map((item) => (
          <ActionCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QuickActions;
