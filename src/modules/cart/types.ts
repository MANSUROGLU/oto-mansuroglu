/**
 * Sepet modülü için tip tanımlamaları
 */

/**
 * Sepetteki bir ürün öğesi
 */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  partNumber: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  brand: string;
  imageUrl: string;
}

/**
 * Sepet özeti ve fiyat bilgileri
 */
export interface CartSummary {
  itemCount: number;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  freeShippingThreshold: number;
}

/**
 * Sepet durum bilgisi
 */
export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
}

/**
 * Sepet API işlemleri için tip tanımlamaları
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  cartItemId: string;
}

export interface ApplyCouponRequest {
  code: string;
}

/**
 * Sepet API yanıtları için tip tanımlamaları
 */
export interface GetCartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface AddToCartResponse {
  newItem: CartItem;
  summary: CartSummary;
}

export interface UpdateCartResponse {
  updatedItem: CartItem;
  summary: CartSummary;
}

export interface RemoveFromCartResponse {
  removedItemId: string;
  summary: CartSummary;
}

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  summary: CartSummary;
}