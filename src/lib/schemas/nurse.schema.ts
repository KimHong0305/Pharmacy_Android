import { OrderItem } from "./order.schema";

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

export interface OrderShopResponse {
    result: {
        id: string;
        userId: string;
        orderItemResponses: OrderItem[];
        phoneNumber: string;
        orderDate: string;
        totalPrice: number;
        paymentMethod: string;
    }
};

export interface ListPrice {
    id: string;
    quantity: number;
} 

export interface AddOrderShop {
    phone: string;
    listPrices: ListPrice[];
    paymentMethod: string;
};

export interface Confirm {
    confirm: boolean;
    orderId: string;
} 