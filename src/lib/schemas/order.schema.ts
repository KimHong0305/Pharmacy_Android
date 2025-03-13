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

export interface OrderItemResponse {
    id: string;
    productId: string;
    priceId: string;
    productName: string;
    unitName: string;
    quantity: number;
    price: number;
    amount: number;
    image: string;
}

export interface OrderResponse {
    id: string;
    userId: string;
    address: Address;
    orderItemResponses: OrderItemResponse[];
    orderDate: string;
    totalPrice: number;
    paymentMethod: string;
    status: string;
    isConfirm: boolean;
}

export interface HistoryOrderResponse {
    result: OrderResponse[];
}
