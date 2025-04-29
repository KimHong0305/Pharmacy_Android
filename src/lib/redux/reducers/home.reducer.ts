import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { Category, CategoryResponse } from '../../schemas/category.schema';
import { Company, CompanyResponse } from '../../schemas/company.schema';
import { HomeProduct, HomeResponse } from '../../schemas/home.schema';

interface HomeState {
    categories: Category[];
    bestSellers: HomeProduct[];
    newProducts: HomeProduct[];
    topCompanies: Company[];
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

export const getHome = createAsyncThunk(
  'home/user',
  async () => {
    const response = await api.get<HomeResponse>('/home/user');
    return response.data.result;
  },
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
          .addCase(getHome.pending, state => {
            state.loading = true;
          })
          .addCase(getHome.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload.categories;
            state.newProducts = action.payload.newProducts;
            state.bestSellers = action.payload.topProducts;
            state.topCompanies = action.payload.topCompanies
            state.error = null;
          })
          .addCase(getHome.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch categories';
          });
    },
});

export default homeSlice.reducer; 