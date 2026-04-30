
export enum ProductStatus {
    AVAILABLE = "available",
    OUT_OF_STOCK = "out_of_stock",

    DISCONTINUED = "discontinued"
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  avgRating: number;
  totalReviews: number;
}