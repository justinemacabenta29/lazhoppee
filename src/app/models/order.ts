export interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
  reviewed?: boolean;
}

export interface Order {
  _id?: string;
  customer?: any;
  courier?: any;
  store?: string | { _id: string; name: string };
  items: OrderItem[];
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'unsuccessful' | 'cancelled';
  placed?: boolean;
  address?: string;
  createdAt?: string;
  deliveryLat?: number | null;
  deliveryLng?: number | null;
  courierLat?: number | null;
  courierLng?: number | null;
  courierLocationUpdatedAt?: string | null;
}