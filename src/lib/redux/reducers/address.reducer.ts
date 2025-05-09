import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddAddress, Address, AddressResponse, EditAddress, ListAddressResponse } from "../../schemas/address.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import { getProvinceName, getDistrictName, getVillageName } from "./location.reducer";

interface AddressState {
    AddAddress: AddressResponse | null,
    listAddress: Address[],
    loading: boolean | null,
    error: string | null
}

const initialState: AddressState = {
    AddAddress: null,
    listAddress: [],
    loading: null,
    error: null
};

export const getListAddress = createAsyncThunk<
    ListAddressResponse,
    void,
    { rejectValue: string }
>('user/address', async (_, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.get('/address', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const addAddress = createAsyncThunk<
    AddressResponse,
    AddAddress,
    { rejectValue: string }
>('user/addAddress', async (item, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.post('/address', item, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchAddressWithLocationNames = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>(
    "address/fetchAddressWithLocationNames",
    async (address, { dispatch, rejectWithValue }) => {
        try {
            // console.log("Received address in fetchAddressWithLocationNames:", address);
            if (Array.isArray(address)) {
                const updatedAddresses = await Promise.all(
                    address.map(async (addr) => {
                        const [provinceName, districtName, villageName] = await Promise.all([
                            dispatch(getProvinceName(addr.province)).unwrap(),
                            dispatch(getDistrictName(addr.district)).unwrap(),
                            dispatch(getVillageName(addr.village)).unwrap(),
                        ]);
                        return {
                            ...addr,
                            provinceName,
                            districtName,
                            villageName,
                        };
                    })
                );
                return updatedAddresses;
            } else {
                const [provinceName, districtName, villageName] = await Promise.all([
                    dispatch(getProvinceName(address.province)).unwrap(),
                    dispatch(getDistrictName(address.district)).unwrap(),
                    dispatch(getVillageName(address.village)).unwrap(),
                ]);
                // console.log("✅ Updated single address:", {
                //     ...address,
                //     provinceName,
                //     districtName,
                //     villageName,
                // });
                return {
                    ...address,
                    provinceName,
                    districtName,
                    villageName,
                };
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in fetchAddressWithLocationNames:", error.message);
                return rejectWithValue(error.message);
            } else {
                console.error("Unexpected error:", error);
                return rejectWithValue("An unknown error occurred");
            }
        }
    }
);

export const deleteAddress = createAsyncThunk<string, string, { rejectValue: string }>(
    'address/deleteAddress',
    async (id, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
    
            const response = await api.delete(`/address/${id}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
    
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAddress = createAsyncThunk<
    AddressResponse,
    EditAddress,
    { rejectValue: string }
>('address/updateAddress', async (item, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.put('/address', item, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // GET ADDRESS
            .addCase(getListAddress.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListAddress.fulfilled, (state, action) => {
                state.listAddress = action.payload.result;
                state.loading = false;
            })
            .addCase(getListAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed";
            })
            // ADD ADDRESS
            .addCase(addAddress.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.AddAddress = action.payload;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.error = action.payload || "Failed";
            })
            // DELETE ADDRESS
            .addCase(deleteAddress.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.error = action.payload || "Failed";
            })
            // UPDATE ADDRESS
            .addCase(updateAddress.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.error = action.payload || "Failed";
            })
    }
});

export default addressSlice.reducer;