export interface ZaloPayResponse {
    orderurl: string;
}

export interface ZaloPayRequest {
    orderId: string
}

export interface MomoResponse {
    payUrl: string;
}

export interface callbackRequest {
    code: string,
    orderId: string,
}