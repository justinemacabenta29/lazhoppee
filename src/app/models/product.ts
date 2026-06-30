export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  stock?: number;
  rating?: number;
  sold?: number;
  qty?: number; 
}
