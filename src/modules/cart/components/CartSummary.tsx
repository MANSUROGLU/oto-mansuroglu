/**
 * Sepet özeti komponenti
 */
import { Button } from '@/components/ui/button';
import { CartSummary as CartSummaryType } from '../types';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout: () => void;
  isDisabled?: boolean;
}

export function CartSummary({ summary, onCheckout, isDisabled = false }: CartSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Sipariş Özeti</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ürün Toplamı */}
        <div className="flex justify-between">
          <span className="text-gray-600">Ürün Toplamı:</span>
          <span className="font-medium">
            {summary.subtotal.toLocaleString('tr-TR')} TL
          </span>
        </div>
        
        {/* İndirim */}
        {summary.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              İndirim:
            </span>
            <span className="font-medium">
              -{summary.discountAmount.toLocaleString('tr-TR')} TL
            </span>
          </div>
        )}
        
        {/* Kargo Ücreti */}
        <div className="flex justify-between">
          <span className="text-gray-600">Kargo Ücreti:</span>
          <span className="font-medium">
            {summary.shippingCost > 0 
              ? `${summary.shippingCost.toLocaleString('tr-TR')} TL` 
              : 'Ücretsiz'}
          </span>
        </div>
        
        {/* Ücretsiz Kargo Mesajı */}
        {summary.freeShippingThreshold > 0 && summary.subtotal < summary.freeShippingThreshold && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <p>
              {(summary.freeShippingThreshold - summary.subtotal).toLocaleString('tr-TR')} TL 
              daha ekleyerek ücretsiz kargo kazanın!
            </p>
          </div>
        )}
        
        <Separator />
        
        {/* Genel Toplam */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Genel Toplam:</span>
          <span>{summary.total.toLocaleString('tr-TR')} TL</span>
        </div>
        
        {/* KDV Dahil Bilgisi */}
        <p className="text-xs text-gray-500 text-right">
          *Fiyatlara KDV dahildir.
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onCheckout} 
          disabled={isDisabled || summary.itemCount === 0}
          className="w-full"
          size="lg"
        >
          Ödemeye Geç
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}