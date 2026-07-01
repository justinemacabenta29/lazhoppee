export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: 'shoes' | 'pants' | 'tshirt' | 'hoodie' | 'accessories' | 'all' | string;
  stock?: number;
  rating?: number;
  sold?: number;
  qty?: number;
}