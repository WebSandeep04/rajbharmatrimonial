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

export const fetchIncomeRange = createAsyncThunk(
    'income_range/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/income_range-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addIncomeRange = createAsyncThunk(
    'income_range/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/income_range-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateIncomeRange = createAsyncThunk(
    'income_range/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/income_range-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteIncomeRange = createAsyncThunk(
    'income_range/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/income_range-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const incomeRangeSlice = createSlice({
    name: 'incomeRange',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchIncomeRange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomeRange.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchIncomeRange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addIncomeRange.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateIncomeRange.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteIncomeRange.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default incomeRangeSlice.reducer;
