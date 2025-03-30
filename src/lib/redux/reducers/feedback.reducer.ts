import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/api";
import { Feedback, FeedbackResponse } from '../../schemas/feedback.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CouponState {
    loading: boolean;
    feedbacks: Feedback[];
    error: string | null;
}

const initialState: CouponState = {
    loading: false,
    feedbacks: [],
    error: null,
};

export const getRootFeedback = createAsyncThunk(
    'feedback/getRootFeedback',
    async (productId: string) => {
        const response = await api.get<FeedbackResponse>(`/feedback/null/${productId}`);
        return response.data;
    }
);

export const getReplayFeedback = createAsyncThunk(
    'feedback/getReplayFeedback',
    async (feedbackId: string) => {
        const response = await api.get<FeedbackResponse>(`/feedback/${feedbackId}`);
        return { feedbackId, replies: response.data.result };
    }
);

export const getFeedbackByUser = createAsyncThunk<FeedbackResponse, void, { rejectValue: string }>(
    'feedback/getFeedbackByUser',
    async (_, { rejectWithValue }) => {
      try {
        const token = await AsyncStorage.getItem('token');
  
        const response = await api.get<FeedbackResponse>('/feedback/user',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch user feedback');
      }
    }
  );

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // GET ROOT FEEDBACK
            .addCase(getRootFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRootFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload.result || [];
            })
        // GET REPLY FEEDBACK
            .addCase(getReplayFeedback.pending, (state) => {
                state.loading = true;
            })
            .addCase(getReplayFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const { feedbackId, replies } = action.payload;
    
                const parentFeedback = state.feedbacks.find((fb) => fb.id === feedbackId);
                if (parentFeedback) {
                    (parentFeedback as any).replies = replies;
                }
            })
        // GET FEEDBACK BY USER
            .addCase(getFeedbackByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload.result || [];
            })
    },
});
  
export default feedbackSlice.reducer;
