import { IProduct } from './product';

export interface ICartItem {
  id: number;
  product: number | IProduct; // Can be nested or ID depending on serializer
  user: number;
  unit: number;
  quantity: number;
  price: string;
  amount: string;
}

export interface ICartSummary {
  items: ICartItem[];
  total_quantity: number;
  total_amount: number;
}
