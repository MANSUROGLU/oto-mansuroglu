/**
 * Ürün Tipleri
 * Bu dosya, ürün modülü için tipleri tanımlar.
 */

import { Product as SupabaseProduct, Category as SupabaseCategory } from '@/modules/core/types/supabase';

/**
 * Ürün tipi
 * Supabase'deki Product tipini genişletir
 */
export interface Product extends SupabaseProduct {
  // Ek özellikler buraya eklenebilir
  formattedPrice?: string;
  formattedDiscountedPrice?: string;
}

/**
 * Ürün filtreleme seçenekleri
 */
export interface ProductFilterOptions {
  category?: string;
  brand?: string;
  partType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  limit?: number;
}

/**
 * Ürün sayfalandırma sonucu
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Ürün detayları
 */
export interface ProductDetails extends Product {
  relatedProducts?: Product[];
  reviews?: ProductReview[];
}

/**
 * Ürün incelemesi
 */
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * Ürün kategorisi
 */
export interface ProductCategory extends SupabaseCategory {
  children?: ProductCategory[];
  productCount?: number;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Ürün markası
 */
export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  productCount?: number;
}