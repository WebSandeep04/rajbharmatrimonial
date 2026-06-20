import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TopAppBar from '../components/home/TopAppBar';
import { subscribeToInbox, ChatRoom } from '../services/firebaseChat';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/MessagesScreenStyles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRooms, setChatLoading } from '../store/slices/chatSlice';

const MessagesScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  
  // Use Redux for user info and chat state
  const { userInfo } = useAppSelector((state) => state.auth);
  const { rooms, loading } = useAppSelector((state) => state.chat);
  
  const currentUserId = userInfo?.id?.toString() || null;

  useEffect(() => {
    if (!currentUserId) return;

    dispatch(setChatLoading(true));

    const unsubscribe = subscribeToInbox(currentUserId, (newRooms) => {
      dispatch(setRooms(newRooms));
    });

    return () => unsubscribe();
  }, [currentUserId, dispatch]);

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

export default MessagesScreen;
