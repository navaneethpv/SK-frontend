import { apiFetch } from '../baseUrl';
import { ICartItem } from '@/types/cart';

export const cartAPI = {
  // Get all items in the user's cart
  getCartItems: async (): Promise<ICartItem[]> => {
    return apiFetch<ICartItem[]>('carts');
  },

  // Add a product to the cart or update its quantity
  addToCart: async (payload: {
    product: number;
    quantity: number;
    unit?: number;
    price: string;
  }): Promise<ICartItem> => {
    return apiFetch<ICartItem>('carts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Update cart item quantity
  updateCartItem: async (
    id: number,
    payload: { quantity: number; price: string }
  ): Promise<ICartItem> => {
    return apiFetch<ICartItem>(`carts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Delete specific item from cart
  removeFromCart: async (id: number): Promise<void> => {
    return apiFetch<void>(`carts/${id}`, {
      method: 'DELETE',
    });
  },

  // Clear all items in the cart
  clearCart: async (): Promise<void> => {
    return apiFetch<void>('carts/clear-cart', {
      method: 'DELETE',
    });
  }
};
