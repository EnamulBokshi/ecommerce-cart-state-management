import { CartItem, CartState } from "@/interface/cart.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
    items: [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) => item.productId === action.payload.productId
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.totalPrice += action.payload.price * action.payload.quantity;
        },

        removeItem: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(
                (item) => item.productId === action.payload
            );
            if (index !== -1) {
                const item = state.items[index];
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(index, 1);
            }
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const item = state.items.find(
                (i) => i.productId === action.payload.productId
            );
            if (item) {
                const diff = action.payload.quantity - item.quantity;
                item.quantity = action.payload.quantity;
                state.totalPrice += item.price * diff;

                // Remove if quantity drops to 0
                if (item.quantity <= 0) {
                    state.totalPrice -= item.price * item.quantity;
                    state.items = state.items.filter(
                        (i) => i.productId !== action.payload.productId
                    );
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;