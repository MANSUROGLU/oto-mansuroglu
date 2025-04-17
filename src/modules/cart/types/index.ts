/**
 * Sepet öğesi tipi
 */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Sepet tipi
 */
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

/**
 * Sepet özeti tipi
 */
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * API yanıt tipi (başarılı durumda)
 */
export interface CartApiSuccessResponse {
  success: true;
  data: Cart;
}

/**
 * API yanıt tipi (hata durumunda)
 */
export interface CartApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Birleştirilmiş API yanıt tipi
 */
export type CartApiResponse = CartApiSuccessResponse | CartApiErrorResponse;