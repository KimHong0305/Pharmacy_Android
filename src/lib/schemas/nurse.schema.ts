export interface UserPhone {
    id: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    point: number;
};

export interface UserPhoneResponse {
    result: UserPhone;
};