import { useState, useEffect } from 'react';
import { Cart, CartItem } from '../types';

const CART_STORAGE_KEY = 'ford-yedek-parca-cart';

/**
 * Custom hook to manage cart state and operations
 */
export const useCart = () => {
  // Initialize cart state from localStorage or empty cart
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === 'undefined') {
      return { items: [] };
    }
    
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  /**
   * Add an item to the cart
   */
  const addItem = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        const newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
        return { ...prevCart, items: newItems };
      } else {
        // Item doesn't exist, add it
        return { ...prevCart, items: [...prevCart.items, item] };
      }
    });
  };

  /**
   * Remove an item from the cart
   */
  const removeItem = (itemId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.id !== itemId)
    }));
  };

  /**
   * Update the quantity of an item in the cart
   */
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setCart({ items: [] });
  };

  return {
    cart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart
  };
};

export default useCart;