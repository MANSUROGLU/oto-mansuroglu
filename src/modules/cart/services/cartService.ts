import { supabaseClient } from '@/lib/supabase';
import { Cart, CartItem } from '../types';

class CartService {
  private getUserId = async (): Promise<string> => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Kullanıcı oturum açmamış');
    return user.id;
  };

  private createUserCart = async (userId: string): Promise<Cart> => {
    const { data, error } = await supabaseClient
      .from('carts')
      .insert({ user_id: userId })
      .select('*')
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      items: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  };

  getCart = async (): Promise<Cart> => {
    const userId = await this.getUserId();
    
    // Sepeti ve sepet ürünlerini al
    const { data, error } = await supabaseClient
      .from('carts')
      .select(`
        id, 
        user_id, 
        created_at, 
        updated_at,
        cart_items (
          id,
          product_id,
          cart_id,
          quantity,
          price,
          name,
          image,
          part_number,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    
    // Kullanıcının sepeti yoksa yeni bir sepet oluştur
    if (!data) {
      return this.createUserCart(userId);
    }

    // API yanıtını uygulama tipine dönüştür
    return {
      id: data.id,
      userId: data.user_id,
      items: (data.cart_items || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        cartId: item.cart_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        partNumber: item.part_number,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  };

  addItem = async (productId: string, quantity: number, productDetails: Partial<CartItem>): Promise<void> => {
    const userId = await this.getUserId();
    
    // Önce sepeti bul veya oluştur
    let cart = await this.getCart();
    
    // Ürünün sepette olup olmadığını kontrol et
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Ürün zaten sepette, miktarını güncelle
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      await this.updateItemQuantity(cart.items[existingItemIndex].id, newQuantity);
    } else {
      // Ürünü sepete ekle
      const { error } = await supabaseClient
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity,
          price: productDetails.price || 0,
          name: productDetails.name || '',
          image: productDetails.image || null,
          part_number: productDetails.partNumber || ''
        });
        
      if (error) throw error;
    }
  };

  updateItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await this.removeItem(itemId);
      return;
    }
    
    const { error } = await supabaseClient
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
      
    if (error) throw error;
  };

  removeItem = async (itemId: string): Promise<void> => {
    const { error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('id', itemId);
      
    if (error) throw error;
  };

  clearCart = async (): Promise<void> => {
    const cart = await this.getCart();
    
    const { error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);
      
    if (error) throw error;
  };
}

export const cartService = new CartService();