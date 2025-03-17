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
}

export interface AddressResponse {
    code: number,
    message? : string,
    result?: Address 
}

export interface ListAddressResponse {
    code: number,
    result: Address[]
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
