import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FeedBackResponse } from "../../schemas/feedback.schema";
import api from "../../api/api";

interface FeedBackState {
    listRootFeedBackByProductId: FeedBackResponse | null,
    listReplayFeedBackByProductId : FeedBackResponse | null,
    loading: boolean | null,
    error: string | null
}

const initialState : FeedBackState  = {
    listRootFeedBackByProductId: null,
    listReplayFeedBackByProductId: null,
    loading: null,
    error: null
}

export const getRootListFeedBackByProductId = createAsyncThunk(
  'feedback/product/root',
  async (productId: string) => {
    const response = await api.get<FeedBackResponse>(
      `/feedback/null/${productId}`,
    );
    return response.data;
  },
);

export const getReplayListFeedBackByProductId = createAsyncThunk(
  'feedback/product/replay',
  async (parentId: string) => {
    const response = await api.get<FeedBackResponse>(
      `/feedback/${parentId}`,
    );
    return response.data;
  },
);

const feedBackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //ROOT FEEDBACK
      .addCase(getRootListFeedBackByProductId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRootListFeedBackByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.listRootFeedBackByProductId = action.payload;
        state.error = null;
      })
      .addCase(getRootListFeedBackByProductId.rejected, (state, action) => {
        state.loading = false;
        state.listRootFeedBackByProductId = null;
        state.error = action.error.message || 'Failed to fetch root feedback';
      })
      //REPLAY FEEDBACK
      .addCase(getReplayListFeedBackByProductId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReplayListFeedBackByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.listReplayFeedBackByProductId = action.payload;
        state.error = null;
      })
      .addCase(getReplayListFeedBackByProductId.rejected, (state, action) => {
        state.loading = false;
        state.listReplayFeedBackByProductId = null;
        state.error = action.error.message || 'Failed to fetch root feedback';
      });
  },
});

export default feedBackSlice.reducer; 

