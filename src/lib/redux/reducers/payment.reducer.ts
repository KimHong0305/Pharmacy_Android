import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/api';
import { callbackRequest, MomoResponse, ZaloPayRequest, ZaloPayResponse } from "../../schemas/payment.schema";

interface PaymentState {
    loading: boolean,
    error: string | null,
    orderurl: string | null,
    payUrl: string | null,
}

const initialState : PaymentState = {
    loading: false,
    error: null,
    orderurl: null,
    payUrl: null,
}

export const createPaymentZaloPay = createAsyncThunk<
    ZaloPayResponse,
    ZaloPayRequest,
    {rejectValue: string}
>('user/createZALOPAY', async (item, {rejectWithValue}) => {
    try {
        const response = await api.post(
        `/zalopay/create-payment?orderId=` + item.orderId
        );
        return response.data.result;
    } catch (error: any) {
        return rejectWithValue(error.response.data);
    }
});

export const createPaymentMomo = createAsyncThunk<
    MomoResponse,
    ZaloPayRequest,
    {rejectValue: string}
>('user/createMomo', async (item, {rejectWithValue}) => {
    try {
        const response = await api.post(
        `/momo/create-payment?orderId=` + item.orderId
        );
        return response.data.result;
    } catch (error: any) {
        return rejectWithValue(error.response.data);
    }
});

export const updateCallBack = createAsyncThunk<
    string,
    callbackRequest,
    {rejectValue: string}
>('user/createMomo', async (item, {rejectWithValue}) => {
    try {
        const response = await api.post('/callback', item );
        return response.data.result;
    } catch (error: any) {
        return rejectWithValue(error.response.data);
    }
});


const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentZaloPay.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentZaloPay.fulfilled, (state, action) => {
                state.loading = false;
                state.orderurl = action.payload.orderurl;
            })
            .addCase(createPaymentZaloPay.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(createPaymentMomo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentMomo.fulfilled, (state, action) => {
                state.loading = false;
                state.payUrl = action.payload.payUrl;
            })
            .addCase(createPaymentMomo.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default paymentSlice.reducer;
