import { Cart, CartApiResponse, CartItem } from '../types';

/**
 * Sepet işlemleri için servis sınıfı
 */
export class CartService {
  private readonly CART_KEY = 'fordparts_cart';
  private readonly API_URL = '/api/cart';

  /**
   * Kullanıcı sepetini getir
   * Önce localStorage kontrolü, yoksa API'dan getir
   */
  async getCart(): Promise<CartApiResponse> {
    try {
      // Oturum açmış kullanıcı için API'dan getir
      if (this.isAuthenticated()) {
        const response = await fetch(this.API_URL);
        if (!response.ok) {
          throw new Error('Sepet verileri getirilemedi');
        }
        return await response.json();
      } 
      
      // Misafir kullanıcı için localStorage'dan getir
      const storedCart = localStorage.getItem(this.CART_KEY);
      if (storedCart) {
        return {
          success: true,
          data: JSON.parse(storedCart) as Cart
        };
      }
      
      // Sepet bulunamadı, boş sepet döndür
      return {
        success: true,
        data: { id: 'guest', items: [], userId: 'guest' }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Sepet yüklenirken bir hata oluştu'
      };
    }
  }

  /**
   * Sepete ürün ekle
   */
  async addToCart(item: CartItem): Promise<CartApiResponse> {
    try {
      if (this.isAuthenticated()) {
        // Oturum açmış kullanıcı için API'ya gönder
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item }),
        });
        
        if (!response.ok) {
          throw new Error('Ürün sepete eklenemedi');
        }
        
        return await response.json();
      } else {
        // Misafir kullanıcı için localStorage'a kaydet
        const currentCart = await this.getLocalCart();
        const existingItemIndex = currentCart.items.findIndex(i => i.id === item.id);
        
        if (existingItemIndex > -1) {
          // Eğer ürün zaten sepette varsa miktarını artır
          currentCart.items[existingItemIndex].quantity += item.quantity;
        } else {
          // Yeni ürünü sepete ekle
          currentCart.items.push(item);
        }
        
        this.saveLocalCart(currentCart);
        
        return {
          success: true,
          data: currentCart
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Ürün sepete eklenirken bir hata oluştu'
      };
    }
  }

  /**
   * Sepetteki ürün miktarını güncelle
   */
  async updateCartItem(itemId: string, quantity: number): Promise<CartApiResponse> {
    try {
      if (this.isAuthenticated()) {
        // Oturum açmış kullanıcı için API'ya gönder
        const response = await fetch(`${this.API_URL}/item/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        });
        
        if (!response.ok) {
          throw new Error('Ürün miktarı güncellenemedi');
        }
        
        return await response.json();
      } else {
        // Misafir kullanıcı için localStorage'ı güncelle
        const currentCart = await this.getLocalCart();
        const itemIndex = currentCart.items.findIndex(i => i.id === itemId);
        
        if (itemIndex === -1) {
          return {
            success: false,
            error: 'Ürün sepette bulunamadı'
          };
        }
        
        currentCart.items[itemIndex].quantity = quantity;
        this.saveLocalCart(currentCart);
        
        return {
          success: true,
          data: currentCart
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Ürün miktarı güncellenirken bir hata oluştu'
      };
    }
  }

  /**
   * Sepetten ürün kaldır
   */
  async removeFromCart(itemId: string): Promise<CartApiResponse> {
    try {
      if (this.isAuthenticated()) {
        // Oturum açmış kullanıcı için API'ya gönder
        const response = await fetch(`${this.API_URL}/item/${itemId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Ürün sepetten kaldırılamadı');
        }
        
        return await response.json();
      } else {
        // Misafir kullanıcı için localStorage'ı güncelle
        const currentCart = await this.getLocalCart();
        const updatedItems = currentCart.items.filter(i => i.id !== itemId);
        
        currentCart.items = updatedItems;
        this.saveLocalCart(currentCart);
        
        return {
          success: true,
          data: currentCart
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Ürün sepetten kaldırılırken bir hata oluştu'
      };
    }
  }

  /**
   * Sepeti temizle
   */
  async clearCart(): Promise<CartApiResponse> {
    try {
      if (this.isAuthenticated()) {
        // Oturum açmış kullanıcı için API'ya gönder
        const response = await fetch(this.API_URL, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Sepet temizlenemedi');
        }
        
        return await response.json();
      } else {
        // Misafir kullanıcı için localStorage'ı temizle
        const emptyCart: Cart = { id: 'guest', items: [], userId: 'guest' };
        this.saveLocalCart(emptyCart);
        
        return {
          success: true,
          data: emptyCart
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Sepet temizlenirken bir hata oluştu'
      };
    }
  }

  /**
   * LocalStorage'dan sepeti getir
   */
  private async getLocalCart(): Promise<Cart> {
    const storedCart = localStorage.getItem(this.CART_KEY);
    
    if (storedCart) {
      return JSON.parse(storedCart) as Cart;
    }
    
    return { id: 'guest', items: [], userId: 'guest' };
  }

  /**
   * Sepeti LocalStorage'a kaydet
   */
  private saveLocalCart(cart: Cart): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  /**
   * Kullanıcının oturum açıp açmadığını kontrol et
   * (Auth servisi ile entegre edilecek)
   */
  private isAuthenticated(): boolean {
    // Bu method Auth servisi ile entegre edilecek
    // Şimdilik false dönüyoruz (localStorage kullanımı için)
    return false;
  }
}

export default CartService;