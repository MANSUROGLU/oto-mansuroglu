export interface CartItem {
  id: string;
  productId: string;
  cartId: string;
  quantity: number;
  price: number;
  productData: any; // Ürün detayları
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}