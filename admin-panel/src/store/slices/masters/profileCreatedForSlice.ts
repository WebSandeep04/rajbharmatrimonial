import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';

interface StateType {
    data: any[];
    loading: boolean;
    error: string | null;
}

const initialState: StateType = {
    data: [],
    loading: false,
    error: null,
};

export const fetchProfileCreatedFor = createAsyncThunk(
    'profile_created_for/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/profile_created_for-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addProfileCreatedFor = createAsyncThunk(
    'profile_created_for/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/profile_created_for-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateProfileCreatedFor = createAsyncThunk(
    'profile_created_for/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/profile_created_for-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteProfileCreatedFor = createAsyncThunk(
    'profile_created_for/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/profile_created_for-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const profileCreatedForSlice = createSlice({
    name: 'profileCreatedFor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProfileCreatedFor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileCreatedFor.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfileCreatedFor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addProfileCreatedFor.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateProfileCreatedFor.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteProfileCreatedFor.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default profileCreatedForSlice.reducer;
