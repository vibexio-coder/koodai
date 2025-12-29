import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface ProductDetailScreenProps {
  product: any;
  onBack: () => void;
  onAddToCart: (product: any, quantity: number) => void;
}

export function ProductDetailScreen({ product, onBack, onAddToCart }: ProductDetailScreenProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onBack();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 px-6 py-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-black fill-black" />
                <span className="text-sm font-semibold text-black">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-600">(250+ {t('reviews')})</span>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-black">₹{product.price}</p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">{t('description')}</h3>
            <p className="text-gray-600 leading-relaxed">
              A delicious South Indian specialty made with the finest ingredients. 
              Freshly prepared and served hot. Perfect for breakfast or any time of the day.
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold text-black mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-5 h-5 text-black" />
              </button>
              <span className="text-2xl font-bold text-black w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">{t('total')}</p>
            <p className="text-2xl font-bold text-black">₹{product.price * quantity}</p>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg"
        >
          {t('addToCart')}
        </Button>
      </div>
    </div>
  );
}
