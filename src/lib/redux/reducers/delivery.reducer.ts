import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ServerParam, Service, ServiceFeeResponse, ServiceResponse } from "../../schemas/delivery.schema";

interface DeliveryState {
  loading: boolean;
  error: string | null;
  service: ServiceResponse | null;
  fee: ServiceFeeResponse | null;
}

const initialState: DeliveryState = {
  loading: false,
  error: null,
  service: null,
  fee: null,
};

export const getService = createAsyncThunk<ServiceResponse, string, { rejectValue: string }>(
    'delivery/getService',
    async (to_district, { rejectWithValue }) => {
        try {
    
            const response = await api.post('/delivery/service', {to_district},); 
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getServiceFee = createAsyncThunk<ServiceFeeResponse, ServerParam, { rejectValue: string }>(
    'delivery/getServiceFee',
    async (info, { rejectWithValue }) => {
        try {
    
            const response = await api.post('/delivery/calculate/fee', info,); 
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        resetFee(state) {
            state.fee = null;
        },
    },
    extraReducers: builder => {
        builder
        .addCase(getService.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getService.fulfilled, (state, action) => {
            state.loading = false;
            state.service = action.payload;
            state.error = null;
        })
        .addCase(getService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch root feedback';
        })
        .addCase(getServiceFee.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getServiceFee.fulfilled, (state, action) => {
            state.loading = false;
            state.fee = action.payload;
            state.error = null;
        })
        .addCase(getServiceFee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch root feedback';
        })
    },
});

export default deliverySlice.reducer; 
export const { resetFee } = deliverySlice.actions;