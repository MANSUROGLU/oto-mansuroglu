import { useState, useEffect } from 'react';
import { Cart, CartItem, CartSummary, UseCartReturn } from '../types';
import { cartService } from '../services/cartService';

/**
 * Sepet işlemlerini yönetmek için React hook
 * @returns {UseCartReturn} Sepet işlemleri için gerekli metot ve değişkenler
 */
export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sepet özeti hesaplama
   */
  const calculateCartSummary = (cartItems: CartItem[]): CartSummary => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Kargo ücreti hesaplama - 500 TL üzeri ücretsiz kargo
    const shipping = subtotal >= 500 ? 0 : 29.99;
    
    return {
      itemCount,
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  };

  const cartSummary = calculateCartSummary(cart.items);

  // Sayfa yüklendiğinde sepeti getir
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await cartService.getCart();
        if (response.success && response.data) {
          setCart(response.data);
        }
      } catch (err) {
        setError('Sepet yüklenirken bir hata oluştu.');
        console.error('Sepet yükleme hatası:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  /**
   * Sepete ürün ekleme
   */
  const addToCart = async (product: any, quantity: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const productToAdd: CartItem = {
        id: product.id,
        partNumber: product.partNumber || '',
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl || product.images?.[0] || '',
        modelFitment: product.modelFitment || []
      };

      const response = await cartService.addToCart(productToAdd);
      if (response.success) {
        const updatedCart = await cartService.getCart();
        if (updatedCart.success && updatedCart.data) {
          setCart(updatedCart.data);
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Ürün sepete eklenirken bir hata oluştu.');
      console.error('Sepete ekleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sepet ürün miktarını güncelleme
   */
  const updateCartItem = async (itemId: string, quantity: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        const updatedCart = await cartService.getCart();
        if (updatedCart.success && updatedCart.data) {
          setCart(updatedCart.data);
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Sepet güncellenirken bir hata oluştu.');
      console.error('Sepet güncelleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sepetten ürün çıkarma
   */
  const removeFromCart = async (itemId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        const updatedCart = await cartService.getCart();
        if (updatedCart.success && updatedCart.data) {
          setCart(updatedCart.data);
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Ürün sepetten çıkarılırken bir hata oluştu.');
      console.error('Sepetten çıkarma hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sepeti temizleme
   */
  const clearCart = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart({ items: [] });
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Sepet temizlenirken bir hata oluştu.');
      console.error('Sepet temizleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cart,
    cartSummary,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
};