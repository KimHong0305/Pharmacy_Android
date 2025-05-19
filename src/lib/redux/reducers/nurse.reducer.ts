import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPhone, UserPhoneResponse } from "../../schemas/nurse.schema";

interface NurseState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: UserPhone | null;
}

const initialState: NurseState = {
  loading: false,
  error: null,
  message: null,
  user: null,
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

const nurseSlice = createSlice({
    name: 'nurse',
    initialState,
    reducers: {
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
    },
});

export default nurseSlice.reducer; 