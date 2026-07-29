import { apiFetch } from '../baseUrl';
import { ICartItem } from '@/types/cart';

export const cartAPI = {
  // Get all items in the user's cart
  getCartItems: async (): Promise<ICartItem[]> => {
    try {
      return await apiFetch<ICartItem[]>('carts');
    } catch {
      return [];
    }
  },

  // Add a product to the cart or update its quantity
  addToCart: async (payload: {
    product: number;
    quantity: number;
    unit?: number;
    price: string;
  }): Promise<ICartItem | null> => {
    try {
      return await apiFetch<ICartItem>('carts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return null;
    }
  },

  // Update cart item quantity
  updateCartItem: async (
    id: number,
    payload: { quantity: number; price: string }
  ): Promise<ICartItem | null> => {
    try {
      return await apiFetch<ICartItem>(`carts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } catch {
      return null;
    }
  },

  // Delete specific item from cart
  removeFromCart: async (id: number): Promise<void> => {
    try {
      await apiFetch<void>(`carts/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Graceful fallback for offline mode
    }
  },

  // Clear all items in the cart
  clearCart: async (): Promise<void> => {
    try {
      await apiFetch<void>('carts/clear-cart', {
        method: 'DELETE',
      });
    } catch {
      // Graceful fallback for offline mode
    }
  }
};
