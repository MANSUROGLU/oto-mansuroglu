export interface CartItem {
  id: string;
  productId: string;
  cartId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string | null;
  partNumber: string;
  createdAt: string;
  updatedAt: string;
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