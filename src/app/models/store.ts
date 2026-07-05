export interface Store {
  _id?: string;
  name: string;
  description?: string;
  owner?: any;
  imageUrl?: string;
  approved?: boolean;
  active?: boolean;
  categories?: string[];
  createdAt?: string;
}