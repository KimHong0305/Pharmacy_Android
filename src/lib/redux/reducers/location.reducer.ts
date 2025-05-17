import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";

interface AddressDetailParams {
  provinceId: string;
  districtId: string;
  wardCode: string;
}

interface LocationResponse {
  province: LocationData;
  district: LocationData;
  ward: LocationData;
}

interface LocationData {
  ProvinceID?: string;
  ProvinceName?: string;
  DistrictID?: string;
  DistrictName?: string;
  WardCode?: string;
  WardName?: string;
}

interface LocationState {
  provinces: LocationData[];
  districts: LocationData[];
  villages: LocationData[];
  location: LocationResponse | null;
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
  location: null,
  provinceName: "",
  districtName: "",
  villageName: "",
  loading: false,
  error: null,
};

export const getProvinces = createAsyncThunk<LocationData[]>(
  "location/getProvinces",
  async () => {
    const response = await api.get('/delivery/province');
    return response.data.data;
  }
);

export const getDistricts = createAsyncThunk<LocationData[], string>(
  "location/getDistricts",
  async (provinceId) => {
    const response = await api.get(`/delivery/district?provinceId=${provinceId}`);
    return response.data.data;
  }
);
 
export const getVillages = createAsyncThunk<LocationData[], string>(
  "location/getVillages",
  async (districtId) => {
    const response = await api.get(`/delivery/ward?districtId=${districtId}`);
    return response.data.data;
  }
);

export const getAddressDetail = createAsyncThunk<LocationResponse, AddressDetailParams>(
  "location/getAddressDetail",
  async ({provinceId, districtId, wardCode}) => {
    const response = await api.get(`/address/detail?provinceId=${provinceId}&districtId=${districtId}&wardCode=${wardCode}`);
    return response.data.result;
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(getDistricts.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.districts = action.payload;
      })
      .addCase(getVillages.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
        state.villages = action.payload;
      })
      .addCase(getAddressDetail.fulfilled, (state, action: PayloadAction<LocationResponse>) => {
        state.location = action.payload;
      })
  },
});

export default locationSlice.reducer;
