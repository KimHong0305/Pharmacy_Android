import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddWhistlistResponse, Whistlist, WhistlistResponse } from '../../schemas/whistlist.schema';

interface CouponState {
    loading: boolean;
    error: string | null;
    whistlist: Whistlist[],
}

const initialState: CouponState = {
    loading: false,
    error: null,
    whistlist: [],
};

export const addWhistlist = createAsyncThunk<AddWhistlistResponse, string, { rejectValue: string }>(
  'whistlist/addWhistlist',
  async (productId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.post('/whistlist', {productId},
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

export const getWhistlist = createAsyncThunk<WhistlistResponse, void, { rejectValue: string }>(
    'whistlist/getWhistlist',
    async (_, { rejectWithValue }) => {
      try {
        const token = await AsyncStorage.getItem('token');
  
        const response = await api.get<WhistlistResponse>('/whistlist',
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

export const deleteWhistlist = createAsyncThunk<string, string, { rejectValue: string }>(
  'whistlist/deleteWhistlist',
  async (id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.delete(`/whistlist/${id}`,
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


const whistlistSlice = createSlice({
    name: 'whistlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // #region ADD WHISTLIST
            .addCase(addWhistlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addWhistlist.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addWhistlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add whistlist';
            })
        
        // #region GET WHISTLIST
            .addCase(getWhistlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWhistlist.fulfilled, (state, action) => {
                state.loading = false;
                state.whistlist = action.payload.result;
            })
            .addCase(getWhistlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get whistlist';
            })

        // #region DELETE WHISTLIST
          .addCase(deleteWhistlist.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteWhistlist.fulfilled, (state, action) => {
              state.loading = false;
          })
          .addCase(deleteWhistlist.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to get whistlist';
          })
    },
});

export default whistlistSlice.reducer;
  