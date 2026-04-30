import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/interface/product.interface";

interface FavouriteState {
  items: Product[];
}

const initialState: FavouriteState = {
  items: [],
};

export const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      console.log("addItem", action.payload);
      const exist = state.items.find((item) => item.id === action.payload.id);
      console.log("exist", exist);
      if (exist) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        return;
      }
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      console.log("removeItem", action.payload);
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = favouriteSlice.actions;
export default favouriteSlice.reducer;