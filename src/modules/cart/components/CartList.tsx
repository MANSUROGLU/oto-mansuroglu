import React from 'react';
import CartItem from './CartItem';
import { useCartContext } from '../context/CartContext';

const CartList: React.FC = () => {
  const { cart } = useCartContext();

  if (cart.items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <div className="text-gray-500 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz boş</h3>
        <p className="text-gray-600 mb-4">
          Ford yedek parça kataloğumuza göz atarak sepetinize ürün ekleyebilirsiniz.
        </p>
        <a 
          href="/products" 
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Ürünlere Göz At
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sepet ({cart.items.length} ürün)</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CartList;