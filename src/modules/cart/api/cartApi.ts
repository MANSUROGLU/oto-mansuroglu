import { supabase } from '@/lib/supabase';
import { Cart, CartItem } from '../types';

class CartApiService {
  /**
   * Kullanıcının sepetini getirir veya yeni bir sepet oluşturur
   */
  async getCart(userId: string): Promise<Cart | null> {
    // Kullanıcının aktif sepetini bul
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      console.error('Sepet getirme hatası:', cartError);
      return null;
    }

    // Kullanıcının sepeti yoksa yeni bir sepet oluştur
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (createError) {
        console.error('Sepet oluşturma hatası:', createError);
        return null;
      }

      return { ...newCart, items: [] };
    }

    // Sepet ürünlerini getir
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id,
          name,
          description,
          image_url,
          sku,
          price
        )
      `)
      .eq('cart_id', cart.id);

    if (itemsError) {
      console.error('Sepet ürünleri getirme hatası:', itemsError);
      return { ...cart, items: [] };
    }

    return { ...cart, items: items || [] };
  }

  /**
   * Sepete ürün ekler
   */
  async addItem(cartId: string, productId: string, quantity: number, price: number): Promise<CartItem | null> {
    // Önce ürünün sepette olup olmadığını kontrol et
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Ürün zaten sepette, miktarını güncelle
      const newQuantity = existingItem.quantity + quantity;
      return this.updateItemQuantity(existingItem.id, newQuantity);
    }

    // Yeni ürün ekle
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        cart_id: cartId,
        product_id: productId,
        quantity,
        price
      }])
      .select(`
        *,
        product:products(
          id,
          name,
          description,
          image_url,
          sku,
          price
        )
      `)
      .single();

    if (error) {
      console.error('Sepete ürün ekleme hatası:', error);
      return null;
    }

    return data;
  }

  /**
   * Sepetteki ürün miktarını günceller
   */
  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select(`
        *,
        product:products(
          id,
          name,
          description,
          image_url,
          sku,
          price
        )
      `)
      .single();

    if (error) {
      console.error('Sepet ürün güncelleme hatası:', error);
      return null;
    }

    return data;
  }

  /**
   * Sepetten ürün kaldırır
   */
  async removeItem(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Sepetten ürün kaldırma hatası:', error);
      return false;
    }

    return true;
  }

  /**
   * Sepeti tamamen temizler
   */
  async clearCart(cartId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (error) {
      console.error('Sepet temizleme hatası:', error);
      return false;
    }

    return true;
  }
}

export const CartApi = new CartApiService();