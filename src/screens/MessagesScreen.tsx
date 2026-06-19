import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TopAppBar from '../components/home/TopAppBar';
import { subscribeToInbox, ChatRoom } from '../services/firebaseChat';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessagesScreen = () => {
  const navigation = useNavigation<any>();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUserId(userInfo.id?.toString() || null);
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToInbox(currentUserId, (newRooms) => {
      setRooms(newRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const renderItem = ({ item }: { item: ChatRoom }) => {
    // Find the other participant's details
    const otherParticipantId = item.participants.find(id => id.toString() !== currentUserId);
    const otherParticipant = otherParticipantId && item.participantDetails 
      ? item.participantDetails[otherParticipantId] 
      : { _id: 'unknown', name: 'Unknown User' };

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { targetUser: { id: otherParticipant._id, name: otherParticipant.name, avatar: otherParticipant.avatar } })}
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{otherParticipant.name?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{otherParticipant.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'Start a conversation'}</Text>
        </View>
        {item.lastMessageTime && (
          <Text style={styles.timeText}>
            {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeArea}>
      <TopAppBar />
      <View style={styles.container}>
        <Text style={[typography.h2, styles.headerTitle]}>Messages</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet.</Text>
            <Text style={styles.emptySubtext}>When you match with someone, you can start chatting here!</Text>
          </View>
        ) : (
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
    backgroundColor: colors.background,
  },
  headerTitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textLight,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  }
});

export default MessagesScreen;
