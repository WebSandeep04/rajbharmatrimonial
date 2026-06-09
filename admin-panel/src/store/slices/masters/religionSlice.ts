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

export const fetchReligion = createAsyncThunk(
    'religion/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/religion-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addReligion = createAsyncThunk(
    'religion/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/religion-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateReligion = createAsyncThunk(
    'religion/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/religion-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteReligion = createAsyncThunk(
    'religion/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/religion-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const religionSlice = createSlice({
    name: 'religion',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchReligion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReligion.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchReligion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addReligion.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateReligion.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteReligion.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default religionSlice.reducer;
