import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { AddOrderGuest, AddOrderUser, HistoryOrderResponse, Order, OrderGuest, OrderGuestResponse, OrderResponse } from "../../schemas/order.schema";
import api_cartGuest from "../../api/api_cartGuest";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderState {
  order: OrderResponse | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
  message: string | null;
  orderGuest: OrderGuest | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  message: null,
  orderGuest: null,
};

//For Guest
export const createOrderHomeGuest = createAsyncThunk<
  OrderResponse,
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
  OrderResponse,
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

//For User
export const createOrderHomeUser = createAsyncThunk<
  OrderResponse, 
  AddOrderUser, 
  {rejectValue: string}
  >('user/createOrderHomeUser', async (item, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/order/home', item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createOrderCartUser = createAsyncThunk<
  OrderResponse,
  AddOrderUser,
  {rejectValue: string}
>('user/createOrderCartUser', async (item, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.post('/order/cart', item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

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

export const getOrder = createAsyncThunk<
  OrderGuestResponse,
  string,
  {rejectValue: string}
>('guest/getOrder', async (orderId, {rejectWithValue}) => {
  try {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const cancelOrder = createAsyncThunk<string, string, { rejectValue: string }>(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.post<{message: string}>(`/order/cancel?orderId=${orderId}`);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy lịch sử đơn hàng');
    }
  }
);

export const receiverOrder = createAsyncThunk<string, string, { rejectValue: string }>(
  'order/receiverOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.put<{message: string}>(`/order/user/receiver/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy lịch sử đơn hàng');
    }
  }
);


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderGuest = null;
    },
  },
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
      // Home User
      .addCase(createOrderHomeUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(createOrderHomeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderHomeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      // Cart User
      .addCase(createOrderCartUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderCartUser.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderCartUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      //History Order For User
      .addCase(getHistoryOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getHistoryOrder.fulfilled, (state, action: PayloadAction<HistoryOrderResponse>) => {
          state.loading = false;
          state.orders = action.payload.result;
        },
      )
      .addCase(getHistoryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể lấy lịch sử đơn hàng';
      })
      // Get order
      .addCase(getOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderGuest = action.payload.result;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      });
  },
});

export default orderSlice.reducer;
export const { resetOrder } = orderSlice.actions;