import api from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ProductResponse,
    Product,
} from "../../schemas/product.chema"

export const getAllProduct = createAsyncThunk<ProductResponse, void, { rejectValue: string }>(
    "product/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ProductResponse>("/product");
            return response.data.result;
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue("Failed to fetch products");
        }
    }
);

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
                state.loading = false;
                state.products = action.payload.content;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export default productSlice.reducer;