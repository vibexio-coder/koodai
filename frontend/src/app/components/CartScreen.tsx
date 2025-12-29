import React from 'react';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Screen } from '../types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartScreen({ cart, onBack, onNavigate, onUpdateQuantity, onRemoveItem }: CartScreenProps) {
  const { t } = useLanguage();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md flex-none">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">{t('yourCart')}</h1>
            <p className="text-sm text-black/80">
              {cart.length} {cart.length === 1 ? t('item') : t('items')}
            </p>
          </div>
        </div>
      </div>

      {/* Cart Items - Scrollable section */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-gray-600 text-center">{t('emptyCart')}</p>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-black">{item.name}</h3>
                        <p className="font-bold text-black mt-1">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center disabled:opacity-50 border border-gray-200"
                      >
                        <Minus className="w-4 h-4 text-black" />
                      </button>
                      <span className="font-semibold text-black w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Summary - Fixed at bottom (above Nav) */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 pt-6 pb-28 flex-none shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-semibold text-black">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('deliveryFee')}</span>
              <span className="font-semibold text-black">₹{deliveryFee}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-bold text-black">{t('total')}</span>
              <span className="font-bold text-black text-xl">₹{total}</span>
            </div>
          </div>

          <Button
            onClick={() => onNavigate('checkout')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
          >
            {t('proceedToCheckout')}
          </Button>
        </div>
      )}
    </div>
  );
}
