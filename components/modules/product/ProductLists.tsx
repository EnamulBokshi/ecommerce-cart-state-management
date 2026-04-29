'use client';

import { useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";

export default function ProductLists() {
    const products = useAppSelector((state) => state.product);
    console.log(products);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
  )
}   