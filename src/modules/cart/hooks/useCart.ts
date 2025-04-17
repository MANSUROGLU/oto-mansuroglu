import { useCallback, useEffect, useState } from 'react';
import { Cart, CartItem, CartSummary } from '../types';
import cartService from '../services/cartService';
import { useAuth } from '../../auth/hooks/useAuth';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sepet yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addItem(item);
      setCart(updatedCart);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürün sepete eklenirken bir hata oluştu');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateItemQuantity(itemId, quantity);
      setCart(updatedCart);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sepet güncellenirken bir hata oluştu');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeItem(itemId);
      setCart(updatedCart);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürün sepetten çıkarılırken bir hata oluştu');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const emptyCart = await cartService.clearCart();
      setCart(emptyCart);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sepet temizlenirken bir hata oluştu');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCartSummary = (): CartSummary => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        itemCount: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      };
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Kargo ücreti, 500 TL ve üzeri ücretsiz varsayımı
    const shipping = subtotal >= 500 ? 0 : 30;
    
    // KDV %18 varsayımı
    const tax = subtotal * 0.18;
    
    const total = subtotal + shipping + tax;

    return {
      itemCount,
      subtotal,
      shipping,
      tax,
      total,
    };
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getCartSummary,
  };
};