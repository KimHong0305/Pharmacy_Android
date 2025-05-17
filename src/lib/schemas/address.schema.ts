export interface Address {
    id: string;
    fullname: string;
    phone: number;
    province: string;
    district: string;
    village: string;
    address: string;
    addressCategory: string;
    addressDefault: boolean;
    ProvinceName?: string,
    DistrictName?: string,
    WardName?: string,
}

export interface AddressResponse {
    code: number,
    message? : string,
    result?: Address 
}

export interface ListAddressResponse {
    code: number,
    result: Address[],
    message? : string,
}

export interface AddAddress {
    fullname: string,
    phone: string,
    province: string,
    district: string,
    village: string,
    address: string,
    addressCategory: string,
    addressDefault: boolean
}

export interface EditAddress {
    id: string;
    fullname: string;
    phone: string;
    province: string;
    district: string;
    village: string;
    address: string;
    addressCategory: string;
    addressDefault: boolean;
}