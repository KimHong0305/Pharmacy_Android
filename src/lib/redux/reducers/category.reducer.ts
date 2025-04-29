import api from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryResponse } from "../../schemas/category.schema";

interface CategoryState {
    loading: boolean;
    rootCategories: Category[];
    subCategories: Category[];
    error: string | null;
}

const initialState: CategoryState = {
    loading: false,
    rootCategories: [],
    subCategories: [],
    error: null
};

export const getCategories = createAsyncThunk(
  'category/root',
  async () => {
    const response = await api.get<CategoryResponse>('/category/null');
    return response.data.result;
  },
);

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
        //ROOT CATEGORY
            .addCase(getCategories.pending, state => {
            state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.rootCategories = action.payload;
            state.error = null;
            })
            .addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch categories';
            })
        //SUB CATEGORIES
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
