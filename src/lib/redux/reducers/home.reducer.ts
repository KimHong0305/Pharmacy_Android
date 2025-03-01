import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { Category, CategoryResponse, ProductResponse, Product, TopCompany, TopCompanyResponse } from '../../schemas/home.schema';

interface HomeState {
    categories: Category[];
    bestSellers: Product[];
    newProducts: Product[];
    topCompanies: TopCompany[];
    loading: boolean;
    error: string | null;
}

const initialState: HomeState = {
    categories: [],
    bestSellers: [],
    newProducts: [],
    topCompanies: [],
    loading: false,
    error: null,
};

export const getCategories = createAsyncThunk(
    'home/getCategories',
    async () => {
        const response = await api.get<CategoryResponse>('/category/null');
        return response.data;
    }
);

export const getBestSellers = createAsyncThunk(
    'home/getBestSellers',
    async () => {
        const response = await api.get<ProductResponse>('/home/user/bestSeller');
        return response.data;
    }
);

export const getNewProducts = createAsyncThunk(
    'home/getNewProducts',
    async () => {
        const response = await api.get<ProductResponse>('/home/user/top20');
        return response.data;
    }
);

export const getTopCompanies = createAsyncThunk(
    'home/getTopCompanies',
    async () => {
        const response = await api.get<TopCompanyResponse>('/home/user/topCompany');
        return response.data;
    }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCategories.pending, state => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.result;
                state.error = null;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            })
            .addCase(getBestSellers.pending, state => {
                state.loading = true;
            })
            .addCase(getBestSellers.fulfilled, (state, action) => {
                state.loading = false;
                state.bestSellers = action.payload.result;
                state.error = null;
            })
            .addCase(getBestSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch best sellers';
            })
            .addCase(getNewProducts.pending, state => {
                state.loading = true;
            })
            .addCase(getNewProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.newProducts = action.payload.result;
                state.error = null;
            })
            .addCase(getNewProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch new products';
            })
            .addCase(getTopCompanies.pending, state => {
                state.loading = true;
            })
            .addCase(getTopCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.topCompanies = action.payload.result;
                state.error = null;
            })
            .addCase(getTopCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch top companies';
            });
    },
});

export default homeSlice.reducer; 