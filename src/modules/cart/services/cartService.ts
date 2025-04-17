import { supabase } from '@/lib/supabase';
import { Cart, CartApiResponse, CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Sepet servisi - Sepet işlemleri için API entegrasyonu
 */
class CartService {
  private userId: string | null = null;
  private tempCartId: string | null = null;

  constructor() {
    // Tarayıcı tarafında çalışıyor muyuz kontrol et
    if (typeof window !== 'undefined') {
      // Temp cart ID'yi localStorage'dan al veya oluştur
      this.tempCartId = localStorage.getItem('tempCartId');
      if (!this.tempCartId) {
        this.tempCartId = uuidv4();
        localStorage.setItem('tempCartId', this.tempCartId);
      }
    }
  }

  /**
   * Kullanıcı ID'sini ayarlar
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Sepetin hangi ID ile ilişkilendirileceğini belirler
   */
  private getCartIdentifier(): string {
    return this.userId || this.tempCartId || 'anonymous';
  }

  /**
   * Sepeti getir
   */
  async getCart(): Promise<CartApiResponse<Cart>> {
    try {
      const cartId = this.getCartIdentifier();
      
      const { data, error } = await supabase
        .from('carts')
        .select('*, cart_items(*)')
        .eq('owner_id', cartId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
        console.error('Sepet getirme hatası:', error);
        return { success: false, error: 'Sepet yüklenemedi.' };
      }

      if (!data) {
        // Sepet yok, boş sepet döndür
        return { success: true, data: { items: [] } };
      }

      // Veriyi istediğimiz formata dönüştür
      const cartItems: CartItem[] = data.cart_items.map((item: any) => ({
        id: item.id,
        partNumber: item.part_number,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image_url,
        modelFitment: item.model_fitment || []
      }));

      return {
        success: true,
        data: {
          id: data.id,
          items: cartItems,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      };
    } catch (error) {
      console.error('Sepet getirme hatası:', error);
      return { success: false, error: 'Sepet yüklenirken bir hata oluştu.' };
    }
  }

  /**
   * Sepete ürün ekle
   */
  async addToCart(item: CartItem): Promise<CartApiResponse<null>> {
    try {
      const cartId = this.getCartIdentifier();
      
      // Önce cart var mı kontrol et
      let { data: cart, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('owner_id', cartId)
        .single();
      
      // Sepet yoksa oluştur
      if (cartError && cartError.code === 'PGRST116') {
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ owner_id: cartId })
          .select('id')
          .single();
          
        if (createError) {
          console.error('Sepet oluşturma hatası:', createError);
          return { success: false, error: 'Sepet oluşturulamadı.' };
        }
        
        cart = newCart;
      } else if (cartError) {
        console.error('Sepet sorgulama hatası:', cartError);
        return { success: false, error: 'Sepet sorgulanamadı.' };
      }
      
      // Ürün zaten sepette var mı kontrol et
      const { data: existingItem, error: existingItemError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('part_number', item.partNumber)
        .single();
        
      if (existingItemError && existingItemError.code !== 'PGRST116') {
        console.error('Sepet ürün kontrolü hatası:', existingItemError);
        return { success: false, error: 'Sepet ürünleri kontrol edilemedi.' };
      }
      
      if (existingItem) {
        // Ürün zaten var, miktarı güncelle
        const newQuantity = existingItem.quantity + item.quantity;
        
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);
          
        if (updateError) {
          console.error('Sepet güncellemesi hatası:', updateError);
          return { success: false, error: 'Sepet güncellenemedi.' };
        }
      } else {
        // Yeni ürün ekle
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            part_number: item.partNumber,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.imageUrl,
            model_fitment: item.modelFitment
          });
          
        if (insertError) {
          console.error('Sepete ürün ekleme hatası:', insertError);
          return { success: false, error: 'Ürün sepete eklenemedi.' };
        }
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      return { success: false, error: 'Ürün sepete eklenirken bir hata oluştu.' };
    }
  }

  /**
   * Sepet öğesini güncelle
   */
  async updateCartItem(itemId: string, quantity: number): Promise<CartApiResponse<null>> {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(itemId);
      }
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
        
      if (error) {
        console.error('Sepet güncelleme hatası:', error);
        return { success: false, error: 'Ürün güncellenemedi.' };
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Sepet güncelleme hatası:', error);
      return { success: false, error: 'Ürün güncellenirken bir hata oluştu.' };
    }
  }

  /**
   * Sepetten öğe çıkar
   */
  async removeFromCart(itemId: string): Promise<CartApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
        
      if (error) {
        console.error('Sepetten çıkarma hatası:', error);
        return { success: false, error: 'Ürün sepetten çıkarılamadı.' };
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Sepetten çıkarma hatası:', error);
      return { success: false, error: 'Ürün sepetten çıkarılırken bir hata oluştu.' };
    }
  }

  /**
   * Sepeti temizle
   */
  async clearCart(): Promise<CartApiResponse<null>> {
    try {
      const cartId = this.getCartIdentifier();
      
      const { data: cart, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('owner_id', cartId)
        .single();
        
      if (cartError && cartError.code !== 'PGRST116') {
        console.error('Sepet sorgulama hatası:', cartError);
        return { success: false, error: 'Sepet sorgulanamadı.' };
      }
      
      if (cart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);
          
        if (error) {
          console.error('Sepet temizleme hatası:', error);
          return { success: false, error: 'Sepet temizlenemedi.' };
        }
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Sepet temizleme hatası:', error);
      return { success: false, error: 'Sepet temizlenirken bir hata oluştu.' };
    }
  }
}

export const cartService = new CartService();