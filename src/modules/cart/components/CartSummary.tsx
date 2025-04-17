import React, { useState } from 'react';
import { Cart } from '../types';
import { 
  calculateSubtotal, 
  calculateTax, 
  calculateShipping, 
  calculateTotal,
  calculateDiscount
} from '../utils/cartCalculations';

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const discount = appliedDiscount ? calculateDiscount(subtotal, appliedDiscount) : 0;
  const total = calculateTotal(subtotal, tax, shipping) - discount;

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      setAppliedDiscount(discountCode);
      setDiscountCode('');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sipariş Özeti</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Ara Toplam</span>
          <span className="font-medium">{subtotal.toLocaleString('tr-TR')} TL</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">KDV (%18)</span>
          <span className="font-medium">{tax.toLocaleString('tr-TR')} TL</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Kargo</span>
          <span className="font-medium">
            {shipping === 0 ? 'Ücretsiz' : `${shipping.toLocaleString('tr-TR')} TL`}
          </span>
        </div>
        
        {appliedDiscount && (
          <div className="flex justify-between text-green-600">
            <div className="flex items-center">
              <span>İndirim</span>
              <button 
                onClick={handleRemoveDiscount}
                className="ml-2 text-xs text-red-500 hover:text-red-700"
              >
                (Kaldır)
              </button>
            </div>
            <span className="font-medium">-{discount.toLocaleString('tr-TR')} TL</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Toplam</span>
            <span>{total.toLocaleString('tr-TR')} TL</span>
          </div>
        </div>
      </div>
      
      {!appliedDiscount && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="İndirim kodu"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyDiscount}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={onCheckout}
        disabled={cart.items.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Ödemeye Geç
      </button>
      
      <div className="text-xs text-gray-500 mt-3 text-center">
        Ödemeye geçtiğinizde, satın alma koşullarını kabul etmiş olursunuz.
      </div>
    </div>
  );
};

export default CartSummary;