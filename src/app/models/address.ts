export interface Address {
  _id?: string;
  user?: string;
  label: 'Home' | 'Work' | 'Other';
  customLabel?: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  createdAt?: string;
}