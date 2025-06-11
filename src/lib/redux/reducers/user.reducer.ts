import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/api";
import { BioResponse, UserBio, UpdateBioResponse, UpdatePassword, UpdatePasswordResponse } from '../../schemas/user.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    bio: UserBio | null;
    loading: boolean;
    error: string | null;
}  

export const getBio = createAsyncThunk<BioResponse, void, { rejectValue: string }>(
  'user/getBio',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await api.get<BioResponse>('/user/bio',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user bio');
    }
  }
);

export const updateBio = createAsyncThunk<
    UpdateBioResponse,
    { updateUser: object; image?: any },
    { rejectValue: string }
    >(
    'user/updateBio',
    async ({ updateUser, image }, { rejectWithValue }) => {
        try {
        const token = await AsyncStorage.getItem('token');

        const formData = new FormData();
            formData.append('updateUser', JSON.stringify(updateUser));

            if (image && image.uri) {
                formData.append('file', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                });
            }

            const response = await api.put<UpdateBioResponse>('/user/update-bio', formData, {
                headers: {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update user bio');
        }
    }
);

export const updateEmail = createAsyncThunk<
    any,
    { email: string },
    { rejectValue: string }
    >(
    'user/updateEmail',
    async ({ email }, { rejectWithValue }) => {
        try {
        const token = await AsyncStorage.getItem('token');

        const response = await api.put(
            '/user/update-email',
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Cập nhật email thất bại');
        }
    }
);

export const verifyEmail = createAsyncThunk<
    any,
    { otp: string },
    { rejectValue: string }
    >(
    'user/verifyEmail',
    async ({ otp }, { rejectWithValue }) => {
        try {
        const token = await AsyncStorage.getItem('token');

        const response = await api.put(
            '/user/verify-email-update',
            { otp },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Xác thực email thất bại');
        }
    }
);

export const updatePassword = createAsyncThunk<UpdatePasswordResponse, UpdatePassword, { rejectValue: string }>(
    "user/updatePassword",
    async (formData, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.put<UpdatePasswordResponse>("/user/update-password", formData,
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

const initialState: UserState = {
    bio: null,
    loading: false,
    error: null,
}
  
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // GET BIO
            .addCase(getBio.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBio.fulfilled, (state, action) => {
                state.loading = false;
                state.bio = action.payload.result;
            })
            .addCase(getBio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch user bio';
            })

        // UPDATE BIO
            .addCase(updateBio.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBio.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateBio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update user bio';
            })

        // UPDATE EMAIL
            .addCase(updateEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update user email';
            })
        
        // VERIFY EMAIL
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update user email';
            })

        // UPDATE PASSWORD
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
            }) 
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Cập nhật mật khẩu thất bại';
            })
    },
  });
  
  export default userSlice.reducer;
  