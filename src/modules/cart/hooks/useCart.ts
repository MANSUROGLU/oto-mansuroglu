import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types';
import { 
  addItemToCart, 
  removeItemFromCart, 
  updateItemQuantity, 
  saveCartToLocalStorage, 
  loadCartFromLocalStorage 
} from '../utils/cartUtils';
import { 
  calculateSubtotal, 
  calculateTax, 
  calculateShipping, 
  calculateTotal 
} from '../utils/cartCalculations';

export interface UseCartReturn {
  items: CartItem[];
  isEmpty: boolean;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Sepet işlemlerini yönetmek için kullanılan hook
 */
export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Component mount olduğunda local storage'dan sepeti yükle
  useEffect(() => {
    const storedCart = loadCartFromLocalStorage();
    if (storedCart.length > 0) {
      setItems(storedCart);
    }
  }, []);
  
  // Sepet değiştiğinde local storage'a kaydet
  useEffect(() => {
    saveCartToLocalStorage(items);
  }, [items]);
  
  // Sepete ürün ekleme
  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    setItems(prevItems => addItemToCart(prevItems, item));
  }, []);
  
  // Sepetten ürün çıkarma
  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => removeItemFromCart(prevItems, productId));
  }, []);
  
  // Sepetteki ürün miktarını güncelleme
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prevItems => updateItemQuantity(prevItems, productId, quantity));
  }, []);
  
  // Sepeti temizleme
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  // Hesaplamalar
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(items);
  const total = calculateTotal(subtotal, tax, shipping);
  
  return {
    items,
    isEmpty: items.length === 0,
    totalItems,
    subtotal,
    tax,
    shipping,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};