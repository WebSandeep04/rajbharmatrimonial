import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface MatchProfile {
  id: number;
  name: string;
  age: number;
  height: string;
  profession: string;
  location: string;
  profile_photo: string;
  religion?: string;
  caste?: string;
  bio?: string;
  [key: string]: any;
}

interface MatchesState {
  matches: MatchProfile[];
  loadingMatches: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  
  // Connections and Requests
  connections: any[];
  requests: any[];
  loadingConnections: boolean;
  actionLoading: boolean;
}

const initialState: MatchesState = {
  matches: [],
  loadingMatches: false,
  error: null,
  page: 1,
  hasMore: true,
  
  connections: [],
  requests: [],
  loadingConnections: false,
  actionLoading: false,
};

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches?page=${page}`);
      return {
        matches: response.data.data || response.data,
        page,
        hasMore: response.data.current_page ? response.data.current_page < response.data.last_page : false
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch matches');
    }
  }
);

export const likeProfile = createAsyncThunk(
  'matches/likeProfile',
  async (profileId: number, { rejectWithValue }) => {
    try {
      await api.post(`/matches/${profileId}/like`);
      return profileId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to like profile');
    }
  }
);

export const fetchConnectionsAndRequests = createAsyncThunk(
  'matches/fetchConnectionsAndRequests',
  async (_, { rejectWithValue }) => {
    try {
      const [connRes, reqRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/pending')
      ]);
      return {
        connections: connRes.data,
        requests: reqRes.data.received || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch connections data');
    }
  }
);

export const respondToRequest = createAsyncThunk(
  'matches/respondToRequest',
  async ({ connectionId, action }: { connectionId: number, action: 'accept' | 'reject' }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/connections/${connectionId}/respond`, { action });
      // Refresh the connections and requests list
      dispatch(fetchConnectionsAndRequests());
      return { connectionId, action };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to ${action} request`);
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearMatches: (state) => {
      state.matches = [];
      state.page = 1;
      state.hasMore = true;
    },
    removeMatchLocally: (state, action: PayloadAction<number>) => {
      state.matches = state.matches.filter(m => m.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(fetchMatches.pending, (state) => {
        state.loadingMatches = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loadingMatches = false;
        if (action.payload.page === 1) {
          state.matches = action.payload.matches;
        } else {
          const newMatches = action.payload.matches.filter(
            (newMatch: MatchProfile) => !state.matches.some(m => m.id === newMatch.id)
          );
          state.matches = [...state.matches, ...newMatches];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loadingMatches = false;
        state.error = action.payload as string;
      })
      .addCase(likeProfile.fulfilled, (state, action) => {
        state.matches = state.matches.filter(m => m.id !== action.payload);
      })
      
      // Connections
      .addCase(fetchConnectionsAndRequests.pending, (state) => {
        state.loadingConnections = true;
        state.error = null;
      })
      .addCase(fetchConnectionsAndRequests.fulfilled, (state, action) => {
        state.loadingConnections = false;
        state.connections = action.payload.connections;
        state.requests = action.payload.requests;
      })
      .addCase(fetchConnectionsAndRequests.rejected, (state, action) => {
        state.loadingConnections = false;
        state.error = action.payload as string;
      })
      
      // Respond action
      .addCase(respondToRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(respondToRequest.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(respondToRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMatches, removeMatchLocally } = matchesSlice.actions;
export default matchesSlice.reducer;
