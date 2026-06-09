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

export const fetchFamilyType = createAsyncThunk(
    'family_type/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/family_type-masters');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const addFamilyType = createAsyncThunk(
    'family_type/add',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/family_type-masters', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateFamilyType = createAsyncThunk(
    'family_type/update',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/family_type-masters/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const deleteFamilyType = createAsyncThunk(
    'family_type/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/family_type-masters/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete');
        }
    }
);

const familyTypeSlice = createSlice({
    name: 'familyType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchFamilyType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFamilyType.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchFamilyType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addFamilyType.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            // Update
            .addCase(updateFamilyType.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteFamilyType.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export default familyTypeSlice.reducer;
