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

export const fetchGotra = createAsyncThunk(
    'gotra/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/gotra-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addGotra = createAsyncThunk(
    'gotra/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/gotra-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateGotra = createAsyncThunk(
    'gotra/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/gotra-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteGotra = createAsyncThunk(
    'gotra/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/gotra-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const gotraSlice = createSlice({
    name: 'gotra',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchGotra.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGotra.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchGotra.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addGotra.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateGotra.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteGotra.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default gotraSlice.reducer;
