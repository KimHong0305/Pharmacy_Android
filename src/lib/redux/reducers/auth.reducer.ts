import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import {jwtDecode} from 'jwt-decode';

import {
  DecodedToken,
    Login,
    LoginResponse,
    LoginWithGoogle,
    Register,
    RegisterResponse,
    ResetPassword,
    VerifySignup,
    VerifySignupResponse
} from "../../schemas/auth.schema";

interface AuthState {
    loading: boolean;
    error: string | null;
    message: string | null;
    token: string | null;
    role: string;
}

const getToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        return null;
    }
};

const saveToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        console.error('Lỗi khi lưu token:', error);
    }
};

const removeToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error('Lỗi khi xóa token:', error);
    }
};

export const loadToken = createAsyncThunk<string | null>(
    'auth/loadToken',
    async () => {
        const token = await getToken();
        return token;
    }
);

export const login = createAsyncThunk<LoginResponse, Login, { rejectValue: string }>(
    "auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post<LoginResponse>("/auth/log-in", formData);
            const token = response.data.result?.token;
            if (token) {
                await saveToken(token);
            }
            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            return rejectWithValue("Login failed due to server error");
        }
    }
);

export const loginWithGoogle = createAsyncThunk<
  LoginResponse,
  LoginWithGoogle,
  {rejectValue: string}
>('auth/loginWithGoogle', async (formData, {rejectWithValue}) => {
  try {
    const response = await api.post<LoginResponse>('/auth/outbound/authentication/android', formData);
    const token = response.data.result?.token;
    if (token) {
      await saveToken(token);
    }
    return response.data;
  } catch (error) {
    console.error('Error during login with google:', error);
    return rejectWithValue('Login failed due to server error');
  }
});

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/auth/logout', {token});
      await removeToken();
      await AsyncStorage.removeItem('AddressGuest');
      return {message: response.data.message};
    } catch (error:any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const register = createAsyncThunk<RegisterResponse, Register, { rejectValue: string }>(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post<RegisterResponse>("/user", formData);
            return response.data;
        } catch (error: any) {
            console.error("Error during registration:", error);
            return rejectWithValue("Đăng ký thất bại");
        }
    }
);

export const verifyOtpSignup  = createAsyncThunk<VerifySignupResponse, VerifySignup, { rejectValue: string }>(
    "auth//verify-email-signup",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.put<VerifySignupResponse>("/user/verify-email-signup", formData);
            return response.data;
        } catch (error: any) {
            console.error("Error during verify:", error);
            return rejectWithValue("Xác thực email thất bại");
        }
    }
);

export const refreshOtp = createAsyncThunk<VerifySignupResponse, string, { rejectValue: string }>(
    'auth/refreshOtp',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.put<VerifySignupResponse>(
                '/user/refresh-otp',
                { email }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue('Gửi lại mã OTP thất bại');
        }
    }
);


export const forgotPassword = createAsyncThunk<RegisterResponse, string, { rejectValue: string }>(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.put<RegisterResponse>(
                '/user/forgot-password',
                { email }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error forgot password');
            return rejectWithValue('Quên mật khẩu thất bại');
        }
    }
);

export const resetPassword = createAsyncThunk<VerifySignupResponse, ResetPassword, { rejectValue: string }>(
    'auth/resetPassword',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.put<VerifySignupResponse> ('/user/reset-password', formData);
            return response.data;
        } catch (error: any) {
            console.error('Error reset password');
            return rejectWithValue('Đặt lại mật khẩu thất bại');
        }
    }
);

const initialState: AuthState = {
    loading: false,
    error: null,
    message: null,
    token: null,
    role: '',
};
 
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
          // LOGIN
          .addCase(login.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            if (action.payload.result) {
              const token = action.payload.result.token;
              state.token = token;
              try {
                const decoded: DecodedToken = jwtDecode(token);
                const expireTime = new Date(decoded.exp * 1000);
                if (new Date() > expireTime) {
                  state.role = '';
                } else {
                  state.role = decoded.scope;
                }
                console.log(decoded.scope)
              } catch (err) {
                console.error('Lỗi giải mã token:', err);
                state.role = '';
              }
            }
            
          })
          .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Login failed';
          })
          //LOGIN WITH GOOGLE
          .addCase(loginWithGoogle.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            if (action.payload.result) {
              state.token = action.payload.result.token;
            }
          })
          .addCase(loginWithGoogle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Login failed';
          })
          //LOGOUT
          .addCase(logout.fulfilled, (state, action) => {
            state.token = null;
            state.role = '';
            state.message = null;
            state.error = null;
          })
          // REGISTER
          .addCase(register.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
          })
          .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Register failed';
          })

          // VERIFY EMAIL SIGNUP
          .addCase(verifyOtpSignup.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(verifyOtpSignup.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
          })
          .addCase(verifyOtpSignup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Verify failed';
          })

          // REFRESH OTP
          .addCase(refreshOtp.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(refreshOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
          })
          .addCase(refreshOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'refresh failed';
          })

          // FORGOT PASSWORD
          .addCase(forgotPassword.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
          })
          .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'forgot password failed';
          })

          // RESET PASSWORD
          .addCase(resetPassword.pending, state => {
            state.loading = true;
            state.error = null;
          })
          .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
          })
          .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'reset password failed';
          })
          .addCase(loadToken.fulfilled, (state, action) => {
            state.token = action.payload;
          });
    }
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;
