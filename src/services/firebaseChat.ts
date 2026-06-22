import firestore from '@react-native-firebase/firestore';

// Types for Chat
export interface ChatUser {
  _id: string | number;
  name?: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: number | Date;
  user: ChatUser;
}

export interface ChatRoom {
  id: string;
  participants: (string | number)[];
  participantDetails: { [key: string]: ChatUser };
  lastMessage: string;
  lastMessageTime: number;
}

/**
 * Generates a unique room ID based on the two participant IDs.
 */
const getRoomId = (userId1: string | number, userId2: string | number) => {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};

/**
 * Creates or retrieves a chat room between two users.
 */
export const createOrGetChatRoom = async (currentUser: ChatUser, targetUser: ChatUser): Promise<string> => {
  const roomId = getRoomId(currentUser._id, targetUser._id);
  const roomRef = firestore().collection('chatRooms').doc(roomId);

  // Using set with merge: true is much safer than get() followed by set() or update().
  // It handles offline cache inconsistencies automatically.
  await roomRef.set({
    id: roomId,
    participants: [currentUser._id.toString(), targetUser._id.toString()],
    participantDetails: {
      [`${currentUser._id.toString()}`]: currentUser,
      [`${targetUser._id.toString()}`]: targetUser,
    },
    // We only update lastMessageTime if it's a new room. 
    // We don't want to overwrite an existing room's lastMessage fields.
  }, { merge: true });

  return roomId;
};

/**
 * Sends a message to a specific room.
 */
export const sendMessage = async (roomId: string, messages: any[]) => {
  const roomRef = firestore().collection('chatRooms').doc(roomId);
  const messagesRef = roomRef.collection('messages');

  const batch = firestore().batch();

  messages.forEach((msg) => {
    const newMessageRef = messagesRef.doc();
    batch.set(newMessageRef, {
      ...msg,
      createdAt: firestore.FieldValue.serverTimestamp(), // Use server time for consistency
    });

    // Update the last message on the room
    batch.update(roomRef, {
      lastMessage: msg.text,
      lastMessageTime: firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
};

/**
 * Subscribes to messages in a specific room.
 */
export const subscribeToMessages = (roomId: string, callback: (messages: any[], error?: any) => void) => {
  return firestore()
    .collection('chatRooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot) {
          console.warn('subscribeToMessages: querySnapshot is null');
          return;
        }
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          
          const data: any = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
            };
          }

          // Convert Firestore Timestamp to JS Date for GiftedChat
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate();
          }

          return data;
        });

        callback(messages);
      },
      (error) => {
        console.error('Error in subscribeToMessages:', error);
        callback([], error);
      }
    );
};

/**
 * Subscribes to all chat rooms for a specific user (Inbox).
 */
export const subscribeToInbox = (userId: string | number, callback: (rooms: ChatRoom[]) => void) => {
  if (!userId) {
    console.warn('subscribeToInbox called with null userId');
    return () => {};
  }
  
  return firestore()
    .collection('chatRooms')
    .where('participants', 'array-contains', userId.toString())
    .onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot) {
          console.warn('subscribeToInbox: querySnapshot is null');
          callback([]);
          return;
        }
        const rooms = querySnapshot.docs.map((doc) => {
          const data = doc.data() as ChatRoom;
          
          // Convert timestamp to number for easy sorting/display
          if (data.lastMessageTime && typeof (data.lastMessageTime as any).toDate === 'function') {
            data.lastMessageTime = (data.lastMessageTime as any).toDate().getTime();
          }
          
          return data;
        });

        // Sort rooms client-side to avoid needing a Firestore composite index
        rooms.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

        callback(rooms);
      },
      (error) => {
        console.error('Error in subscribeToInbox:', error);
        callback([]); // Pass empty array on error to stop the loading spinner
      }
    );
};
