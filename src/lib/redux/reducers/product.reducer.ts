import api from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ProductResponse,
    Product,
    ProductDetailResponse,
    GetProductByCategoryParams
} from "../../schemas/product.schema"

interface ProductState {
    productDetail: ProductDetailResponse | null;
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    productDetail: null,
    products: [],
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

export const getAllProduct = createAsyncThunk<ProductResponse, void, { rejectValue: string }>(
    "product/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const page = 0;
            const size = 300;
            const response = await api.get<ProductResponse>(`/product?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue("Failed to fetch products");
        }
    }
);

export const getProductByCategory = createAsyncThunk<
    ProductResponse,
    GetProductByCategoryParams,
    { rejectValue: string }
>(
    'product/getProductByCategory',
    async (params, { rejectWithValue }) => {
        const {
            page = 0,
            size = 1000,
            categoryId,
            sortOrder = 'asc',
        } = params;

        try {
            const { data } = await api.get(`/product/category/${categoryId}`, {
                params: { page, size, sortOrder },
        });
        return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue("Failed to fetch products");
        }
    }
);
  

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //PRODUCT DETAIL
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
            })
            //SEARCH PRODUCT
             .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.products = action.payload.result.content;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            })
            //PRODUCT BY CATEGORY
            .addCase(getProductByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductByCategory.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.products = action.payload.result.content;
            })
            .addCase(getProductByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export default productSlice.reducer; 
