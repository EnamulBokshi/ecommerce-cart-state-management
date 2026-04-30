import { PLACEHOLDER_PRODUCTS } from "@/consts/product.const";
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: PLACEHOLDER_PRODUCTS,
    reducers: {
        addProduct: (state, action) => {
            state.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.findIndex(product => product.id === action.payload.id);
            if( index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            const index = state.findIndex(product => product.id === action.payload.id);
            if( index !== -1) {
                state.splice(index, 1);
            }
        },
        updateStock: (state, action) => {
            const {id, quantity} = action.payload;
            const index = state.findIndex(product => product.id === id);
            if(index !== -1) {
                state[index].stock = Math.max(0, state[index].stock + quantity);
            }
        },
        syncStockWithCart: (state, action) => {
            const cartItems = action.payload;
            cartItems.forEach((item: any) => {
                const product = state.find(p => p.id === item.productId);
                if (product) {
                    product.stock = Math.max(0, product.stock - item.quantity);
                }
            });
        }


    }

})

export const {addProduct, updateProduct, deleteProduct, updateStock, syncStockWithCart} = productSlice.actions

export default productSlice.reducer;
