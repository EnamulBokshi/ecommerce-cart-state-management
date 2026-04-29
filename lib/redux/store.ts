import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cart.slicer";

export const makeStore = ()=>{
    return configureStore({
    reducer: {
        cart: cartSlice,
    }
})
}

// Infering the types of the store, state and dispatch
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']