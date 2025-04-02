import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateFeedback, FeedBack, FeedBackResponse, UpdateFeedback } from "../../schemas/feedback.schema";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FeedBackState {
    listRootFeedBackByProductId: FeedBackResponse | null,
    listReplayFeedBackByProductId : FeedBackResponse | null,
    feedbackUser : FeedBack[],
    loading: boolean | null,
    error: string | null
}

const initialState : FeedBackState  = {
    listRootFeedBackByProductId: null,
    listReplayFeedBackByProductId: null,
    feedbackUser: [],
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

export const getFeedbackByUser = createAsyncThunk<FeedBackResponse, void, { rejectValue: string }>(
    'feedback/getFeedbackByUser',
    async (_, { rejectWithValue }) => {
      try {
        const token = await AsyncStorage.getItem('token');
  
        const response = await api.get<FeedBackResponse>('/feedback/user',
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

export const createFeedback = createAsyncThunk<
  FeedBackResponse,
  CreateFeedback,
  {rejectValue: string}
>('user/createFeedback', async (feeback, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.post('/feedback', feeback, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.result;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateFeedback = createAsyncThunk<
  FeedBackResponse,
  UpdateFeedback,
  {rejectValue: string}
>('user/updateFeedback', async (feedback, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.put('/feedback', feedback, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteFeedback = createAsyncThunk(
  '/deleteFeedback',
  async (id: string, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.delete(`/feedback/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.result;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
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
      })
      //GET FEEDBACK BY USER
      .addCase(getFeedbackByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbackByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackUser = action.payload.result || [];
      })
      //CREATE FEEDBACK
      .addCase(createFeedback.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Feedback created successfully: ', action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch root feedback';
        console.error('Error while creating feedback: ', action.payload);
      });
  },
});

export default feedBackSlice.reducer; 
