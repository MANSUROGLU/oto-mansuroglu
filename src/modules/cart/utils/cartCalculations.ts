import { Cart } from '../types';

/**
 * Calculates the subtotal of the items in the cart
 */
export const calculateSubtotal = (cart: Cart): number => {
  return cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculates the tax amount based on the subtotal
 */
export const calculateTax = (subtotal: number): number => {
  const TAX_RATE = 0.18; // 18% tax rate for Turkey
  return Math.round(subtotal * TAX_RATE);
};

/**
 * Calculates the shipping cost based on the subtotal
 */
export const calculateShipping = (subtotal: number): number => {
  // Free shipping for orders above 500 TL
  if (subtotal >= 500) {
    return 0;
  }
  
  // Base shipping cost
  return 29.99;
};

/**
 * Calculates the discount amount based on the discount code
 */
export const calculateDiscount = (subtotal: number, discountCode: string): number => {
  // In a real application, we would validate the discount code
  // against a database of valid codes with specific rules.
  // For now, we'll use a simple approach:
  
  // Example discount codes:
  // WELCOME10: 10% off
  // FORD20: 20% off
  // YEDEK15: 15% off
  
  const discountMap: Record<string, number> = {
    'WELCOME10': 0.10,
    'FORD20': 0.20,
    'YEDEK15': 0.15,
  };
  
  const discountRate = discountMap[discountCode] || 0;
  return Math.round(subtotal * discountRate);
};

/**
 * Calculates the total cost including tax and shipping, minus discounts
 */
export const calculateTotal = (subtotal: number, tax: number, shipping: number): number => {
  return subtotal + tax + shipping;
};

/**
 * Formats a price in Turkish Lira
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('tr-TR')} TL`;
};

/**
 * Counts the total number of items in the cart
 */
export const countItems = (cart: Cart): number => {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

/**
 * Checks if the cart is empty
 */
export const isCartEmpty = (cart: Cart): boolean => {
  return cart.items.length === 0;
};