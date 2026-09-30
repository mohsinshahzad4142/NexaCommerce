export interface Product {
  id: string;
  title: string;
  slug: string;
  regularPrice: number;
  salePrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isFlashSale?: boolean;
  attributes?: { [key: string]: string };
}

export interface FilterState {
  category: string;
  brand: string;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
}
