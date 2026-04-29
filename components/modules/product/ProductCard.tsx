"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/interface/product.interface";

interface ProductCardProps{
    product: Product,
    colors?: string[],
}


export default function ProductCard({product, colors}:ProductCardProps) {
  // Generate stars
  const fullStars = Math.floor(product.avgRating);
  const halfStar = product.avgRating % 1 >= 0.5;

  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-surface-container overflow-hidden product-shadow transition-all duration-300 rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Color Swatches */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {colors?.map((color, i) => (
            <span
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Add to cart button */}
        <button
          aria-label="Add to cart"
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg"
        >
          <ShoppingCart className="text-primary w-5 h-5" />
        </button>
      </div>

      {/* Info */}
      <div className="mt-stack-md flex justify-between items-start">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-secondary text-[16px]">
              {[...Array(fullStars)].map((_, i) => (
                <span key={i}>★</span>
              ))}
              {halfStar && <span>☆</span>}
            </div>
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              ({product.totalReviews})
            </span>
          </div>
        </div>

        <span className="font-price-md text-price-md text-primary">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}