import { useCallback, useEffect, useState } from 'react';
import { 
  AddToCartRequest, 
  CartItem, 
  CartState, 
  CartSummary,
  UpdateCartItemRequest, 
  RemoveFromCartRequest 
} from '../types';

// Mock varsayılan sepet özeti
const defaultCartSummary: CartSummary = {
  itemCount: 0,
  totalItems: 0,
  subtotal: 0,
  discountAmount: 0,
  shippingCost: 0,
  total: 0,
  freeShippingThreshold: 2000, // 2000 TL üzeri ücretsiz kargo
};

/**
 * Sepet işlevselliğini sağlayan özel hook
 * 
 * Sepet öğelerini yerel depolamadan yükler ve API ile senkronize eder
 */
export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    summary: defaultCartSummary,
    isLoading: true,
    error: null,
  });

  // Sepet verilerini local storage ve API'den yükle
  useEffect(() => {
    const loadCart = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // TODO: API'den sepet verilerini al
        // Şimdilik local storage'den yükleme simülasyonu yapıyoruz
        const storedCart = localStorage.getItem('cart');
        
        if (storedCart) {
          const { items } = JSON.parse(storedCart);
          const summary = calculateCartSummary(items);
          
          setState({
            items,
            summary,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            items: [],
            summary: defaultCartSummary,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Sepet yüklenirken bir hata oluştu' 
        }));
      }
    };

    loadCart();
  }, []);

  // Sepet özeti hesaplama fonksiyonu
  const calculateCartSummary = useCallback((items: CartItem[]): CartSummary => {
    const itemCount = items.length;
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Şimdilik sabit indirim ve kargo ücreti (ileride daha karmaşık olabilir)
    const discountAmount = 0; // İndirim yok varsayılan olarak
    let shippingCost = subtotal >= defaultCartSummary.freeShippingThreshold ? 0 : 99.90;
    
    const total = subtotal - discountAmount + shippingCost;
    
    return {
      itemCount,
      totalItems,
      subtotal,
      discountAmount,
      shippingCost,
      total,
      freeShippingThreshold: defaultCartSummary.freeShippingThreshold,
    };
  }, []);

  // Sepeti local storage'a kaydet
  const saveCartToStorage = useCallback((items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify({ items }));
  }, []);

  // Sepete ürün ekleme
  const addToCart = useCallback(async (request: AddToCartRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: API entegrasyonu
      // Şimdilik local storage simülasyonu
      
      const { productId, quantity } = request;
      
      // Mevcut sepeti al
      const currentItems = [...state.items];
      
      // Ürünün zaten sepette olup olmadığını kontrol et
      const existingItemIndex = currentItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Eğer ürün zaten sepetteyse, miktarını güncelle
        const updatedItem = {
          ...currentItems[existingItemIndex],
          quantity: Math.min(
            currentItems[existingItemIndex].quantity + quantity,
            currentItems[existingItemIndex].maxQuantity
          )
        };
        
        currentItems[existingItemIndex] = updatedItem;
      } else {
        // Eğer ürün sepette değilse, yeni ekle
        // Not: Gerçek uygulamada bu bilgiler API'den gelecektir
        // Bu mock veri sadece örnek amaçlıdır
        const mockProduct = {
          id: `cart-item-${Date.now()}`,
          productId,
          name: 'Örnek Ford Parçası',
          partNumber: 'FP-12345',
          price: 549.90,
          quantity,
          maxQuantity: 10,
          brand: 'Ford',
          imageUrl: '/images/products/sample-part.jpg'
        };
        
        currentItems.push(mockProduct);
      }
      
      // Sepet özetini hesapla
      const summary = calculateCartSummary(currentItems);
      
      // State'i güncelle
      setState({
        items: currentItems,
        summary,
        isLoading: false,
        error: null
      });
      
      // Local storage'a kaydet
      saveCartToStorage(currentItems);
      
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Sepete ürün eklerken bir hata oluştu' 
      }));
      
      return { success: false, error: 'Sepete ürün eklerken bir hata oluştu' };
    }
  }, [state.items, calculateCartSummary, saveCartToStorage]);

  // Sepetteki ürün miktarını güncelleme
  const updateCartItem = useCallback(async (request: UpdateCartItemRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { cartItemId, quantity } = request;
      
      // Mevcut sepeti al
      const currentItems = [...state.items];
      
      // Güncellenecek ürünü bul
      const itemIndex = currentItems.findIndex(item => item.id === cartItemId);
      
      if (itemIndex === -1) {
        throw new Error('Güncellenecek ürün bulunamadı');
      }
      
      if (quantity <= 0) {
        // Eğer miktar 0 veya daha az ise, ürünü sepetten kaldır
        currentItems.splice(itemIndex, 1);
      } else {
        // Miktarı güncelle, maximum değeri aşmamasını sağla
        currentItems[itemIndex] = {
          ...currentItems[itemIndex],
          quantity: Math.min(quantity, currentItems[itemIndex].maxQuantity)
        };
      }
      
      // Sepet özetini hesapla
      const summary = calculateCartSummary(currentItems);
      
      // State'i güncelle
      setState({
        items: currentItems,
        summary,
        isLoading: false,
        error: null
      });
      
      // Local storage'a kaydet
      saveCartToStorage(currentItems);
      
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Sepet güncellenirken bir hata oluştu' 
      }));
      
      return { success: false, error: 'Sepet güncellenirken bir hata oluştu' };
    }
  }, [state.items, calculateCartSummary, saveCartToStorage]);

  // Sepetten ürün kaldırma
  const removeFromCart = useCallback(async (request: RemoveFromCartRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { cartItemId } = request;
      
      // Mevcut sepetten ürünü kaldır
      const updatedItems = state.items.filter(item => item.id !== cartItemId);
      
      // Sepet özetini hesapla
      const summary = calculateCartSummary(updatedItems);
      
      // State'i güncelle
      setState({
        items: updatedItems,
        summary,
        isLoading: false,
        error: null
      });
      
      // Local storage'a kaydet
      saveCartToStorage(updatedItems);
      
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Sepetten ürün kaldırılırken bir hata oluştu' 
      }));
      
      return { success: false, error: 'Sepetten ürün kaldırılırken bir hata oluştu' };
    }
  }, [state.items, calculateCartSummary, saveCartToStorage]);
  
  // Sepeti temizleme
  const clearCart = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // State'i güncelle
      setState({
        items: [],
        summary: defaultCartSummary,
        isLoading: false,
        error: null
      });
      
      // Local storage'ı temizle
      localStorage.removeItem('cart');
      
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Sepet temizlenirken bir hata oluştu' 
      }));
      
      return { success: false, error: 'Sepet temizlenirken bir hata oluştu' };
    }
  }, []);

  return {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
}