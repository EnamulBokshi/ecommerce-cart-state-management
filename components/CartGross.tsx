"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  removeItem,
  updateQuantity,
  clearCart,
} from "@/lib/redux/features/cart.slicer";
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function CartGross() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* ── Floating cart button ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-primary text-on-primary pl-5 pr-6 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        <span className="font-semibold text-sm">Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-1 min-w-[22px] h-[22px] flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5 shadow-md animate-bounce-in">
            {itemCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Slide-out drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface-container-lowest z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-on-surface" />
            <h2 className="font-semibold text-lg text-on-surface">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-surface-container transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-5">
                <ShoppingCart className="w-10 h-10 text-on-surface-variant/50" />
              </div>
              <h3 className="font-semibold text-lg text-on-surface mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-on-surface-variant max-w-[260px] mb-6">
                Looks like you haven&apos;t added any products yet. Browse our
                collection and find something you love!
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-3 bg-surface-container-low rounded-2xl group/item hover:bg-surface-container transition-colors duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface-container">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-on-surface truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold text-on-surface mt-0.5">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity controls + remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-0 border border-outline-variant rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 text-on-surface-variant" />
                        </button>
                        <span className="w-9 h-8 flex items-center justify-center text-sm font-medium text-on-surface border-x border-outline-variant bg-surface-container-lowest">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 text-on-surface-variant" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          dispatch(removeItem(item.productId))
                        }
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right self-center">
                    <p className="text-sm font-bold text-on-surface">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear all */}
              <button
                onClick={() => dispatch(clearCart())}
                className="self-end text-xs font-medium text-on-surface-variant hover:text-red-500 transition-colors mt-1 underline underline-offset-2"
              >
                Clear all items
              </button>
            </div>
          )}
        </div>

        {/* Footer — totals + checkout */}
        {cart.items.length > 0 && (
          <div className="border-t border-outline-variant/50 px-6 py-5 bg-surface-container-low/50">
            {/* Subtotals */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-medium text-on-surface">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="h-px bg-outline-variant/50 my-1" />
              <div className="flex justify-between">
                <span className="font-semibold text-on-surface">Total</span>
                <span className="font-bold text-lg text-on-surface">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg">
              <ShoppingBag className="w-4 h-4" />
              Checkout — ${cart.totalPrice.toFixed(2)}
            </button>

            {/* Continue shopping */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface mt-3 py-1.5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}