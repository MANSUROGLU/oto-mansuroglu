/**
 * Sepet öğesi komponenti
 */
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusIcon, PlusIcon, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdate: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  // Miktar değiştiğinde
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
    onUpdate(item.id, newQuantity);
  };

  // Arttır butonuna tıklandığında
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdate(item.id, newQuantity);
  };

  // Azalt butonuna tıklandığında
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdate(item.id, newQuantity);
    }
  };

  // Kaldır butonuna tıklandığında
  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex items-start space-x-4 py-6 border-b">
      {/* Ürün Resmi */}
      <div className="relative h-24 w-24 rounded-md overflow-hidden border">
        <Link href={`/urunler/${item.productId}`}>
          <Image
            src={item.product.images?.[0] || '/placeholder.png'}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </Link>
      </div>

      {/* Ürün Bilgileri */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/urunler/${item.productId}`}
          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {item.product.name}
        </Link>

        {item.product.partNumber && (
          <p className="mt-1 text-sm text-gray-500">
            Parça No: {item.product.partNumber}
          </p>
        )}

        {item.product.brand && (
          <p className="mt-1 text-sm text-gray-500">
            Marka: {item.product.brand.name}
          </p>
        )}

        <div className="mt-1 flex items-center">
          <p className="text-lg font-medium text-gray-900">
            {item.product.formattedPrice || `${item.price.toLocaleString('tr-TR')} TL`}
          </p>
        </div>
      </div>

      {/* Miktar Kontrolü */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          min="1"
          className="h-8 w-14 text-center"
          value={quantity}
          onChange={handleQuantityChange}
        />
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Toplam ve Kaldır */}
      <div className="flex flex-col items-end space-y-2">
        <p className="text-lg font-medium text-gray-900">
          {(item.price * quantity).toLocaleString('tr-TR')} TL
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span>Kaldır</span>
        </Button>
      </div>
    </div>
  );
}