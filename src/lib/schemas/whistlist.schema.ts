export interface Whistlist {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    image: string;
}

export interface AddWhistlistResponse {
    code: number;
    result: Whistlist;
}

export interface WhistlistResponse {
    code: number;
    result: Whistlist[];
}