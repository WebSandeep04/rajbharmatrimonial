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
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: MatchesState = {
  matches: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches?page=${page}`);
      return {
        matches: response.data.data || response.data,
        page,
        // Assume API returns a pagination object, adjust accordingly:
        hasMore: response.data.current_page < response.data.last_page
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
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.matches = action.payload.matches;
        } else {
          // Append new matches, avoiding duplicates
          const newMatches = action.payload.matches.filter(
            (newMatch: MatchProfile) => !state.matches.some(m => m.id === newMatch.id)
          );
          state.matches = [...state.matches, ...newMatches];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(likeProfile.fulfilled, (state, action) => {
        // Optimistically remove the liked profile from the 'potential matches' feed
        state.matches = state.matches.filter(m => m.id !== action.payload);
      });
  },
});

export const { clearMatches, removeMatchLocally } = matchesSlice.actions;
export default matchesSlice.reducer;
