'use client';

import { useEffect, useState } from 'react';
import { CartService } from '../services/cartService';
import { Cart, CartItem, CartSummary } from '../types';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  
  const { user } = useAuth();
  const cartService = new CartService();
  
  // Sepeti yükle
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        setCart(null);
        setLoading(false);
        return;
      }
      
      const userCart = await cartService.getUserCart(user.id);
      setCart(userCart);
      calculateSummary(userCart?.items || []);
    } catch (err) {
      setError('Sepet yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Ürün ekle
  const addItem = async (productId: string, quantity: number, productDetails: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await cartService.addItem(user.id, productId, quantity, productDetails);
      await loadCart();
    } catch (err) {
      setError('Ürün eklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Ürün miktarını güncelle
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || !cart) return;
    
    try {
      setLoading(true);
      await cartService.updateItemQuantity(itemId, quantity);
      await loadCart();
    } catch (err) {
      setError('Miktar güncellenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Ürün çıkar
  const removeItem = async (itemId: string) => {
    if (!user || !cart) return;
    
    try {
      setLoading(true);
      await cartService.removeItem(itemId);
      await loadCart();
    } catch (err) {
      setError('Ürün çıkarılırken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Sepeti temizle
  const clearCart = async () => {
    if (!user || !cart) return;
    
    try {
      setLoading(true);
      await cartService.clearCart(cart.id);
      await loadCart();
    } catch (err) {
      setError('Sepet temizlenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Özet hesapla
  const calculateSummary = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Sabit kargo ücreti - ileride daha dinamik hesaplanabilir
    const shipping = subtotal > 0 ? 50 : 0;
    
    // KDV oranı %18
    const tax = subtotal * 0.18;
    
    const total = subtotal + shipping + tax;
    
    setSummary({
      totalItems,
      subtotal,
      shipping,
      tax,
      total,
    });
  };
  
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user?.id]);
  
  return {
    cart,
    loading,
    error,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
  };
};