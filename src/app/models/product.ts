export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: 'shoes' | 'pants' | 'tshirt' | 'hoodie' | 'accessories' | 'all' | string;
  brand?: string;
  stock?: number;
  rating?: number;
  sold?: number;
  qty?: number;
  store?: string | { _id: string; name: string; owner?: { _id: string; name: string } };
  approved?: boolean;
}