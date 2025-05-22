import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddOrderShop, Confirm, OrderShopResponse, UserPhone, UserPhoneResponse } from "../../schemas/nurse.schema";

interface NurseState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: UserPhone | null;
  order: OrderShopResponse | null;
}

const initialState: NurseState = {
  loading: false,
  error: null,
  message: null,
  user: null,
  order: null,
};

export const getUserByPhone = createAsyncThunk<UserPhoneResponse, string, { rejectValue: string }>(
    'nurse/getUserByPhone',
    async (phone, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
    
            const response = await api.get<UserPhoneResponse>(`/user/order/shop?phone=${phone}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
    
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user phone');
        }
    }
);

export const createOrderShop = createAsyncThunk<
    OrderShopResponse, 
    AddOrderShop, 
    {rejectValue: string}
    >('nurse/createOrderShop', async (item, {rejectWithValue}) => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.post('/order/nurse', item, {
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

export const confirmOrderShop = createAsyncThunk<
    string, 
    Confirm, 
    {rejectValue: string}
    >('nurse/createOrderShop', async (item, {rejectWithValue}) => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.put('/order/nurse', item, {
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

const nurseSlice = createSlice({
    name: 'nurse',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null;
        },
    },
    extraReducers: builder => {
        builder
        .addCase(getUserByPhone.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserByPhone.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.result;
            state.error = null;
        })
        .addCase(getUserByPhone.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch user phone';
        })
        .addCase(createOrderShop.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createOrderShop.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.error = null;
        })
        .addCase(createOrderShop.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch user phone';
        })
    },
});

export default nurseSlice.reducer; 
export const { clearUser } = nurseSlice.actions;