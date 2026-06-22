import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface UserInfo {
  id?: number | string;
  name?: string;
  email?: string;
  profile_photo?: string;
  avatar?: string;
  religion_id?: number | string;
  is_premium?: boolean;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  userInfo: null,
  isAuthenticated: false,
  loading: true, // Initial loading state while checking AsyncStorage
  error: null,
};

// Thunk to load auth state from AsyncStorage on app startup
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      
      if (token && userInfoStr) {
        const userInfo: UserInfo = JSON.parse(userInfoStr);
        return { token, userInfo };
      }
      return rejectWithValue('No user session found');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      if (auth().currentUser) {
        await auth().signOut();
      }
      
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore if not signed in with Google
      }
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle Google Login
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
      const firebaseToken = await auth().currentUser?.getIdToken();
      
      if (!firebaseToken) {
        throw new Error('Failed to retrieve Firebase ID token');
      }

      // We need to import api here or assume it's imported at the top. Wait, we didn't import api in authSlice.ts!
      // Let me just add the import at the top later, but for now I'll use require to be safe, or just import it.
      const api = require('../../services/api').default;
      const response = await api.post('/auth/google-login', {
        id_token: firebaseToken,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return { token: response.data.token, userInfo: response.data.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // Clean up on failure
      try { await GoogleSignin.signOut(); } catch (e) {}
      return rejectWithValue(error.message || 'An error occurred during login');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Standard synchronous actions
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userInfo: UserInfo }>
    ) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.isAuthenticated = true;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadUserFromStorage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.token = null;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.userInfo = null;
        state.isAuthenticated = false;
      })
      // loginWithGoogle
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, updateUserInfo, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
