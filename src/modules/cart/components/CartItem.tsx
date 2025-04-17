import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '../types';
import { useCartContext } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCartContext();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-24 h-24 relative flex-shrink-0">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Resim yok</span>
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.productCode && `Ürün Kodu: ${item.productCode}`}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)}
          </div>
          
          <div className="flex items-center">
            <select 
              value={item.quantity} 
              onChange={handleQuantityChange}
              className="mx-2 p-1 border border-gray-300 rounded"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            
            <button 
              onClick={handleRemove} 
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Kaldır
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;