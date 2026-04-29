export interface CartState{
    items: CartItem[];
    totalPrice: number;
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}