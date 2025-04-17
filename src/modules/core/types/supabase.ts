/**
 * Supabase veritabanı şeması için tip tanımlamaları
 * Bu dosya, Supabase veritabanı ile TypeScript arasında tip güvenliği sağlar
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          discounted_price: number | null
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
          brand: string
          category: string
          part_number: string
          main_image: string
          additional_images: string[] | null
          created_at: string
          updated_at: string
          model_year: string | null
          part_type: string | null
          specifications: Record<string, any> | null
          is_featured: boolean
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          price: number
          discounted_price?: number | null
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
          brand: string
          category: string
          part_number: string
          main_image: string
          additional_images?: string[] | null
          created_at?: string
          updated_at?: string
          model_year?: string | null
          part_type?: string | null
          specifications?: Record<string, any> | null
          is_featured?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          discounted_price?: number | null
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
          brand?: string
          category?: string
          part_number?: string
          main_image?: string
          additional_images?: string[] | null
          created_at?: string
          updated_at?: string
          model_year?: string | null
          part_type?: string | null
          specifications?: Record<string, any> | null
          is_featured?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_amount: number
          shipping_address: string
          shipping_city: string
          shipping_postal_code: string | null
          shipping_country: string
          contact_phone: string
          contact_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total_amount: number
          shipping_address: string
          shipping_city: string
          shipping_postal_code?: string | null
          shipping_country: string
          contact_phone: string
          contact_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_amount?: number
          shipping_address?: string
          shipping_city?: string
          shipping_postal_code?: string | null
          shipping_country?: string
          contact_phone?: string
          contact_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Ürün tipi
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discounted_price?: number | null
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | string
  brand?: string
  category?: string
  part_number?: string
  main_image?: string
  additional_images?: string[] | null
  created_at?: string
  updated_at?: string
  model_year?: string | null
  part_type?: string | null
  specifications?: Record<string, any> | null
  is_featured?: boolean

  // Eski tip uyumluluğu için ek alanlar
  sku?: string
  image_url?: string
  source_site?: string
  product_url?: string
  compatible_vehicles?: string[]
}

// Kategori tipi
export interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string | null
  created_at?: string
}

// Sipariş tipi
export interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  shipping_address: string
  shipping_city: string
  shipping_postal_code?: string | null
  shipping_country: string
  contact_phone: string
  contact_email: string
  created_at?: string
  updated_at?: string
  payment_details?: PaymentDetails
  items?: OrderItem[]
}

// Sipariş öğesi tipi
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
  created_at?: string
}

// Ödeme detayları tipi
export interface PaymentDetails {
  id: string
  order_id: string
  payment_method: string
  status: string
  amount: number
  provider: string
  created_at?: string
  updated_at?: string
}

// Kullanıcı tipi
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at?: string
}