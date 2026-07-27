import { apiFetch } from '../BaseUrl';

export interface IOrderItem {
  id?: number;
  product: number;
  quantity: number;
  unit: number;
  price: string;
  amount: string;
}

export interface IOrder {
  id?: number;
  customer: number;
  items: IOrderItem[];
  total_amount: string;
  status?: string;
  order_date?: string;
}

export const orderAPI = {
  // Get list of orders
  getOrders: async (): Promise<IOrder[]> => {
    return apiFetch<IOrder[]>('ecommerce/orders');
  },

  // Create a new order
  createOrder: async (order: IOrder): Promise<IOrder> => {
    return apiFetch<IOrder>('ecommerce/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<IOrder> => {
    return apiFetch<IOrder>(`ecommerce/orders/${id}`);
  }
};
