import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IMessage } from 'react-native-gifted-chat';

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
}

const initialState: ChatState = {
  rooms: [],
  activeRoomId: null,
  messages: {},
  loading: false,
  error: null,
};

// Example thunk for fetching rooms
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, you'd fetch this from Firebase or your API
      // const rooms = await getRoomsFromFirebase();
      return [] as ChatRoom[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load chat rooms');
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
    },
    addMessageToRoom: (state, action: PayloadAction<{ roomId: string; message: IMessage }>) => {
      if (!state.messages[action.payload.roomId]) {
        state.messages[action.payload.roomId] = [];
      }
      // Insert at the beginning assuming GiftedChat handles inverted lists
      state.messages[action.payload.roomId].unshift(action.payload.message);
    },
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
      });
  },
});

export const { setActiveRoom, setMessagesForRoom, addMessageToRoom } = chatSlice.actions;
export default chatSlice.reducer;
