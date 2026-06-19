import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { createOrGetChatRoom, sendMessage, subscribeToMessages, ChatUser } from '../services/firebaseChat';
import TopAppBar from '../components/home/TopAppBar';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // The user we want to chat with, passed via navigation params
  const { targetUser } = route.params || {};

  const otherUser: ChatUser = targetUser ? {
    _id: targetUser.id?.toString(),
    name: targetUser.name || 'Match',
    avatar: targetUser.avatar || '',
  } : {
    _id: 'unknown',
    name: 'Unknown',
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUser({
            _id: userInfo.id?.toString(),
            name: userInfo.name || 'User',
            avatar: userInfo.avatar || '',
          });
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!targetUser || !currentUser) {
      return;
    }

    const initializeChat = async () => {
      try {
        const id = await createOrGetChatRoom(currentUser, otherUser);
        setRoomId(id);
      } catch (error: any) {
        console.error("Error creating chat room:", error);
        setErrorMsg("Failed to initialize chat: " + (error?.message || String(error)));
        setLoading(false);
      }
    };

    initializeChat();
  }, [targetUser, currentUser]);

  useEffect(() => {
    if (!roomId) return;

    // Subscribe to messages in real-time
    const unsubscribe = subscribeToMessages(roomId, (newMessages, error) => {
      if (error) {
        setErrorMsg("Failed to load messages: " + (error?.message || String(error)));
      } else {
        setMessages(newMessages);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (!roomId) return;
    sendMessage(roomId, newMessages);
  }, [roomId]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* We could create a custom header here, or reuse TopAppBar */}
      <View style={styles.header}>
        {/* Simple back button placeholder */}
        <TopAppBar />
      </View>

      {errorMsg ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
            {errorMsg}
          </Text>
        </View>
      ) : loading || !currentUser ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentUser._id,
              name: currentUser.name,
              avatar: currentUser.avatar,
            }}
            isSendButtonAlwaysVisible
            isUserAvatarVisible


          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    // Styling for the header area
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ChatScreen;
