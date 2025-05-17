export interface Service {
    service_id: string;
}

export interface ServiceResponse {
    data: Service[];
}

export interface ServerParam {
    service_id: string;
    to_district_id: string;
    to_ward_code: string;
    insurance_value: number;
}

export interface ServiceFeeResponse {
    total: number;
    service_fee: number;
    insurance_fee: number;
}