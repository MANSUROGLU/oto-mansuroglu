import { createClient } from '@supabase/supabase-js';
import { Cart, CartItem } from '../types';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const CART_TABLE = 'carts';
const CART_ITEMS_TABLE = 'cart_items';

const cartService = {
  /**
   * Kullanıcının sepetini getirir veya yeni sepet oluşturur
   */
  getCart: async (): Promise<Cart> => {
    // Kullanıcı ID'si, auth hook'undan gelmeli
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    // Mevcut sepeti kontrol et
    const { data: existingCart, error: cartError } = await supabase
      .from(CART_TABLE)
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (cartError && cartError.code !== 'PGRST116') { // PGRST116: kayıt bulunamadı
      throw new Error(`Sepet verileri alınırken hata: ${cartError.message}`);
    }
    
    let cartId;
    
    // Sepet yoksa yeni oluştur
    if (!existingCart) {
      const { data: newCart, error: createError } = await supabase
        .from(CART_TABLE)
        .insert({ user_id: user.id })
        .select()
        .single();
      
      if (createError) {
        throw new Error(`Sepet oluşturulurken hata: ${createError.message}`);
      }
      
      cartId = newCart.id;
    } else {
      cartId = existingCart.id;
    }
    
    // Sepet öğelerini getir
    const { data: items, error: itemsError } = await supabase
      .from(CART_ITEMS_TABLE)
      .select('*')
      .eq('cart_id', cartId);
    
    if (itemsError) {
      throw new Error(`Sepet öğeleri alınırken hata: ${itemsError.message}`);
    }
    
    return {
      id: cartId,
      userId: user.id,
      items: items || [],
      createdAt: existingCart?.created_at || new Date().toISOString(),
      updatedAt: existingCart?.updated_at || new Date().toISOString(),
    };
  },
  
  /**
   * Sepete ürün ekler
   */
  addItem: async (item: Omit<CartItem, 'id'>): Promise<Cart> => {
    const cart = await cartService.getCart();
    
    // Ürün sepette var mı kontrol et
    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId === item.productId
    );
    
    if (existingItemIndex > -1) {
      // Ürün sepette varsa miktarını güncelle
      const existingItem = cart.items[existingItemIndex];
      return cartService.updateItemQuantity(
        existingItem.id,
        existingItem.quantity + item.quantity
      );
    }
    
    // Yeni ürün ekle
    const { data: newItem, error } = await supabase
      .from(CART_ITEMS_TABLE)
      .insert({
        cart_id: cart.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        part_number: item.partNumber
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Ürün sepete eklenirken hata: ${error.message}`);
    }
    
    // Güncel sepeti getir
    return cartService.getCart();
  },
  
  /**
   * Sepetteki bir ürünün miktarını günceller
   */
  updateItemQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    if (quantity <= 0) {
      // Miktar 0 veya daha az ise ürünü sepetten kaldır
      return cartService.removeItem(itemId);
    }
    
    const { error } = await supabase
      .from(CART_ITEMS_TABLE)
      .update({ quantity })
      .eq('id', itemId);
    
    if (error) {
      throw new Error(`Ürün miktarı güncellenirken hata: ${error.message}`);
    }
    
    // Güncel sepeti getir
    return cartService.getCart();
  },
  
  /**
   * Sepetten ürün kaldırır
   */
  removeItem: async (itemId: string): Promise<Cart> => {
    const { error } = await supabase
      .from(CART_ITEMS_TABLE)
      .delete()
      .eq('id', itemId);
    
    if (error) {
      throw new Error(`Ürün sepetten kaldırılırken hata: ${error.message}`);
    }
    
    // Güncel sepeti getir
    return cartService.getCart();
  },
  
  /**
   * Sepeti tamamen temizler
   */
  clearCart: async (): Promise<Cart> => {
    const cart = await cartService.getCart();
    
    const { error } = await supabase
      .from(CART_ITEMS_TABLE)
      .delete()
      .eq('cart_id', cart.id);
    
    if (error) {
      throw new Error(`Sepet temizlenirken hata: ${error.message}`);
    }
    
    // Boş sepeti getir
    return {
      ...cart,
      items: [],
    };
  },
};

export default cartService;