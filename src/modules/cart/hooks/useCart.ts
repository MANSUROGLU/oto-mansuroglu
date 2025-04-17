import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { CartApi } from '../api/cartApi';
import { Cart, CartSummary } from '../types';

interface UseCartReturn {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  summary: CartSummary | null;
  addItem: (productId: string, quantity: number, price: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { session } = useSession();
  const cartApi = new CartApi();

  const refreshCart = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let userCart = await cartApi.getUserCart(session.user.id);
      
      // Eğer sepet yoksa oluştur
      if (!userCart) {
        const cartId = await cartApi.createCart(session.user.id);
        userCart = await cartApi.getUserCart(session.user.id);
      }

      setCart(userCart);
      
      if (userCart) {
        const cartSummary = cartApi.calculateCartSummary(userCart);
        setSummary(cartSummary);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu'));
      console.error('Sepet yüklenirken hata:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId: string, quantity: number, price: number) => {
    if (!session?.user?.id || !cart) {
      throw new Error('Oturum veya sepet bulunamadı');
    }

    try {
      await cartApi.addItem(cart.id, productId, quantity, price);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Ürün eklenirken hata oluştu'));
      throw err;
    }
  }, [cart, session?.user?.id, refreshCart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!cart) return;

    try {
      await cartApi.updateItemQuantity(itemId, quantity);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Miktar güncellenirken hata oluştu'));
      throw err;
    }
  }, [cart, refreshCart]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!cart) return;

    try {
      await cartApi.removeItem(itemId);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Ürün kaldırılırken hata oluştu'));
      throw err;
    }
  }, [cart, refreshCart]);

  const clearCart = useCallback(async () => {
    if (!cart) return;

    try {
      await cartApi.clearCart(cart.id);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sepet temizlenirken hata oluştu'));
      throw err;
    }
  }, [cart, refreshCart]);

  return {
    cart,
    isLoading,
    error,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart
  };
}