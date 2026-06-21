import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface NearbyMatchesState {
  nearby: any[];
  loading: boolean;
  error: string | null;
}

const initialState: NearbyMatchesState = {
  nearby: [],
  loading: false,
  error: null,
};

export const fetchNearbyMatches = createAsyncThunk(
  'nearbyMatches/fetchNearbyMatches',
  async (_, { rejectWithValue }) => {
    try {
      const [profileRes, matchesRes, masterRes] = await Promise.all([
        api.get('/profile'),
        api.get('/matches'),
        api.get('/master-data')
      ]);

      const user = profileRes.data?.user || profileRes.data || {};
      const masterData = masterRes.data || {};

      let userCityName = '';
      if (user.city_id && masterData.city) {
         const cityObj = masterData.city.find((c: any) => String(c.id) === String(user.city_id));
         if (cityObj) userCityName = cityObj.name;
      }

      let userStateName = '';
      if (user.state_id && masterData.state) {
         const stateObj = masterData.state.find((s: any) => String(s.id) === String(user.state_id));
         if (stateObj) userStateName = stateObj.name;
      }

      const filtered = matchesRes.data.filter((profile: any) => {
        if (!userCityName && !userStateName) return false;
        
        const pCity = profile.city ? String(profile.city).toLowerCase().trim() : '';
        const pState = profile.state ? String(profile.state).toLowerCase().trim() : '';
        
        const uCity = userCityName.toLowerCase().trim();
        const uState = userStateName.toLowerCase().trim();

        return (uCity && pCity === uCity) || (uState && pState === uState);
      });

      return filtered.slice(0, 5);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch nearby matches');
    }
  }
);

const nearbyMatchesSlice = createSlice({
  name: 'nearbyMatches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.nearby = action.payload;
      })
      .addCase(fetchNearbyMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default nearbyMatchesSlice.reducer;
