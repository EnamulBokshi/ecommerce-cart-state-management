"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateStock } from "../redux/features/product.slicer";

export function useStockManager() {
    const products = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();

    const getStock = (id: string): number => {
        const item = products.find((p) => p.id === id);
        return item ? item.stock : 0;
    };

    const isInStock = (id: string): boolean => {
        return getStock(id) > 0;
    };

    const decreaseStock = (id: string): boolean => {
        if (isInStock(id)) {
            dispatch(updateStock({ id, quantity: -1 }));
            return true;
        }
        return false;
    };

    const increaseStock = (id: string, amount: number = 1): boolean => {
        dispatch(updateStock({ id, quantity: amount }));
        return true;
    };

    return {
        getStock,
        isInStock,
        decreaseStock,
        increaseStock,
    };
}
