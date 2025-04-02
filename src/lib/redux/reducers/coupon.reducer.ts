import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Coupon, CouponUserResponse } from '../../schemas/coupon.schema';

interface CouponState {
    loading: boolean;
    coupons: Coupon[];
    error: string | null;
}

const initialState: CouponState = {
    loading: false,
    coupons: [],
    error: null,
};

export const getCouponUser = createAsyncThunk<CouponUserResponse, void, { rejectValue: string }>(
  'coupon/getCouponUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<CouponUserResponse>('/coupon/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user coupon');
    }
  }
);

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // GET COUPON USER
            .addCase(getCouponUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCouponUser.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.result || [];
            })
            .addCase(getCouponUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch user coupon';
            })
    },
});

export default couponSlice.reducer;
  