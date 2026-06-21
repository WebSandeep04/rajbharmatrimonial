import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IMessage } from 'react-native-gifted-chat';
import { createOrGetChatRoom, sendMessage, ChatUser } from '../../services/firebaseChat';

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt?: number;
  [key: string]: any;
}

interface ChatState {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: Record<string, IMessage[]>; // Keyed by roomId
  loading: boolean;
  error: string | null;
  initializingRoom: boolean;
}

const initialState: ChatState = {
  rooms: [],
  activeRoomId: null,
  messages: {},
  loading: false,
  error: null,
  initializingRoom: false,
};

export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      // Stub for getting list of rooms
      return [] as ChatRoom[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load chat rooms');
    }
  }
);

// Thunk to initialize or get a chat room
export const initializeChatRoom = createAsyncThunk(
  'chat/initializeChatRoom',
  async ({ currentUser, otherUser }: { currentUser: ChatUser, otherUser: ChatUser }, { rejectWithValue }) => {
    try {
      const roomId = await createOrGetChatRoom(currentUser, otherUser);
      return roomId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to initialize chat room');
    }
  }
);

// Thunk to send a message
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async ({ roomId, messages, receiverId }: { roomId: string, messages: IMessage[], receiverId?: string }, { rejectWithValue }) => {
    try {
      await sendMessage(roomId, messages);
      
      // Notify backend to send FCM push notification
      if (receiverId && messages.length > 0) {
        try {
          const api = require('../../services/api').default;
          await api.post('/chat/notify', {
            receiver_id: receiverId,
            message: messages[0].text || 'Sent an attachment'
          });
        } catch (e) {
          console.log('Failed to trigger chat push notification', e);
        }
      }

      return { roomId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom: (state, action: PayloadAction<string | null>) => {
      state.activeRoomId = action.payload;
    },
    // Used to sync incoming real-time messages from Firebase listeners
    setMessagesForRoom: (state, action: PayloadAction<{ roomId: string; messages: IMessage[] }>) => {
      state.messages[action.payload.roomId] = action.payload.messages;
      state.loading = false;
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(initializeChatRoom.pending, (state) => {
        state.initializingRoom = true;
        state.error = null;
      })
      .addCase(initializeChatRoom.fulfilled, (state, action) => {
        state.initializingRoom = false;
        state.activeRoomId = action.payload;
        if (!state.messages[action.payload]) {
          state.messages[action.payload] = [];
        }
      })
      .addCase(initializeChatRoom.rejected, (state, action) => {
        state.initializingRoom = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveRoom, setMessagesForRoom, setChatLoading, setChatError, setRooms } = chatSlice.actions;
export default chatSlice.reducer;
