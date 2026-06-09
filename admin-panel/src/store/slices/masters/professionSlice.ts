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

export const fetchProfession = createAsyncThunk(
    'profession/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/profession-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addProfession = createAsyncThunk(
    'profession/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/profession-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateProfession = createAsyncThunk(
    'profession/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/profession-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteProfession = createAsyncThunk(
    'profession/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/profession-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const professionSlice = createSlice({
    name: 'profession',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProfession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfession.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addProfession.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateProfession.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteProfession.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default professionSlice.reducer;
