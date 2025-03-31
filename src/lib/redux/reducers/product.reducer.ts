import api from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ProductResponse,
    Product,
    ProductDetailResponse
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
            const response = await api.get<ProductResponse>("/product");
            return response.data;
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
            });
    },
});

export default productSlice.reducer; 
