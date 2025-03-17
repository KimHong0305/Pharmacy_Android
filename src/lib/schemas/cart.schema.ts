export interface CartItem {
  id: string;
  priceId: string;
  productName: string;
  unitName: string;
  price: number;
  quantity: number;
  amount: number;
  image: string;
}

export interface Cart {
  cartItemResponses: CartItem[];
  totalPrice: number;
}

export interface CartResponse {
  code: number;
  message?: string,
  result?: Cart;
}

export interface AddToCartRequest {
  priceId: string;
  quantity: number;
}

export interface AddToCartResponse {
    code: number,
    message: string
}

export interface UpdateCartRequest {
  priceId: string;
  quantity: number;
}

export interface UpdateCartResponse {
  code: number;
  message: string;
}

