import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus margins

const STORIES = [
  {
    id: '1',
    coupleNames: 'Rahul & Neha',
    year: '2025',
    story: 'We found each other through this app and got married in 8 months. The premium features made everything so easy.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    coupleNames: 'Amit & Priya',
    year: '2024',
    story: 'Thank you for helping us find each other. The platform is truly trustworthy and elegant. My soulmate was just a click away!',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const AnimatedHeart = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Heart size={16} color={colors.primaryLight} fill={colors.primaryLight} />
    </Animated.View>
  );
};

const SuccessStories = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Success Stories 💍</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 16} 
        decelerationRate="fast"
      >
        {STORIES.map((story) => (
          <View key={story.id} style={styles.card}>
            <Image source={{ uri: story.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.overlayGradient}
            />
            <View style={styles.overlay}>
              <View style={styles.nameRow}>
                <Text style={styles.coupleNames}>{story.coupleNames}</Text>
                <AnimatedHeart />
              </View>
              <Text style={styles.year}>Married in {story.year}</Text>
              <Text style={styles.storyText} numberOfLines={3}>"{story.story}"</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    marginHorizontal: 8,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 8,
  },
  coupleNames: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  year: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  storyText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default SuccessStories;
