// components/WishlistScreen.jsx
import React from 'react';
import { ArrowLeft, Heart, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Screen } from '../types';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  storeName?: string;
}

interface WishlistScreenProps {
  wishlist: WishlistItem[];
  onBack: () => void;
  onNavigate: (screen: Screen, data?: any) => void;
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
}

export function WishlistScreen({ 
  wishlist, 
  onBack, 
  onNavigate, 
  onRemoveFromWishlist, 
  onAddToCart 
}: WishlistScreenProps) {
  const { t } = useLanguage();

  const subtotal = wishlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md flex-none">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black">{t('wishlist') || 'Wishlist'}</h1>
            <p className="text-sm text-black/90">
              {wishlist.length} {wishlist.length === 1 ? t('item') || 'item' : t('items') || 'items'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {t('Your wishlist is empty') || 'Your wishlist is empty'}
            </h3>
           
            <Button
              onClick={() => onNavigate('home')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {t('Start Shopping') || 'Start Shopping'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        {item.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.category}
                          </p>
                        )}
                        {item.storeName && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.storeName}
                          </p>
                        )}
                        <p className="font-bold text-black mt-2">₹{item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => onAddToCart(item)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('addToCart') || 'Add to Cart'}</span>
                      </Button>
                      <Button
                        onClick={() => onNavigate('productDetail', { product: item })}
                        variant="outline"
                        className="border-gray-300 text-gray-700 py-2 rounded-xl"
                      >
                        {t('viewDetails') || 'View'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {wishlist.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 pt-6 pb-28 flex-none shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('Items') || 'Items'}</span>
              <span className="font-semibold text-black">{wishlist.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('Total Value') || 'Total Value'}</span>
              <span className="font-semibold text-black">₹{subtotal}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                wishlist.forEach(item => onAddToCart(item));
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-2xl shadow-sm"
            >
              {t('addAllToCart') || 'Add All to Cart'}
            </Button>
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 py-4 rounded-2xl"
              onClick={() => {
                wishlist.forEach(item => onRemoveFromWishlist(item.id));
              }}
            >
              {t('Clear Wishlist') || 'Clear All'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}