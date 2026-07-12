export interface Review {
    _id?: string;
    product?: any;
    customer?: any;
    order?: string;
    rating: number;
    comment?: string;
    createdAt?: string;
  }