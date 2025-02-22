export interface Login {
    username: string;
    password: string;
}

export interface DecodedToken {
    exp: number;
    scope: string;
}

export interface LoginResponse {
    code: number;
    message: string;
    result?: {
        token: string;
        authenticated: boolean;
    };
}
  
export interface Register {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    dob: string;
}

export interface RegisterResponse {
    code: number;
    message: string;
    result: {
        id: string;
        username: string;
        dob: string;
        email: string;
        point: number;
        level: string;
        status: boolean;
        roles: {
            id: string;
            name: string;
            description: string;
        }[];
        otpExpiryTime: string;
        isVerified: boolean;
    };
}
  
export interface VerifySignup {
    email: string;
    otp: string;
}

export interface VerifySignupResponse {
    code: number;
    message: string;
}

export interface ResetPassword {
    email: string;
    otp: string;
    newPassword: string;
}