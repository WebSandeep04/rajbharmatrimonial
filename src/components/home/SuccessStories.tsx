import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const STORIES = [
  {
    id: '1',
    coupleNames: 'Rohan & Sneha',
    year: '2025',
    story: 'We met on Rajbhar Matrimonial and instantly connected over our shared love for travel and food. Getting married was the best decision of our lives.',
    image: 'https://images.unsplash.com/photo-1583939000340-c692c81fb048?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    coupleNames: 'Amit & Priya',
    year: '2024',
    story: 'Thank you for helping us find each other. The platform is truly trustworthy and the premium features helped me find my perfect match.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const SuccessStories = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Success Stories</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {STORIES.map((story) => (
          <View key={story.id} style={styles.card}>
            <Image source={{ uri: story.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.coupleNames}>{story.coupleNames}</Text>
              <Text style={styles.year}>Married in {story.year}</Text>
              <Text style={styles.storyText} numberOfLines={3}>{story.story}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: 300,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 21, 56, 0.75)', // Maroon overlay
    justifyContent: 'flex-end',
    padding: 16,
  },
  coupleNames: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  year: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 8,
  },
  storyText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SuccessStories;
