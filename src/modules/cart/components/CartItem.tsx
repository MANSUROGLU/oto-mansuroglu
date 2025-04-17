import React from 'react';
import Image from 'next/image';
import { useCartContext } from '../context/CartContext';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartContext();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-start border-b border-gray-200 pb-4">
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs">Resim yok</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              <a href={`/products/${item.id}`} className="hover:text-blue-600">
                {item.name}
              </a>
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {item.partNumber && (
                <span className="block">Parça No: {item.partNumber}</span>
              )}
              {item.compatibleModels && (
                <span className="block">Uyumlu Modeller: {item.compatibleModels.join(', ')}</span>
              )}
            </p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {(item.price * item.quantity).toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="text-xs text-gray-500 mr-2">
              Adet:
            </label>
            <select
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="rounded border-gray-300 py-1 text-sm"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Kaldır
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;