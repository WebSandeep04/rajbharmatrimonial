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

export const fetchRashi = createAsyncThunk(
    'rashi/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/rashi-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addRashi = createAsyncThunk(
    'rashi/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/rashi-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateRashi = createAsyncThunk(
    'rashi/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/rashi-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteRashi = createAsyncThunk(
    'rashi/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/rashi-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const rashiSlice = createSlice({
    name: 'rashi',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchRashi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRashi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchRashi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addRashi.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateRashi.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteRashi.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default rashiSlice.reducer;
