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

export const fetchDiet = createAsyncThunk(
    'diet/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/diet-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addDiet = createAsyncThunk(
    'diet/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/diet-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateDiet = createAsyncThunk(
    'diet/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/diet-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteDiet = createAsyncThunk(
    'diet/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/diet-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const dietSlice = createSlice({
    name: 'diet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchDiet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiet.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDiet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addDiet.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateDiet.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteDiet.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default dietSlice.reducer;
