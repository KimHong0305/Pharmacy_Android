export interface OrderItem {
    id: string,
    productId: string,
    priceId: string,
    productName: string,
    unitName: string,
    quantity: number,
    price: number,
    amount: number,
    image: string
}

export interface Order {
  id: string;
  fullname: string;
  phone: number;
  province: string;
  district: string;
  village: string;
  address: string;
  addressCategory: string;
  orderItemResponses: OrderItem[];
  orderDate: string;
  paymentMethod: string;
  status: string;
  isConfirm: boolean;
  totalPrice: number;
}

export interface OrderResponse {
    code: number,
    result: Order
}

export interface AddOrderGuest {
    priceId?: string,
    fullname: string,
    phone: number,
    province: string,
    district: string,
    village: string,
    address: string,
    addressCategory: string,
    paymentMethod: string
}

export interface AddOrderUser {
    priceId?: string,
    couponId?: string,
    addressId: string,
    paymentMethod: string
}

export interface HistoryOrderResponse {
    result: Order[];
}
