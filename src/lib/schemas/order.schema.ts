//For GUEST
export interface OrderItemGuest {
    priceId: string,
    productName: string,
    unitName: string,
    quantity: number,
    price: number,
    amount: number,
    image: string
}

export interface OrderGuest {
    id: string,
    fullname: string,
    phone: number,
    province: string,
    district: string,
    village: string,
    address: string,
    addressCategory: string,
    orderItemTemporaries: OrderItemGuest[];
    orderDate: Date,
    paymentMethod: string,
    status: string,
    isConfirm: boolean,
    totalPrice: number
}

export interface OrderGuestResponse {
    code: number,
    result: OrderGuest
}

export interface AddOrderGuest {
    priceId?: string,
    fullname: string,
    phone: string,
    province: string,
    district: string,
    village: string,
    address: string,
    addressCategory: string,
    paymentMethod: string
}