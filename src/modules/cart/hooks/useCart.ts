import { useState, useEffect, useCallback } from 'react';
import { CartService } from '../services/cartService';
import { Cart, CartItem, CartSummary } from '../types';

/**
 * Sepet için custom React hook
 */
export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cartService = new CartService();

  /**
   * Sepet özetini hesapla
   */
  const calculateSummary = useCallback((currentCart: Cart | null): CartSummary => {
    if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
      return { itemCount: 0, subTotal: 0, shipping: 0, tax: 0, total: 0 };
    }

    const itemCount = currentCart.items.reduce((total, item) => total + item.quantity, 0);
    const subTotal = currentCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Sabit kargo ücreti - ileride hesaplama mantığı güncellenebilir
    const shipping = subTotal > 500 ? 0 : 50;
    
    // KDV hesaplama (%18)
    const tax = subTotal * 0.18;
    
    const total = subTotal + shipping + tax;

    return {
      itemCount,
      subTotal,
      shipping,
      tax,
      total
    };
  }, []);

  /**
   * Sepeti yükle
   */
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Sepet yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [cartService]);

  /**
   * Sepete ürün ekle
   */
  const addToCart = useCallback(async (item: CartItem) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.addToCart(item);
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Ürün sepete eklenirken bir hata oluştu.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartService]);

  /**
   * Sepetteki ürün miktarını güncelle
   */
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(itemId);
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Ürün miktarı güncellenirken bir hata oluştu.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartService]);

  /**
   * Sepetten ürün kaldır
   */
  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Ürün sepetten kaldırılırken bir hata oluştu.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartService]);

  /**
   * Sepeti temizle
   */
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Sepet temizlenirken bir hata oluştu.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartService]);

  // Component mount olduğunda sepeti yükle
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sepet özetini hesapla
  const summary = calculateSummary(cart);

  return {
    cart,
    loading,
    error,
    summary,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart
  };
};

export default useCart;