import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface ProfileSetupState {
  masterDataOptions: Record<string, any[]>;
  loadingMasterData: boolean;
  savingProfile: boolean;
  error: string | null;
}

const initialState: ProfileSetupState = {
  masterDataOptions: {},
  loadingMasterData: true,
  savingProfile: false,
  error: null,
};

export const fetchMasterDataAndProfile = createAsyncThunk(
  'profileSetup/fetchMasterDataAndProfile',
  async (_, { rejectWithValue }) => {
    try {
      const [masterRes, profileRes] = await Promise.all([
        api.get('/master-data'),
        api.get('/profile')
      ]);
      return {
        masterData: masterRes.data,
        profile: profileRes.data?.user || null
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load options');
    }
  }
);

export const saveProfileData = createAsyncThunk(
  'profileSetup/saveProfileData',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save profile');
    }
  }
);

const profileSetupSlice = createSlice({
  name: 'profileSetup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterDataAndProfile.pending, (state) => {
        state.loadingMasterData = true;
        state.error = null;
      })
      .addCase(fetchMasterDataAndProfile.fulfilled, (state, action) => {
        state.loadingMasterData = false;
        state.masterDataOptions = action.payload.masterData;
      })
      .addCase(fetchMasterDataAndProfile.rejected, (state, action) => {
        state.loadingMasterData = false;
        state.error = action.payload as string;
      })
      .addCase(saveProfileData.pending, (state) => {
        state.savingProfile = true;
      })
      .addCase(saveProfileData.fulfilled, (state) => {
        state.savingProfile = false;
      })
      .addCase(saveProfileData.rejected, (state, action) => {
        state.savingProfile = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSetupSlice.reducer;
