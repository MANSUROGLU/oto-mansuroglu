/**
 * useCart hook
 * Sepet işlemleri için React hook'u
 */

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { Cart, CartItem, AddToCartResponse, UpdateCartResponse, RemoveFromCartResponse, ClearCartResponse, ApplyCouponResponse } from '../types';
import { Product } from '@/modules/products/types';

const CART_STORAGE_KEY = 'fordPartsCart';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Sepeti lokalden yükle
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          // Yeni sepet oluştur
          createEmptyCart();
        }
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
        createEmptyCart();
      }
    };

    loadCart();
  }, []);

  // Sepeti kaydet
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Boş sepet oluştur
  const createEmptyCart = useCallback(() => {
    const emptyCart: Cart = {
      id: `cart_${Date.now()}`,
      userId: null,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };
    setCart(emptyCart);
    return emptyCart;
  }, []);

  // Sepet toplamlarını hesapla
  const calculateCartTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // %18 KDV
    const shipping = subtotal > 1000 ? 0 : 50; // 1000 TL üzeri kargo bedava
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  }, []);

  // Sepete ürün ekle
  const addToCart = useCallback(async (product: Product, quantity: number = 1): Promise<AddToCartResponse> => {
    try {
      setIsLoading(true);
      
      let currentCart = cart || createEmptyCart();
      const existingItemIndex = currentCart.items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Ürün zaten sepette, miktarı güncelle
        const updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        const { subtotal, tax, shipping, total } = calculateCartTotals(updatedItems);
        
        const updatedCart: Cart = {
          ...currentCart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
          subtotal,
          tax,
          shipping,
          total
        };
        
        setCart(updatedCart);
        
        toast({
          title: "Ürün güncellendi",
          description: `${product.name} ürününün miktarı güncellendi.`,
          variant: "default",
        });
        
        return {
          success: true,
          message: 'Ürün sepete eklendi',
          cart: updatedCart
        };
      } else {
        // Yeni ürün ekle
        const newItem: CartItem = {
          id: `item_${Date.now()}`,
          productId: product.id,
          quantity,
          price: product.price,
          product: product
        };
        
        const updatedItems = [...currentCart.items, newItem];
        const { subtotal, tax, shipping, total } = calculateCartTotals(updatedItems);
        
        const updatedCart: Cart = {
          ...currentCart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
          subtotal,
          tax,
          shipping,
          total
        };
        
        setCart(updatedCart);
        
        toast({
          title: "Ürün eklendi",
          description: `${product.name} sepete eklendi.`,
          variant: "default",
        });
        
        return {
          success: true,
          message: 'Ürün sepete eklendi',
          cart: updatedCart
        };
      }
    } catch (error) {
      console.error('Sepete eklenirken hata oluştu:', error);
      toast({
        title: "Hata",
        description: "Ürün sepete eklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return {
        success: false,
        message: 'Ürün sepete eklenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    } finally {
      setIsLoading(false);
    }
  }, [cart, createEmptyCart, calculateCartTotals, toast]);

  // Sepetteki ürünü güncelle
  const updateCartItem = useCallback(async (itemId: string, quantity: number): Promise<UpdateCartResponse> => {
    try {
      setIsLoading(true);
      
      if (!cart) {
        return {
          success: false,
          message: 'Sepet bulunamadı',
          error: 'Cart not found'
        };
      }
      
      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return {
          success: false,
          message: 'Ürün sepette bulunamadı',
          error: 'Item not found in cart'
        };
      }
      
      const updatedItems = [...cart.items];
      
      if (quantity <= 0) {
        // Miktar 0 veya negatifse ürünü sepetten kaldır
        updatedItems.splice(itemIndex, 1);
      } else {
        // Ürün miktarını güncelle
        updatedItems[itemIndex].quantity = quantity;
      }
      
      const { subtotal, tax, shipping, total } = calculateCartTotals(updatedItems);
      
      const updatedCart: Cart = {
        ...cart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
        subtotal,
        tax,
        shipping,
        total
      };
      
      setCart(updatedCart);
      
      const productName = quantity <= 0 
        ? cart.items[itemIndex].product.name 
        : updatedItems[itemIndex].product.name;
      
      toast({
        title: quantity <= 0 ? "Ürün kaldırıldı" : "Ürün güncellendi",
        description: quantity <= 0 
          ? `${productName} sepetten kaldırıldı.` 
          : `${productName} miktarı güncellendi.`,
        variant: "default",
      });
      
      return {
        success: true,
        message: quantity <= 0 ? 'Ürün sepetten kaldırıldı' : 'Ürün miktarı güncellendi',
        cart: updatedCart
      };
    } catch (error) {
      console.error('Sepet güncellenirken hata oluştu:', error);
      toast({
        title: "Hata",
        description: "Sepet güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
      return {
        success: false,
        message: 'Sepet güncellenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    } finally {
      setIsLoading(false);
    }
  }, [cart, calculateCartTotals, toast]);

  // Sepetten ürün kaldır
  const removeFromCart = useCallback(async (itemId: string): Promise<RemoveFromCartResponse> => {
    try {
      setIsLoading(true);
      
      if (!cart) {
        return {
          success: false,
          message: 'Sepet bulunamadı',
          error: 'Cart not found'
        };
      }
      
      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return {
          success: false,
          message: 'Ürün sepette bulunamadı',
          error: 'Item not found in cart'
        };
      }
      
      const productName = cart.items[itemIndex].product.name;
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      const { subtotal, tax, shipping, total } = calculateCartTotals(updatedItems);
      
      const updatedCart: Cart = {
        ...cart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
        subtotal,
        tax,
        shipping,
        total
      };
      
      setCart(updatedCart);
      
      toast({
        title: "Ürün kaldırıldı",
        description: `${productName} sepetten kaldırıldı.`,
        variant: "default",
      });
      
      return {
        success: true,
        message: 'Ürün sepetten kaldırıldı',
        cart: updatedCart
      };
    } catch (error) {
      console.error('Sepetten ürün kaldırılırken hata oluştu:', error);
      toast({
        title: "Hata",
        description: "Ürün sepetten kaldırılırken bir hata oluştu.",
        variant: "destructive",
      });
      return {
        success: false,
        message: 'Ürün sepetten kaldırılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    } finally {
      setIsLoading(false);
    }
  }, [cart, calculateCartTotals, toast]);

  // Sepeti temizle
  const clearCart = useCallback(async (): Promise<ClearCartResponse> => {
    try {
      setIsLoading(true);
      
      createEmptyCart();
      
      toast({
        title: "Sepet temizlendi",
        description: "Tüm ürünler sepetten kaldırıldı.",
        variant: "default",
      });
      
      return {
        success: true,
        message: 'Sepet temizlendi'
      };
    } catch (error) {
      console.error('Sepet temizlenirken hata oluştu:', error);
      toast({
        title: "Hata",
        description: "Sepet temizlenirken bir hata oluştu.",
        variant: "destructive",
      });
      return {
        success: false,
        message: 'Sepet temizlenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    } finally {
      setIsLoading(false);
    }
  }, [createEmptyCart, toast]);

  // Sepet özeti
  const getCartSummary = useCallback(() => {
    if (!cart) return null;
    
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      itemCount,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      discounts: [],
      totalWithDiscounts: cart.total // Şimdilik indirim yok
    };
  }, [cart]);

  return {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary
  };
}