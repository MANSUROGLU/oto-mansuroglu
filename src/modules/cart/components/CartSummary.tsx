import React from 'react';
import { useCartContext } from '../context/CartContext';
import Link from 'next/link';

const CartSummary: React.FC = () => {
  const { cart } = useCartContext();
  
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0; // Sabit kargo ücreti, sepet boş değilse
  const total = subtotal + shipping;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Ara Toplam</span>
          <span>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(subtotal)}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Kargo</span>
          <span>
            {subtotal === 0 
              ? "—" 
              : new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(shipping)}
          </span>
        </div>
        
        <div className="border-t pt-3 mt-3 border-gray-200">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Toplam</span>
            <span>
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(total)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <Link 
          href={cart.items.length > 0 ? "/checkout" : "#"} 
          className={`w-full block text-center py-3 px-4 rounded-md ${
            cart.items.length > 0 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={(e) => cart.items.length === 0 && e.preventDefault()}
        >
          Ödeme İşlemine Geç
        </Link>
        
        <Link 
          href="/products" 
          className="w-full block text-center py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;