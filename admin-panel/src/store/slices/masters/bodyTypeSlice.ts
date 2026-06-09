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

export const fetchBodyType = createAsyncThunk(
    'body_type/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/body_type-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addBodyType = createAsyncThunk(
    'body_type/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/body_type-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateBodyType = createAsyncThunk(
    'body_type/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/body_type-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteBodyType = createAsyncThunk(
    'body_type/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/body_type-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const bodyTypeSlice = createSlice({
    name: 'bodyType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchBodyType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBodyType.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBodyType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addBodyType.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateBodyType.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteBodyType.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default bodyTypeSlice.reducer;
