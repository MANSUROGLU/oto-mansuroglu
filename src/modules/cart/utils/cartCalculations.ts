import { Cart, CartItem } from '../types';

/**
 * Sepet ürünlerinin toplam sayısını hesaplar
 */
export const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Sepet ara toplamını hesaplar (vergi ve kargo hariç)
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Vergi tutarını hesaplar (KDV)
 */
export const calculateTax = (subtotal: number, taxRate: number = 0.18): number => {
  return subtotal * taxRate;
};

/**
 * Kargo ücretini hesaplar
 * Belirli bir tutarın üzerindeki siparişlerde kargo ücretsiz olabilir
 */
export const calculateShipping = (subtotal: number, freeShippingThreshold: number = 1000): number => {
  const baseShippingRate = 50;
  return subtotal >= freeShippingThreshold ? 0 : baseShippingRate;
};

/**
 * Toplam sepet tutarını hesaplar (vergi ve kargo dahil)
 */
export const calculateTotal = (subtotal: number, tax: number, shipping: number): number => {
  return subtotal + tax + shipping;
};

/**
 * Tüm sepet hesaplamalarını yaparak güncellenmiş Cart nesnesi döndürür
 */
export const recalculateCart = (items: CartItem[]): Cart => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  
  return {
    items,
    totalItems: calculateTotalItems(items),
    subtotal,
    tax,
    shipping,
    total: calculateTotal(subtotal, tax, shipping)
  };
};