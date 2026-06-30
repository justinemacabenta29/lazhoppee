export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer' | 'store_owner';
  storeApproved?: boolean;
}