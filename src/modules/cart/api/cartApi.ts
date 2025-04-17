import { createClient } from '@/utils/supabase/client';
import { Cart, CartItem, CartSummary } from '../types';

export class CartApi {
  private supabase = createClient();

  /**
   * Kullanıcının sepetini getirir
   */
  async getUserCart(userId: string): Promise<Cart | null> {
    try {
      const { data: cart, error: cartError } = await this.supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (cartError) throw cartError;
      if (!cart) return null;

      const { data: items, error: itemsError } = await this.supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;

      return {
        id: cart.id,
        userId: cart.user_id,
        items: items.map(item => ({
          id: item.id,
          productId: item.product_id,
          cartId: item.cart_id,
          quantity: item.quantity,
          price: item.price,
          productData: item.products,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })),
        createdAt: cart.created_at,
        updatedAt: cart.updated_at
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * Yeni bir sepet oluşturur
   */
  async createCart(userId: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('carts')
        .insert([
          { user_id: userId }
        ])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  /**
   * Sepete ürün ekler
   */
  async addItem(cartId: string, productId: string, quantity: number, price: number): Promise<string> {
    try {
      // Önce mevcut ürünü kontrol et
      const { data: existingItem } = await this.supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Varsa miktarı güncelle
        const newQuantity = existingItem.quantity + quantity;
        await this.supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        
        return existingItem.id;
      } else {
        // Yoksa yeni ekle
        const { data, error } = await this.supabase
          .from('cart_items')
          .insert([
            { 
              cart_id: cartId, 
              product_id: productId, 
              quantity: quantity,
              price: price 
            }
          ])
          .select('id')
          .single();
  
        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Sepetteki ürün miktarını günceller
   */
  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    try {
      if (quantity <= 0) {
        await this.removeItem(itemId);
        return;
      }

      const { error } = await this.supabase
        .from('cart_items')
        .update({ 
          quantity: quantity,
          updated_at: new Date().toISOString() 
        })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  /**
   * Sepetten ürün kaldırır
   */
  async removeItem(itemId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  /**
   * Sepeti tamamen temizler
   */
  async clearCart(cartId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Sepet özeti hesaplar
   */
  calculateCartSummary(cart: Cart): CartSummary {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Basit bir vergi ve kargo hesaplaması
    const tax = subtotal * 0.18; // %18 KDV
    const shipping = subtotal > 1000 ? 0 : 75; // 1000 TL üzeri ücretsiz kargo
    
    return {
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  }
}