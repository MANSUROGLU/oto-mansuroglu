import React from 'react';
import Image from 'next/image';
import { useCartContext } from '../context/CartContext';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeFromCart } = useCartContext();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="py-6 flex flex-col sm:flex-row gap-4">
      <div className="relative w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Görsel yok</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
          <p className="ml-4 text-base font-medium text-gray-900">
            {item.price.toLocaleString('tr-TR')} TL
          </p>
        </div>
        
        {item.partNumber && (
          <p className="mt-1 text-sm text-gray-500">
            Parça No: {item.partNumber}
          </p>
        )}
        
        {item.vehicleCompatibility && (
          <p className="mt-1 text-sm text-gray-500">
            Uyumlu Araçlar: {item.vehicleCompatibility}
          </p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600 mr-2">
              Adet:
            </label>
            <select
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="rounded border-gray-300 py-1 text-base"
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
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Kaldır
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;