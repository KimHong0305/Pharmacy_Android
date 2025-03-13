import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { AddOrderGuest, OrderGuestResponse } from "../../schemas/order.schema";
import api_cartGuest from "../../api/api_cartGuest";

interface OrderState {
  order: OrderGuestResponse | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
  message: null,
};

export const createOrderHomeGuest = createAsyncThunk<
  OrderGuestResponse,
  AddOrderGuest,
  {rejectValue: string}
>('guest/createOrderHomeGuest', async (item, {rejectWithValue}) => {
  try {
    const response = await api.post('/order/guest/home', item);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createOrderCartGuest = createAsyncThunk<
  OrderGuestResponse,
  AddOrderGuest,
  {rejectValue: string}
>('guest/createOrderCartGuest', async (item, {rejectWithValue}) => {
  try {
    const response = await api_cartGuest.post('/order/guest/cart', item);

    return response.data;
  } catch (error : any) {
    return rejectWithValue(error.response.data);
  }
});

export const getOrder = createAsyncThunk<OrderGuestResponse , string,{rejectValue: string}>(
  'guest/getOrder',
  async (orderId, {rejectWithValue}) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);


const orderGuestSlice = createSlice({
  name: 'orderGuest',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Home Guest
      .addCase(createOrderHomeGuest.pending, state => {
        state.loading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(createOrderHomeGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderHomeGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      // Cart Guest
      .addCase(createOrderCartGuest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderCartGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderCartGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      // Get order
      .addCase(getOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      });
  },
});

export default orderGuestSlice.reducer;
