import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatisticMonth, StatisticMonthResponse, StatisticParams } from '../../schemas/statistic.schema';
import { formatStatisticDataByYear } from '../../../utils/formatChartData';

interface StatisticState {
  loading: boolean;
  error: string | null;
  statisticMonth: StatisticMonth[],
  statisticDay: StatisticMonth[],
  statisticTime: StatisticMonth[],
}

const initialState: StatisticState = {
    loading: false,
    error: null,
    statisticMonth: [],
    statisticDay: [],
    statisticTime: [],
};

export const getStatisticByYear = createAsyncThunk<
  StatisticMonthResponse,
  number,
  { rejectValue: string }
>(
  'statistic/getStatisticByYear',
  async (year, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<StatisticMonthResponse>(
        `/user/spending/year?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user statistic');
    }
  }
);

export const getStatisticByMonth = createAsyncThunk<
  StatisticMonthResponse,
  StatisticParams,
  { rejectValue: string }
>(
  'statistic/getStatisticByMonth',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<StatisticMonthResponse>(
        `/user/spending/month?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user statistic');
    }
  }
);

export const getStatisticByDate = createAsyncThunk<
  StatisticMonthResponse,
  string,
  { rejectValue: string }
>(
  'statistic/getStatisticByDate',
  async (date, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<StatisticMonthResponse>(
        `/user/spending/date?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user statistic');
    }
  }
);

const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          // getStatisticByYear
            .addCase(getStatisticByYear.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(getStatisticByYear.fulfilled, (state, action) => {
              state.loading = false;
              const formatted = formatStatisticDataByYear(action.meta.arg, action.payload.result);
              state.statisticMonth = formatted[action.meta.arg];
            })
            .addCase(getStatisticByYear.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to fetch user statistic';
            })
          // getStatisticByMonth
            .addCase(getStatisticByMonth.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(getStatisticByMonth.fulfilled, (state, action) => {
              state.loading = false;
              state.statisticDay = action.payload.result;
            })
            .addCase(getStatisticByMonth.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to fetch user statistic';
            })
          // getStatisticByMonth
            .addCase(getStatisticByDate.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(getStatisticByDate.fulfilled, (state, action) => {
              state.loading = false;
              state.statisticTime = action.payload.result;
            })
            .addCase(getStatisticByDate.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to fetch user statistic';
            })
    },
});

export default statisticSlice.reducer;
  