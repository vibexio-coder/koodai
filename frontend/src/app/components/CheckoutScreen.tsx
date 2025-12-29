import React, { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface CheckoutScreenProps {
  cart: any[];
  onBack: () => void;
  onPlaceOrder: () => void;
}

export function CheckoutScreen({ cart, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await onPlaceOrder();
    } catch (e) {
      // error handled in parent
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black">{t('checkout')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Delivery Address */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-black">{t('deliveryAddress')}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  123, Anna Nagar,<br />
                  Chennai - 600040
                </p>
              </div>
            </div>
            <button className="text-yellow-600 font-medium text-sm">
              {t('changeAddress')}
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold text-black mb-3">{t('paymentMethod')}</h3>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'cod'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💵</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">{t('cashOnDelivery')}</p>
                    <p className="text-xs text-gray-600">Pay when you receive</p>
                  </div>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('upi')}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'upi'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">UPI / Cards</p>
                    <p className="text-xs text-gray-600">Pay online</p>
                  </div>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-black mb-3">Order Summary</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-semibold text-black">₹{subtotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t('deliveryFee')}</span>
            <span className="font-semibold text-black">₹{deliveryFee}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="font-bold text-black">{t('total')}</span>
            <span className="font-bold text-black text-xl">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg disabled:opacity-70"
        >
          {loading ? 'Placing Order...' : `${t('placeOrder')} • ₹${total}`}
        </Button>
      </div>
    </div>
  );
}
