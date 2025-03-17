import api from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryResponse } from "../../schemas/category.schema";


interface CategoryState {
    loading: boolean;
    subCategories: Category[];
    error: string | null;
}

const initialState: CategoryState = {
    loading: false,
    subCategories: [],
    error: null
};

export const getCategoryDetail = createAsyncThunk<
    CategoryResponse,
    string,
    { rejectValue: string }
>(
    'category/getCategoryDetail',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.get<CategoryResponse>(`/category/${categoryId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch category detail');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCategoryDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryDetail.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
                state.loading = false;
                state.subCategories = action.payload.result || [];
                state.error = null;
            })
            .addCase(getCategoryDetail.rejected, (state, action) => {
                state.loading = false;
                state.subCategories = [];
                state.error = action.payload || 'Failed to fetch category detail';
            });
    },
});

export default categorySlice.reducer;
