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

export const fetchMaritalStatus = createAsyncThunk(
    'marital_status/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/marital_status-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addMaritalStatus = createAsyncThunk(
    'marital_status/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/marital_status-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateMaritalStatus = createAsyncThunk(
    'marital_status/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/marital_status-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteMaritalStatus = createAsyncThunk(
    'marital_status/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/marital_status-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const maritalStatusSlice = createSlice({
    name: 'maritalStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMaritalStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaritalStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchMaritalStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addMaritalStatus.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateMaritalStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteMaritalStatus.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default maritalStatusSlice.reducer;
