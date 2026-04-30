"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import { Product } from "@/interface/product.interface";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/lib/redux/features/cart.slicer";
import { Button } from "@/components/ui/button";
import { useStockManager } from "@/lib/helpers/stockManager";

interface ProductCardProps {
  product: Product;
  colors?: string[];
  salePrice?: number;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  viewMode?: "grid" | "list";
}

// ─── Star renderer ────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${filled
              ? "fill-amber-400 text-amber-400"
              : half
                ? "fill-amber-400/50 text-amber-400"
                : "fill-none text-gray-300"
              }`}
          />
        );
      })}
    </div>
  );
}

// ─── Stock badge ──────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return null; // handled by overlay
  if (stock <= 5)
    return (
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 w-fit backdrop-blur-sm">
        Only {stock} left
      </span>
    );
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  colors,
  salePrice,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  viewMode = "grid",
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [addedToCart, setAddedToCart] = useState(false);
  const isOutOfStock = product.stock === 0;
  const isOnSale = salePrice !== undefined && salePrice < product.price;
  const dispatch = useAppDispatch();

  const { decreaseStock } = useStockManager();


  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isOutOfStock) {
      if (!decreaseStock(product.id)) {
        return;
      }
      dispatch(
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      );
      onAddToCart?.(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1500);
    }
  }

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    onWishlist?.(product);
  }

  // ─── List view ────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="group flex gap-5 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-3 hover:shadow-lg hover:border-outline-variant transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 bg-surface-container overflow-hidden rounded-xl ${isOutOfStock ? "opacity-70" : ""
            }`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isOutOfStock ? "" : "group-hover:scale-105"
              }`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-medium text-on-surface-variant bg-white/90 px-3 py-1 rounded-full">
                Out of stock
              </span>
            </div>
          )}
          {isOnSale && (
            <span className="absolute top-2 left-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white z-10">
              Sale
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-base text-on-surface mb-2 truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.avgRating} />
              <span className="text-xs text-on-surface-variant">
                {product.avgRating.toFixed(1)} ({product.totalReviews})
              </span>
            </div>
            <StockBadge stock={product.stock} />
          </div>

          <div className="flex items-end justify-between gap-4 mt-3">
            {/* Price */}
            <div>
              <p
                className={`text-xl font-bold ${isOnSale ? "text-red-600" : "text-on-surface"
                  }`}
              >
                ${(isOnSale ? salePrice! : product.price).toFixed(2)}
              </p>
              {isOnSale && (
                <p className="text-xs text-on-surface-variant line-through">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* <button
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={handleWishlist}
                className="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all duration-200"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    wishlisted
                      ? "fill-red-500 stroke-red-500"
                      : "stroke-on-surface-variant"
                  }`}
                />
              </button> */}
              {!isOutOfStock && (
                <Button
                  variant={'outline'}
                  aria-label="Add to cart"
                  onClick={handleAddToCart}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${addedToCart
                    ? "bg-green-600 text-white"
                    : "backdrop-blur-sm bg-surface-container-lowest text-on-surface"
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addedToCart ? "Added!" : "Add to cart"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Grid view (default) ──────────────────────────────────────────────────
  return (
    <div className="group cursor-pointer">
      {/* ── Image container ── */}
      <div
        className={`relative aspect-[4/5] bg-surface-container overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl ${isOutOfStock ? "opacity-70" : ""
          }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${isOutOfStock ? "" : "group-hover:scale-105"
            }`}
        />

        {/* Gradient overlay for better text readability on mobile and hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
              Out of stock
            </span>
          </div>
        )}

        {/* Top-left badges: sale / low stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOnSale && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white shadow-sm w-fit">
              Sale
            </span>
          )}
          <StockBadge stock={product.stock} />
        </div>

        {/* Wishlist button — top right */}
        {/* <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10 text-accent-foreground hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? "fill-red-500 stroke-red-500"
                : "text-accent-foreground"
            }`}
          />
        </button> */}

        {/* Color swatches — left side */}
        {colors && colors.length > 0 && (
          <div className="absolute bottom-14 left-3 flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-1 lg:group-hover:translate-y-0 z-10">
            {colors.map((color, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10 transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Add to cart — bottom right */}
        {!isOutOfStock && (
          <Button
            variant={'outline'}
            aria-label="Add to cart"
            onClick={handleAddToCart}
            className={`cursor-pointer absolute bottom-3 right-3 backdrop-blur-md p-3 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 shadow-lg z-10 hover:scale-110 active:scale-95 ${addedToCart
              ? "bg-green-500 text-white"
              : "backdrop-blur-2xl bg-transparent border-2 border-on-surface-variant ring-offset-0 ring-1 ring-offset-background text-on-surface-variant"
              }`}
          >
            <ShoppingCart
              className={`w-4 h-4 ${addedToCart ? "text-white" : "text-primary"
                }`}
            />
          </Button>
        )}
      </div>

      {/* ── Info row ── */}
      <div className="mt-4 flex justify-between items-start gap-2">
        {/* Left: name, category, rating */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-0.5">
            {product.category}
          </p>
          <h3 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={product.avgRating} />
            <span className="text-[11px] text-on-surface-variant">
              ({product.totalReviews})
            </span>
          </div>
        </div>

        {/* Right: price */}
        <div className="text-right shrink-0">
          <p
            className={`text-base font-bold ${isOnSale ? "text-red-600" : "text-on-surface"
              }`}
          >
            ${(isOnSale ? salePrice! : product.price).toFixed(2)}
          </p>
          {isOnSale && (
            <p className="text-xs text-on-surface-variant line-through mt-0.5">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}