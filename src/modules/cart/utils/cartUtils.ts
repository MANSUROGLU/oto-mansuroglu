import { CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Ürünün sepette olup olmadığını kontrol eder
 */
export const isItemInCart = (items: CartItem[], productId: string): boolean => {
  return items.some(item => item.productId === productId);
};

/**
 * Belirli bir ürünü sepet içerisinde bulur
 */
export const findCartItem = (items: CartItem[], productId: string): CartItem | undefined => {
  return items.find(item => item.productId === productId);
};

/**
 * Sepete yeni ürün ekler
 * Ürün zaten sepette varsa, miktarını artırır
 */
export const addItemToCart = (items: CartItem[], newItem: Omit<CartItem, 'id'>): CartItem[] => {
  const existingItem = findCartItem(items, newItem.productId);
  
  if (existingItem) {
    return items.map(item => 
      item.productId === newItem.productId 
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  }
  
  return [...items, { ...newItem, id: uuidv4() }];
};

/**
 * Sepetten ürün çıkarır
 */
export const removeItemFromCart = (items: CartItem[], productId: string): CartItem[] => {
  return items.filter(item => item.productId !== productId);
};

/**
 * Sepetteki bir ürünün miktarını günceller
 */
export const updateItemQuantity = (items: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(items, productId);
  }
  
  return items.map(item => 
    item.productId === productId 
      ? { ...item, quantity }
      : item
  );
};

/**
 * JSON formatına uygun sepet nesnesini belleğe kaydeder
 */
export const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Sepet kaydedilemedi:', error);
  }
};

/**
 * Bellekten sepet verilerini yükler
 */
export const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Sepet yüklenemedi:', error);
    return [];
  }
};