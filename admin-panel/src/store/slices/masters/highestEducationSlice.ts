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

export const fetchHighestEducation = createAsyncThunk(
    'highest_education/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/highest_education-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addHighestEducation = createAsyncThunk(
    'highest_education/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/highest_education-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateHighestEducation = createAsyncThunk(
    'highest_education/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/highest_education-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteHighestEducation = createAsyncThunk(
    'highest_education/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/highest_education-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const highestEducationSlice = createSlice({
    name: 'highestEducation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchHighestEducation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHighestEducation.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchHighestEducation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addHighestEducation.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateHighestEducation.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteHighestEducation.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default highestEducationSlice.reducer;
