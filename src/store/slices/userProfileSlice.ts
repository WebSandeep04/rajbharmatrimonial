import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface UserProfileState {
  profile: any | null;
  loading: boolean;
  error: string | null;
  connectionStatus: string;
  connectionId: number | null;
  connecting: boolean;
}

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
  connectionStatus: 'none',
  connectionId: null,
  connecting: false,
};

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const [profileRes, statusRes] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/connections/status/${userId}`)
      ]);
      return {
        profile: profileRes.data,
        connectionStatus: statusRes.data.status,
        connectionId: statusRes.data.connection_id || null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const handleConnectAction = createAsyncThunk(
  'userProfile/handleConnect',
  async (
    { userId, connectionStatus, connectionId }: { userId: string, connectionStatus: string, connectionId: number | null },
    { rejectWithValue }
  ) => {
    try {
      if (connectionStatus === 'none') {
        const res = await api.post('/connections/send', { receiver_id: userId });
        return { status: 'request_sent', connectionId: res.data.connection.id };
      } else if (connectionStatus === 'request_received' && connectionId) {
        await api.post(`/connections/${connectionId}/respond`, { action: 'accept' });
        return { status: 'connected', connectionId };
      }
      return { status: connectionStatus, connectionId };
    } catch (error: any) {
      if (error.response?.data?.error_code === 'PREMIUM_REQUIRED') {
        return rejectWithValue('PREMIUM_REQUIRED');
      }
      return rejectWithValue(error.message || 'Connection action failed');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.connectionStatus = 'none';
      state.connectionId = null;
      state.connecting = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.connectionStatus = action.payload.connectionStatus;
        state.connectionId = action.payload.connectionId;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(handleConnectAction.pending, (state) => {
        state.connecting = true;
      })
      .addCase(handleConnectAction.fulfilled, (state, action) => {
        state.connecting = false;
        state.connectionStatus = action.payload.status;
        state.connectionId = action.payload.connectionId;
      })
      .addCase(handleConnectAction.rejected, (state, action) => {
        state.connecting = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
