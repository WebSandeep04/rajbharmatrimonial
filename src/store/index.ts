import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import matchesReducer from './slices/matchesSlice';
import chatReducer from './slices/chatSlice';
import profileSetupReducer from './slices/profileSetupSlice';
import homeReducer from './slices/homeSlice';
import searchReducer from './slices/searchSlice';
import userProfileReducer from './slices/userProfileSlice';
import myProfileReducer from './slices/myProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchesReducer,
    chat: chatReducer,
    profileSetup: profileSetupReducer,
    home: homeReducer,
    search: searchReducer,
    userProfile: userProfileReducer,
    myProfile: myProfileReducer,
  },
  // Middleware can be customized here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful for React Native + AsyncStorage if non-serializable data is passed
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
