import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/api';
import { VNPAYRequest, VNPAYResponse } from "../../schemas/vnpay.schema";

interface VNPAYState {
  loading: boolean,
  error: string | null,
  paymentUrl: string | null
}

const initialState : VNPAYState = {
    loading: false,
    error: null,
    paymentUrl: null
}
export const createPaymentVNPay = createAsyncThunk<
  VNPAYResponse,
  VNPAYRequest,
  {rejectValue: string}
>('user/createVNPay', async (item, {rejectWithValue}) => {
  try {
    const response = await api.post(
      `/vnpay/create-payment?orderId=` + item.orderId
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const vnPaySlice = createSlice({
    name: "VNPay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentVNPay.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createPaymentVNPay.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUrl = action.payload.result;
            })
            .addCase(createPaymentVNPay.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default vnPaySlice.reducer;
