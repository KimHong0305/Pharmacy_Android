export interface VNPAYResponse {
    code: number,
    message: string,
    result: string
}

export interface VNPAYRequest {
    orderId: string
}