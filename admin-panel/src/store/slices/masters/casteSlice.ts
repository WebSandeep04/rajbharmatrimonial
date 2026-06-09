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

export const fetchCaste = createAsyncThunk(
    'caste/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/caste-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addCaste = createAsyncThunk(
    'caste/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/caste-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateCaste = createAsyncThunk(
    'caste/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/caste-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteCaste = createAsyncThunk(
    'caste/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/caste-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const casteSlice = createSlice({
    name: 'caste',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCaste.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaste.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCaste.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addCaste.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateCaste.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteCaste.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default casteSlice.reducer;
