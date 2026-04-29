import { CartState } from "@/interface/cart.interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState:CartState = {
    items:[],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.productId === action.payload.productId);
            if(existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.totalPrice += action.payload.price * action.payload.quantity;
        },

        removeItem: (state, action)=>{
            const index = state.items.findIndex(item => item.productId === action.payload);
            if(index !== -1) {
                const item = state.items[index];
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(index, 1);
            }
        }

    }
})

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;