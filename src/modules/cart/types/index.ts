export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    sku?: string;
  };
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}