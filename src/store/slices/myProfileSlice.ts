import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { updateUserInfo } from './authSlice';

interface MyProfileState {
  images: any[];
  loadingImages: boolean;
  uploadingImage: boolean;
  uploadingProfileImage: boolean;
  error: string | null;
}

const initialState: MyProfileState = {
  images: [],
  loadingImages: false,
  uploadingImage: false,
  uploadingProfileImage: false,
  error: null,
};

export const fetchMyImages = createAsyncThunk(
  'myProfile/fetchMyImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/images');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch images');
    }
  }
);

export const uploadMyImage = createAsyncThunk(
  'myProfile/uploadMyImage',
  async (uri: string, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/user/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.image) {
        if (response.data.image.is_primary) {
          dispatch(updateUserInfo({ profile_photo: response.data.image.image_path }));
        }
        dispatch(fetchMyImages());
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

export const deleteMyImage = createAsyncThunk(
  'myProfile/deleteMyImage',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/user/images/${id}`);
      dispatch(fetchMyImages());
      // Refresh user data in case the primary image was deleted
      const meRes = await api.get('/user');
      dispatch(updateUserInfo({ profile_photo: meRes.data.profile_photo }));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete image');
    }
  }
);

export const uploadMyProfileImage = createAsyncThunk(
  'myProfile/uploadMyProfileImage',
  async (uri: string, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/user/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.profile_photo) {
        dispatch(updateUserInfo({ profile_photo: response.data.profile_photo }));
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload profile image');
    }
  }
);

const myProfileSlice = createSlice({
  name: 'myProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyImages.pending, (state) => {
        state.loadingImages = true;
        state.error = null;
      })
      .addCase(fetchMyImages.fulfilled, (state, action) => {
        state.loadingImages = false;
        state.images = action.payload;
      })
      .addCase(fetchMyImages.rejected, (state, action) => {
        state.loadingImages = false;
        state.error = action.payload as string;
      })
      
      .addCase(uploadMyImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadMyImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadMyImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload as string;
      })
      
      .addCase(uploadMyProfileImage.pending, (state) => {
        state.uploadingProfileImage = true;
        state.error = null;
      })
      .addCase(uploadMyProfileImage.fulfilled, (state) => {
        state.uploadingProfileImage = false;
      })
      .addCase(uploadMyProfileImage.rejected, (state, action) => {
        state.uploadingProfileImage = false;
        state.error = action.payload as string;
      });
  },
});

export default myProfileSlice.reducer;
