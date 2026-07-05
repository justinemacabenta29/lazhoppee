export interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
}

export interface Order {
  _id?: string;
  customer?: any;
  items: OrderItem[];
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  placed?: boolean;
  address?: string;
  createdAt?: string;
}