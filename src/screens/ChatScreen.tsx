import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { createOrGetChatRoom, sendMessage, subscribeToMessages, ChatUser } from '../services/firebaseChat';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Send as SendIcon } from 'lucide-react-native';

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
        } else {
          setErrorMsg("Could not load your user profile.");
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
        setErrorMsg("Error loading user profile.");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!targetUser) {
      setErrorMsg("No match selected to chat with.");
      setLoading(false);
      return;
    }
    
    if (!currentUser) {
      return; // wait for currentUser to be fetched
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
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentUser._id,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark || '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  }
});

export default ChatScreen;
