import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HomeState {
  isRefreshing: boolean;
  // Add other feed state here when needed
}

const initialState: HomeState = {
  isRefreshing: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
  },
});

export const { setRefreshing } = homeSlice.actions;
export default homeSlice.reducer;
