import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://esgoo.net";

// Định nghĩa kiểu dữ liệu cho tỉnh, quận, xã
interface LocationData {
  id: string;
  name: string;
}

interface LocationState {
  provinces: LocationData[];
  districts: LocationData[];
  villages: LocationData[];
  provinceName: string;
  districtName: string;
  villageName: string;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  provinces: [],
  districts: [],
  villages: [],
  provinceName: "",
  districtName: "",
  villageName: "",
  loading: false,
  error: null,
};

// Lấy danh sách tỉnh thành
export const getProvinces = createAsyncThunk<LocationData[]>(
  "location/getProvinces",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/1/0.htm`);
    if (response.data.error === 0) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch provinces");
    }
  }
);

// Lấy danh sách quận huyện theo ID tỉnh
export const getDistricts = createAsyncThunk<LocationData[], string>(
  "location/getDistricts",
  async (provinceId) => {
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/2/${provinceId}.htm`);
    if (response.data.error === 0) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch districts");
    }
  }
);

// Lấy danh sách phường xã theo ID quận
export const getVillages = createAsyncThunk<LocationData[], string>(
  "location/getVillages",
  async (districtId) => {
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/3/${districtId}.htm`);
    if (response.data.error === 0) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch villages");
    }
  }
);

// Lấy Tên Tỉnh
export const getProvinceName = createAsyncThunk<string, string>(
  "location/getProvinceName",
  async (provinceId) => {
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${provinceId}.htm`);
    if (response.data.error === 0) {
      return response.data.data.full_name;
    } else {
      throw new Error("Failed to fetch province name");
    }
  }
);

// Lấy Tên Quận
export const getDistrictName = createAsyncThunk<string, string>(
  "location/getDistrictName",
  async (districtId) => {
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${districtId}.htm`);
    if (response.data.error === 0) {
      return response.data.data.full_name;
    } else {
      throw new Error("Failed to fetch district name");
    }
  }
);

// Lấy Tên Phường
export const getVillageName = createAsyncThunk<string, string>(
  "location/getVillageName",
  async (villageId) => {
    const formattedId = villageId.padStart(5, "0");
    const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${formattedId}.htm`);
    if (response.data.error === 0) {
      return response.data.data.full_name;
    } else {
      throw new Error("Failed to fetch village name");
    }
  }
);

// Slice xử lý trạng thái location
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProvinces.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(getProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unknown error";
      })

      .addCase(getDistricts.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.districts = action.payload;
      })
      .addCase(getVillages.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.villages = action.payload;
      })
      .addCase(getProvinceName.fulfilled, (state, action: PayloadAction<string>) => {
        state.provinceName = action.payload;
      })
      .addCase(getDistrictName.fulfilled, (state, action: PayloadAction<string>) => {
        state.districtName = action.payload;
      })
      .addCase(getVillageName.fulfilled, (state, action: PayloadAction<string>) => {
        state.villageName = action.payload;
      });
  },
});

export default locationSlice.reducer;
