import React from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { calculateItemTotal } from '../utils/cartCalculations';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const { id, name, price, imageUrl, quantity } = item;
  const itemTotal = calculateItemTotal(item);

  const handleIncrement = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Görsel Yok
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">Parça Kodu: {item.partCode}</p>
        <p className="text-md font-medium text-gray-700 mt-1">
          {price.toLocaleString('tr-TR')} TL
        </p>
      </div>

      <div className="flex items-center ml-auto">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecrement}
            className="p-2 hover:bg-gray-100 rounded-l-md"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-2 hover:bg-gray-100 rounded-r-md"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="text-right ml-6 w-24">
        <p className="text-lg font-medium text-gray-800">
          {itemTotal.toLocaleString('tr-TR')} TL
        </p>
      </div>

      <button
        onClick={() => onRemove(id)}
        className="ml-4 p-2 text-gray-500 hover:text-red-500"
        aria-label="Ürünü kaldır"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartItem;