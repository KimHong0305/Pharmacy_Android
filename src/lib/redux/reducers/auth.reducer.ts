import api from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { 
    Login, 
    DecodedToken,
    Register, 
    RegisterResponse,
    VerifySignup,
    VerifySignupResponse,
    ResetPassword,
} from "../../schemas/auth.schema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "../../schemas/auth.schema";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// const returnRole = async (token: string | null): Promise<string> => {
//     if (token) {
//         try {
//             const decodeToken: DecodedToken = jwtDecode<DecodedToken>(token);
//             const expireTime = new Date(decodeToken.exp * 1000);

//             if (new Date() > expireTime) {
//                 console.log("Token hết hạn");
//                 await removeToken();
//                 return "";
//             } else {
//                 return decodeToken.scope;
//             }
//         } catch (error) {
//             console.error("Lỗi giải mã token:", error);
//             return "";
//         }
//     } else {
//         return "";
//     }
// };

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
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                if (action.payload.result) {
                    state.token = action.payload.result.token;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })

        // REGISTER
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Register failed";
            })
        
        // VERIFY EMAIL SIGNUP
            .addCase(verifyOtpSignup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpSignup.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(verifyOtpSignup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Verify failed";
            })

        // REFRESH OTP
            .addCase(refreshOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(refreshOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "refresh failed";
            })

        // FORGOT PASSWORD
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "forgot password failed";
            })
        
        // RESET PASSWORD
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "reset password failed";
            })
    }
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;
