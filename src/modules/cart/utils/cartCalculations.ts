import { CartItem } from '../types';

/**
 * Sepet ara toplamını hesaplar
 * @param items Sepetteki ürünler
 * @returns Toplam fiyat
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Vergiyi hesaplar (KDV %18)
 * @param subtotal Ara toplam
 * @returns Vergi tutarı
 */
export const calculateTax = (subtotal: number): number => {
  const TAX_RATE = 0.18; // %18 KDV
  return subtotal * TAX_RATE;
};

/**
 * Kargo ücretini hesaplar
 * Toplam tutar 1000 TL üzerindeyse kargo ücretsiz,
 * değilse sabit 30 TL kargo ücreti alınır
 * 
 * @param items Sepetteki ürünler
 * @returns Kargo ücreti
 */
export const calculateShipping = (items: CartItem[]): number => {
  const FREE_SHIPPING_THRESHOLD = 1000; // 1000 TL üzeri ücretsiz kargo
  const STANDARD_SHIPPING_FEE = 30; // Standart kargo ücreti 30 TL
  
  const subtotal = calculateSubtotal(items);
  
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  
  return STANDARD_SHIPPING_FEE;
};

/**
 * Toplam sepet tutarını hesaplar
 * @param subtotal Ara toplam
 * @param tax Vergi
 * @param shipping Kargo ücreti
 * @returns Toplam tutar
 */
export const calculateTotal = (subtotal: number, tax: number, shipping: number): number => {
  return subtotal + tax + shipping;
};

/**
 * Sepetteki indirim tutarını hesaplar
 * @param items Sepetteki ürünler
 * @param discountCode İndirim kodu
 * @returns İndirim tutarı
 */
export const calculateDiscount = (
  items: CartItem[],
  discountCode?: string
): number => {
  // Burada indirim koduna göre indirim tutarını hesaplama mantığı eklenecek
  // Şimdilik sabit bir indirim oranı kullanıyoruz
  if (!discountCode) return 0;
  
  const subtotal = calculateSubtotal(items);
  const DISCOUNT_RATE = 0.05; // %5 indirim
  
  return subtotal * DISCOUNT_RATE;
};

/**
 * Belirli bir ürün için toplam fiyatı hesaplar
 * @param item Sepet ürünü
 * @returns Toplam ürün fiyatı
 */
export const calculateItemTotal = (item: CartItem): number => {
  return item.price * item.quantity;
};