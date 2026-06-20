import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface SearchFilters {
  religion_id: string; caste_id: string; gotra_id: string; nakshatra_id: string; rashi_id: string;
  state_id: string; city_id: string; marital_status_id: string; profile_created_for_id: string;
  highest_education_id: string; profession_id: string; income_range_id: string;
  body_type_id: string; complexion_id: string; blood_group_id: string;
  diet_id: string; family_type_id: string; smoking: string; drinking: string; manglik_status: string;
}

const initialFilters: SearchFilters = {
  religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
  state_id: '', city_id: '', marital_status_id: '', profile_created_for_id: '',
  highest_education_id: '', profession_id: '', income_range_id: '',
  body_type_id: '', complexion_id: '', blood_group_id: '',
  diet_id: '', family_type_id: '', smoking: '', drinking: '', manglik_status: ''
};

interface SearchState {
  masterDataOptions: Record<string, any[]>;
  loadingMasterData: boolean;
  filters: SearchFilters;
  profiles: any[];
  searching: boolean;
  error: string | null;
}

const initialState: SearchState = {
  masterDataOptions: {},
  loadingMasterData: false,
  filters: initialFilters,
  profiles: [],
  searching: false,
  error: null,
};

export const fetchSearchMasterData = createAsyncThunk(
  'search/fetchMasterData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/master-data');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load filter options');
    }
  }
);

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      const response = await api.post('/matches/search', filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search matches');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchMasterData.pending, (state) => {
        state.loadingMasterData = true;
      })
      .addCase(fetchSearchMasterData.fulfilled, (state, action) => {
        state.loadingMasterData = false;
        state.masterDataOptions = action.payload;
      })
      .addCase(fetchSearchMasterData.rejected, (state, action) => {
        state.loadingMasterData = false;
        state.error = action.payload as string;
      })
      .addCase(performSearch.pending, (state) => {
        state.searching = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.searching = false;
        state.profiles = action.payload;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = searchSlice.actions;
export default searchSlice.reducer;
