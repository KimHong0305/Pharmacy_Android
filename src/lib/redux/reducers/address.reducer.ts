import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddAddress, AddressResponse, ListAddressResponse } from "../../schemas/address.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";

interface AddressState {
    AddAddress: AddressResponse | null,
    listAddress: ListAddressResponse | null,
    loading: boolean | null,
    error: string | null
}

const initialState : AddressState  = {
    AddAddress: null,
    listAddress: null,
    loading: null,
    error: null
}

export const getListAddress = createAsyncThunk<
ListAddressResponse, 
void, 
{rejectValue: string}>('user/address', async (_, {rejectWithValue}) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await api.get('/address', 
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (error : any) {
        return rejectWithValue(error.response?.data?.message)
    }
})

export const addAddress = createAsyncThunk<AddressResponse, AddAddress, {rejectValue: string}> (
    'user/addAddress', async(item, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await api.post('/address', item, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error : any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        //GET ADDRESS
        .addCase(getListAddress.pending, state => {
            state.loading = true,
            state.error = null
        })
        .addCase(getListAddress.fulfilled, (state, action) => {
            state.listAddress = action.payload,
            state.loading = false
        })
        .addCase(getListAddress.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload || "Failed"
        })
        //ADD ADDRESS
        .addCase(addAddress.pending, state => {
            state.loading = true,
            state.error = null
        })
        .addCase(addAddress.fulfilled, (state, action) => {
            state.loading = false,
            state.AddAddress = action.payload
        })
        .addCase(addAddress.rejected, (state, action) => {
            state.error = action.payload || "Failed"
        })
    }
})

export default addressSlice.reducer;