import React, { useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { subscribeToMessages, markRoomAsRead, ChatUser } from '../services/firebaseChat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, Send as SendIcon } from 'lucide-react-native';
import { styles } from '../styles/ChatScreenStyles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { initializeChatRoom, sendChatMessage, setMessagesForRoom, setChatLoading, setChatError } from '../store/slices/chatSlice';

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Read state from Redux
  const { activeRoomId, messages, loading, error, initializingRoom } = useAppSelector(state => state.chat);
  const roomMessages = activeRoomId ? messages[activeRoomId] || [] : [];

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

  // Get current user from Redux
  const { userInfo } = useAppSelector((state) => state.auth);
  
  const currentUser: ChatUser | null = userInfo ? {
    _id: userInfo.id?.toString(),
    name: userInfo.name || 'User',
    avatar: userInfo.avatar || '',
  } : null;

  useEffect(() => {
    if (!targetUser) {
      dispatch(setChatError("No match selected to chat with."));
      return;
    }
    
    if (!currentUser) {
      dispatch(setChatError("Could not load your user profile."));
      return;
    }

    // Initialize the room via Redux thunk
    dispatch(initializeChatRoom({ currentUser, otherUser }));
  }, [dispatch, targetUser?.id, currentUser?._id]);

  useEffect(() => {
    if (!activeRoomId || !currentUser?._id) return;

    dispatch(setChatLoading(true));

    // Mark messages as read for this user
    markRoomAsRead(activeRoomId, currentUser._id).catch(console.error);

    // Subscribe to messages in real-time, dispatch to Redux store
    const unsubscribe = subscribeToMessages(activeRoomId, (newMessages, err) => {
      if (err) {
        dispatch(setChatError("Failed to load messages: " + (err?.message || String(err))));
      } else {
        dispatch(setMessagesForRoom({ roomId: activeRoomId, messages: newMessages }));
      }
    });

    return () => unsubscribe();
  }, [dispatch, activeRoomId, currentUser?._id]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (!activeRoomId) return;
    dispatch(sendChatMessage({ 
      roomId: activeRoomId, 
      messages: newMessages,
      receiverId: targetUser?.id?.toString()
    }));
  }, [dispatch, activeRoomId, targetUser]);

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 12 : 32 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={colors.textDark || '#333'} />
        </TouchableOpacity>
        
        <Image 
          source={{ uri: otherUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} 
          style={styles.headerAvatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUser.name}</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
            {error}
          </Text>
        </View>
      ) : loading || initializingRoom || !currentUser ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <GiftedChat
            messages={roomMessages}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentUser._id!,
              name: currentUser.name,
              avatar: currentUser.avatar,
            }}
            alwaysShowSend
            renderAvatar={null}
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.primary,
                    borderBottomRightRadius: 0,
                    borderRadius: 20,
                    padding: 4,
                  },
                  left: {
                    backgroundColor: '#FFFFFF', // keep left bubble white to contrast with the grey background
                    borderBottomLeftRadius: 0,
                    borderRadius: 20,
                    padding: 4,
                  },
                }}
                textStyle={{
                  right: { color: '#FFF' },
                  left: { color: colors.textDark || '#333' },
                }}
              />
            )}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                primaryStyle={{ alignItems: 'center' }}
              />
            )}
            renderSend={(props) => (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (props.text && props.text.trim().length > 0 && props.onSend) {
                    props.onSend({ text: props.text.trim() } as any, true);
                  }
                }}
              >
                <SendIcon size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            bottomOffset={Platform.OS === 'ios' ? insets.bottom : 0}
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
