import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { cartService } from '../services/cartService';
import { Cart, CartItem, CartSummary } from '../types';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateCartSummary = (cartItems: CartItem[]): CartSummary => {
    return cartItems.reduce(
      (summary, item) => {
        return {
          totalItems: summary.totalItems + item.quantity,
          totalPrice: summary.totalPrice + item.price * item.quantity,
        };
      },
      { totalItems: 0, totalPrice: 0 }
    );
  };

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const result = await cartService.getCart();
      setCart(result);
      setError(null);
    } catch (err) {
      setError('Sepet yüklenirken bir hata oluştu');
      toast({
        title: 'Hata',
        description: 'Sepet yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number, productDetails: Partial<CartItem>) => {
    try {
      setIsLoading(true);
      await cartService.addItem(productId, quantity, productDetails);
      await fetchCart();
      toast({
        title: 'Ürün sepete eklendi',
        description: 'Ürün başarıyla sepete eklendi',
      });
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Ürün sepete eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      await cartService.updateItemQuantity(itemId, quantity);
      await fetchCart();
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Ürün miktarı güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      await cartService.removeItem(itemId);
      await fetchCart();
      toast({
        title: 'Ürün silindi',
        description: 'Ürün sepetten silindi',
      });
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Ürün silinirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartService.clearCart();
      await fetchCart();
      toast({
        title: 'Sepet temizlendi',
        description: 'Sepetinizdeki tüm ürünler silindi',
      });
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Sepet temizlenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartSummary = cart?.items ? calculateCartSummary(cart.items) : { totalItems: 0, totalPrice: 0 };

  return {
    cart,
    isLoading,
    error,
    cartSummary,
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
}