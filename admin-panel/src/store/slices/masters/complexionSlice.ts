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

export const fetchComplexion = createAsyncThunk(
    'complexion/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/complexion-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addComplexion = createAsyncThunk(
    'complexion/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/complexion-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateComplexion = createAsyncThunk(
    'complexion/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/complexion-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteComplexion = createAsyncThunk(
    'complexion/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/complexion-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const complexionSlice = createSlice({
    name: 'complexion',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchComplexion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComplexion.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchComplexion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addComplexion.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateComplexion.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteComplexion.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default complexionSlice.reducer;
