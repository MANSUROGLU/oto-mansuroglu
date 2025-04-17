import React, { createContext, useContext, ReactNode } from 'react';
import { Cart, CartContextType, CartItem } from '../types';
import useCart from '../hooks/useCart';

// Create context with default values
const CartContext = createContext<CartContextType>({
  cart: { items: [] },
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {}
});

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps app and makes cart context available
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartUtils = useCart();
  
  return (
    <CartContext.Provider value={cartUtils}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook for components to get the cart context
 */
export const useCartContext = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;