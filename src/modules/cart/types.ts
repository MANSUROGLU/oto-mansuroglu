/**
 * Sepet Tipleri
 * Bu dosya, sepet modülü için tipleri tanımlar.
 */

import { Product } from '@/modules/products/types';

/**
 * Sepet öğesi
 */
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

/**
 * Sepet
 */
export interface Cart {
  id: string;
  userId?: string | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

/**
 * Sepet özeti
 */
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discounts: Discount[];
  totalWithDiscounts: number;
}

/**
 * İndirim
 */
export interface Discount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

/**
 * Sepet ekleme yanıtı
 */
export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart?: Cart;
  error?: string;
}

/**
 * Sepet güncelleme yanıtı
 */
export interface UpdateCartResponse {
  success: boolean;
  message: string;
  cart?: Cart;
  error?: string;
}

/**
 * Sepet silme yanıtı
 */
export interface RemoveFromCartResponse {
  success: boolean;
  message: string;
  cart?: Cart;
  error?: string;
}

/**
 * Sepet temizleme yanıtı
 */
export interface ClearCartResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Kupon uygulama yanıtı
 */
export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  cart?: Cart;
  discount?: Discount;
  error?: string;
}