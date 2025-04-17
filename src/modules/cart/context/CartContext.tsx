import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartContextType, CartItem } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'oto-mansuroglu-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Calculate totals whenever items change
  const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    return items.reduce(
      (acc, item) => {
        return {
          totalItems: acc.totalItems + item.quantity,
          totalPrice: acc.totalPrice + item.price * item.quantity,
        };
      },
      { totalItems: 0, totalPrice: 0 }
    );
  };

  // Add an item to the cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id);

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
      } else {
        // Item doesn't exist, add new item with quantity 1
        updatedItems = [...prevCart.items, { ...item, quantity: 1 }];
      }

      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    });
  };

  // Update the quantity of an item in the cart
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  // Check if an item is in the cart
  const isInCart = (itemId: string): boolean => {
    return cart.items.some((item) => item.id === itemId);
  };

  // Get quantity of an item in the cart
  const getItemQuantity = (itemId: string): number => {
    const item = cart.items.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export default CartContext;