export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface UserBio {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    dob: string;
    sex: string;
    phoneNumber: number;
    email: string;
    image: string;
    point: number;
    level: string;
    status: boolean;
    noPassword: boolean;
    roles: Role[];
    isVerified: boolean;
}

export interface BioResponse {
    code: number;
    result: UserBio;
}

export interface UpdateBioResult {
    id: string;
    username: string;
    dob: string;
    sex: string;
    phoneNumber: number;
    email: string;
    image: string;
    point: number;
    level: string;
    status: boolean;
    roles: Role[];
    isVerified: boolean;
}

export interface UpdateBioResponse {
    code: number;
    message: string;
    result: UpdateBioResult;
}

export interface UpdatePassword {
    oldPassword: string;
    newPassword: string;
    checkNewPassword: string;
}

export interface UpdatePasswordResponse {
    code: number;
    result: string;
}