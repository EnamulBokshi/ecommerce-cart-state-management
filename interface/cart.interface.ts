export interface CartState{
    items: CartItem[];
    totalPrice: number;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}