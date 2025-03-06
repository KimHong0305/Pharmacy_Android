export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface UserBio {
    id: string;
    username: string;
    dob: string;
    sex: string;
    phone_number: number;
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
    phone_number: number;
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
  