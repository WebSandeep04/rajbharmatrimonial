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

export const fetchNakshatra = createAsyncThunk(
    'nakshatra/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/nakshatra-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addNakshatra = createAsyncThunk(
    'nakshatra/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/nakshatra-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateNakshatra = createAsyncThunk(
    'nakshatra/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/nakshatra-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteNakshatra = createAsyncThunk(
    'nakshatra/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/nakshatra-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const nakshatraSlice = createSlice({
    name: 'nakshatra',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNakshatra.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNakshatra.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchNakshatra.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addNakshatra.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateNakshatra.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteNakshatra.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default nakshatraSlice.reducer;
