import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { ProductDetailResponse } from '../../schemas/product.schema';

interface ProductState {
    productDetail: ProductDetailResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    productDetail: null,
    loading: false,
    error: null,
};

export const getProductDetail = createAsyncThunk(
    'product/getDetail',
    async (productId: string) => {
        const response = await api.get<ProductDetailResponse>(`/product/${productId}`);
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearProductDetail: (state) => {
            state.productDetail = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getProductDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetail = action.payload;
                state.error = null;
            })
            .addCase(getProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.productDetail = null;
                state.error = action.error.message || 'Failed to fetch product detail';
            });
    },
});

export const { clearProductDetail } = productSlice.actions;
export default productSlice.reducer; 