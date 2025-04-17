/**
 * Sepet öğesi tipi
 */
export interface CartItem {
  id?: string;
  partNumber: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  modelFitment?: string[];
}

/**
 * Sepet tipi
 */
export interface Cart {
  id?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sepet özeti
 */
export interface CartSummary {
  itemCount: number;
  subTotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * API yanıt tipi - başarılı
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/**
 * API yanıt tipi - hata
 */
export interface ApiError {
  success: false;
  error: string;
}

/**
 * API yanıt birleşik tip
 */
export type CartApiResponse<T> = ApiSuccess<T> | ApiError;