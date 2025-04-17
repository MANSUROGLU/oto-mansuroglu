import { supabase } from '@/lib/supabase';
import { Cart, CartItem } from '../types';

export class CartService {
  // Kullanıcının sepetini getir
  async getUserCart(userId: string): Promise<Cart | null> {
    try {
      // Önce sepeti kontrol et
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (cartError) {
        if (cartError.code === 'PGRST116') {
          // Sepet bulunamadı, yeni bir sepet oluştur
          return this.createCart(userId);
        }
        throw cartError;
      }
      
      // Sepet öğelerini getir
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          cart_id,
          product_id,
          quantity,
          price,
          product_data
        `)
        .eq('cart_id', cartData.id);
      
      if (itemsError) throw itemsError;
      
      return {
        id: cartData.id,
        userId: cartData.user_id,
        createdAt: cartData.created_at,
        updatedAt: cartData.updated_at,
        items: items as CartItem[],
      };
    } catch (error) {
      console.error('Sepet getirme hatası:', error);
      throw error;
    }
  }
  
  // Yeni sepet oluştur
  async createCart(userId: string): Promise<Cart> {
    try {
      const { data, error } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        items: [],
      };
    } catch (error) {
      console.error('Sepet oluşturma hatası:', error);
      throw error;
    }
  }
  
  // Sepete ürün ekle
  async addItem(userId: string, productId: string, quantity: number, productDetails: any): Promise<void> {
    try {
      // Önce sepeti kontrol et veya oluştur
      const cart = await this.getUserCart(userId);
      if (!cart) throw new Error('Sepet bulunamadı');
      
      // Ürün sepette var mı kontrolü
      const existingItem = cart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        // Ürün zaten sepette, miktarı güncelle
        await this.updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Yeni ürün ekle
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            cart_id: cart.id,
            product_id: productId,
            quantity: quantity,
            price: productDetails.price,
            product_data: productDetails,
          }]);
        
        if (error) throw error;
      }
      
      // Sepet son güncelleme tarihini güncelle
      await supabase
        .from('carts')
        .update({ updated_at: new Date() })
        .eq('id', cart.id);
        
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      throw error;
    }
  }
  
  // Ürün miktarını güncelle
  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    try {
      if (quantity <= 0) {
        // Miktar 0 veya daha az ise ürünü kaldır
        await this.removeItem(itemId);
        return;
      }
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Sepet son güncelleme tarihini al ve güncelle
      const { data: item } = await supabase
        .from('cart_items')
        .select('cart_id')
        .eq('id', itemId)
        .single();
        
      if (item) {
        await supabase
          .from('carts')
          .update({ updated_at: new Date() })
          .eq('id', item.cart_id);
      }
      
    } catch (error) {
      console.error('Miktar güncelleme hatası:', error);
      throw error;
    }
  }
  
  // Sepetten ürün çıkar
  async removeItem(itemId: string): Promise<void> {
    try {
      // Önce cart_id al
      const { data: item } = await supabase
        .from('cart_items')
        .select('cart_id')
        .eq('id', itemId)
        .single();
      
      // Ürünü sil
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Sepet son güncelleme tarihini güncelle
      if (item) {
        await supabase
          .from('carts')
          .update({ updated_at: new Date() })
          .eq('id', item.cart_id);
      }
      
    } catch (error) {
      console.error('Ürün çıkarma hatası:', error);
      throw error;
    }
  }
  
  // Sepeti temizle
  async clearCart(cartId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);
      
      if (error) throw error;
      
      // Sepet son güncelleme tarihini güncelle
      await supabase
        .from('carts')
        .update({ updated_at: new Date() })
        .eq('id', cartId);
        
    } catch (error) {
      console.error('Sepet temizleme hatası:', error);
      throw error;
    }
  }
}