/**
 * Sepet modülü için tip tanımlamaları
 */

/**
 * Sepet ürünü
 */
export interface CartItem {
  id: string;          // Ürün ID
  partNumber: string;  // Parça numarası
  name: string;        // Ürün adı
  price: number;       // Ürün fiyatı
  quantity: number;    // Miktar
  imageUrl?: string;   // Ürün görseli (opsiyonel)
  modelFitment?: string[]; // Uyumlu model bilgisi (opsiyonel)
}

/**
 * Sepet
 */
export interface Cart {
  items: CartItem[];
}

/**
 * Sepet özeti
 */
export interface CartSummary {
  itemCount: number;    // Toplam ürün adedi
  subtotal: number;     // Ara toplam
  shipping: number;     // Kargo ücreti
  total: number;        // Genel toplam
}

/**
 * Sepet API yanıt tipleri
 */
export interface CartApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface GetCartResponse extends CartApiResponse {
  data?: Cart;
}

/**
 * Sepet API istek tipleri
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  itemId: string;
}

/**
 * useCart Hook için dönüş tipi
 */
export interface UseCartReturn {
  cart: Cart;
  cartSummary: CartSummary;
  isLoading: boolean;
  error: string | null;
  addToCart: (product: any, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}