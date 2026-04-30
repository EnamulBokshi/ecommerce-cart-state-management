import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cart.slicer";
import productSlice, { syncStockWithCart } from "./features/product.slicer";
import favouriteSlice from "./features/favourite.slicer";

// ─── localStorage helpers ─────────────────────────────────────────────────────

const CART_STORAGE_KEY = "cart";

/** Read persisted cart state from localStorage (returns undefined on SSR or error) */
function loadCartState() {
    if (typeof window === "undefined") return undefined;
    try {
        const serialized = localStorage.getItem(CART_STORAGE_KEY);
        if (!serialized) return undefined;
        return JSON.parse(serialized);
    } catch {
        return undefined;
    }
}

/** Write the current cart state to localStorage */
function saveCartState(cartState: any) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch {
        // quota exceeded or private browsing — silently ignore
    }
}

// ─── Store factory ────────────────────────────────────────────────────────────

export const makeStore = () => {
    const persistedCart = loadCartState();

    const store = configureStore({
        reducer: {
            cart: cartSlice,
            product: productSlice,
            favourite: favouriteSlice,
        },
        preloadedState: persistedCart ? { cart: persistedCart } : undefined,
    });

    // Synchronize stock with persisted cart items on load
    if (persistedCart && persistedCart.items) {
        store.dispatch(syncStockWithCart(persistedCart.items));
    }

    store.subscribe(() => {
        saveCartState(store.getState().cart);
    });

    return store;
};

// Inferring the types of the store, state and dispatch
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];