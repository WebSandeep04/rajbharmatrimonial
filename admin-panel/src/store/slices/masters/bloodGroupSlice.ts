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

export const fetchBloodGroup = createAsyncThunk(
    'blood_group/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/blood_group-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addBloodGroup = createAsyncThunk(
    'blood_group/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/blood_group-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateBloodGroup = createAsyncThunk(
    'blood_group/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/blood_group-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteBloodGroup = createAsyncThunk(
    'blood_group/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/blood_group-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const bloodGroupSlice = createSlice({
    name: 'bloodGroup',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchBloodGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBloodGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBloodGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addBloodGroup.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateBloodGroup.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteBloodGroup.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default bloodGroupSlice.reducer;
