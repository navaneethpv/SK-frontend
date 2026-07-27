import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../Api/Services/cartAPI';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  img: string;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number, openDrawer?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Initial load from localStorage & API
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sk_cart_items');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Fallback default mock items for demonstration
        setCart([
          {
            id: 1,
            title: 'Noir Premium Fragrance - 50ml',
            price: 499,
            originalPrice: 2499,
            img: '/hero cards/4.png',
            quantity: 1,
            variant: '50ml'
          }
        ]);
      }
    } catch {
      // LocalStorage error fallback
    }

    // Try fetching from backend cartAPI
    cartAPI.getCartItems()
      .then((items) => {
        if (items && items.length > 0) {
          const formatted: CartItem[] = items.map((i) => {
            const pObj = typeof i.product === 'object' ? i.product : null;
            return {
              id: i.id,
              title: pObj ? pObj.alias : 'SK Product',
              price: parseFloat(i.price || '499'),
              img: pObj && pObj.icon ? pObj.icon : '/hero cards/1.png',
              quantity: i.quantity,
            };
          });
          setCart(formatted);
        }
      })
      .catch(() => {
        // Offline / mock mode fallback
      });
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('sk_cart_items', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, qty = 1, openDrawer = true) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prevCart, { ...newItem, quantity: qty }];
      }
    });

    // Also notify backend cartAPI asynchronously
    cartAPI.addToCart({
      product: newItem.id,
      quantity: qty,
      price: newItem.price.toString(),
    }).catch(() => {});

    // Open drawer only if openDrawer is true
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    cartAPI.removeFromCart(id).catch(() => {});
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    cartAPI.clearCart().catch(() => {});
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
