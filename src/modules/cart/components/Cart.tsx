import React from 'react';
import Link from 'next/link';
import { useCartContext } from '../context/CartContext';
import CartItem from './CartItem';

const Cart: React.FC = () => {
  const { cart, clearCart } = useCartContext();
  
  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-gray-200 min-h-[300px] bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sepetiniz Boş</h2>
        <p className="text-gray-600 mb-6">Sepetinizde henüz ürün bulunmuyor.</p>
        <Link 
          href="/products" 
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Sepetim</h2>
          <button 
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            Sepeti Temizle
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-base mb-2">
            <span className="font-medium text-gray-700">Toplam Ürün:</span>
            <span className="font-semibold">{cart.totalItems} adet</span>
          </div>
          <div className="flex justify-between text-lg mb-6">
            <span className="font-medium text-gray-700">Toplam Tutar:</span>
            <span className="font-bold text-blue-700">{cart.totalPrice.toLocaleString('tr-TR')} TL</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products" 
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 text-center rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Alışverişe Devam Et
            </Link>
            <Link 
              href="/checkout" 
              className="flex-1 py-3 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Siparişi Tamamla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;