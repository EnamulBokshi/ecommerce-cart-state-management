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
        }


    }

})

export const {addProduct, updateProduct, deleteProduct} = productSlice.actions

export default productSlice.reducer;
