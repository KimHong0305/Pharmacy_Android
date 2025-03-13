import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from "../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryOrderResponse, OrderResponse } from "../../schemas/order.schema"

interface OrderState {
  orders: OrderResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const getHistoryOrder = createAsyncThunk<HistoryOrderResponse, void, { rejectValue: string }>(
  'order/getHistoryOrder',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<HistoryOrderResponse>('/order/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy lịch sử đơn hàng');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHistoryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistoryOrder.fulfilled, (state, action: PayloadAction<HistoryOrderResponse>) => {
        state.loading = false;
        state.orders = action.payload.result;
      })
      .addCase(getHistoryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể lấy lịch sử đơn hàng';
      });
  },
});

export default orderSlice.reducer;
