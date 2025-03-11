import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api_cartGuest from "../../api/api_cartGuest";
import { AddToCartRequest, AddToCartResponse, CartResponse, UpdateCartRequest, UpdateCartResponse } from "../../schemas/cart.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import { RootState } from "../rootReducer";

interface CartState {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  messageError: string | undefined;
  messageCart: string | null;
  messageUpdate: string | null;
  messageDelete: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  message: null,
  messageError: undefined,
  messageCart: null,
  messageUpdate: null,
  messageDelete: null,
};

export const getCartGuest = createAsyncThunk<
  CartResponse,
  void,
  {rejectValue: string}
>('guest/cart', async (_, {rejectWithValue}) => {
  try {
    const cartResponse = await api_cartGuest.get('/cart/guest');
    return cartResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const addCartGuest = createAsyncThunk<
  AddToCartResponse,
  AddToCartRequest,
  {rejectValue: string}
>('guest/add_cart', async (item, {rejectWithValue}) => {
  try {
    const response = await api_cartGuest.post('/cart/guest', item);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateCartGuest = createAsyncThunk<
  UpdateCartResponse,
  UpdateCartRequest,
  {rejectValue: string}
>('guest/update_cart', async (item, {rejectWithValue}) => {
  try {
    const response = await api_cartGuest.put('/cart/guest', item);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const transfer = createAsyncThunk(
  'transfer',
  async (_, {rejectWithValue, getState}) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const cartResponse = await api_cartGuest.post('/cart/transfer', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Chuyển thành công');
      return cartResponse.data;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getCartUser = createAsyncThunk<CartResponse, void, {rejectValue: string}>(
  'user/cart',
  async (_, {rejectWithValue, getState}) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const cartResponse = await api.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return cartResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addCartUser = createAsyncThunk<
  AddToCartResponse,
  AddToCartRequest,
  {rejectValue: string}
>('user/add_cart', async (item, {rejectWithValue, getState}) => {
  try {
    const state = getState() as RootState;
    const token = state.auth.token;
    const response = await api.post('/cart', item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCartUser = createAsyncThunk<
  UpdateCartResponse,
  UpdateCartRequest,
  {rejectValue: string}
>('user/updateCart', async (itemUpdate, {rejectWithValue, getState}) => {
  try {
    const state = getState() as RootState;
    const token = state.auth.token;
    const response = await api.put('/cart', itemUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    messageClear: state => {
      state.messageError = '';
      state.message = '';
      state.messageCart = '';
      state.messageUpdate = '';
      state.messageDelete = '';
    },
  },
  extraReducers: builder => {
    builder
      // GET CART GUEST
      .addCase(getCartGuest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCartGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      //ADD CART GUEST
      .addCase(addCartGuest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addCartGuest.rejected, (state, action) => {
        state.loading = false;
        state.messageError = action.payload;
      })
      //UPDATE CART GUEST
      .addCase(updateCartGuest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateCartGuest.rejected, (state, action) => {
        state.loading = false;
        state.messageError = action.payload;
      })
      //TRANSFER
      .addCase(transfer.fulfilled, (state, action) => {
        state.loading = false;
        console.log('chuyen thanh cong');
      })
      //GET CART USER
      .addCase(getCartUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartUser.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCartUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      //ADD CART USER
      .addCase(addCartUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addCartUser.rejected, (state, action) => {
        state.loading = false;
        state.messageError = action.payload;
      })
      //UPDATE CART USER
      .addCase(updateCartUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateCartUser.rejected, (state, action) => {
        state.loading = false;
        state.messageError = action.payload;
      });
  },
});

export default cartSlice.reducer;