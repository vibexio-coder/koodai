import React from 'react';
import { ShoppingBag, Store, ShoppingCart, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
  cartCount: number;
}

export function BottomNav({ currentScreen, onNavigate, cartCount }: BottomNavProps) {
  const { t } = useLanguage();

  const getButtonClass = (screenName: string) => {
    const isActive = currentScreen === screenName;
    return isActive ? "w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center";
  };
  
  const getIconClass = (screenName: string) => {
    const isActive = currentScreen === screenName;
    return isActive ? "w-5 h-5 text-black" : "w-5 h-5 text-gray-600";
  };
  
  const getTextClass = (screenName: string) => {
    const isActive = currentScreen === screenName;
    return isActive ? "text-xs text-black font-medium" : "text-xs text-gray-600";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button 
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center gap-1"
        >
          <div className={getButtonClass('home')}>
            <ShoppingBag className={getIconClass('home')} />
          </div>
          <span className={getTextClass('home')}>{t('home')}</span>
        </button>

        <button
          onClick={() => onNavigate('orders')}
          className="flex flex-col items-center gap-1"
        >
          <div className={getButtonClass('orders')}>
            <Store className={getIconClass('orders')} />
          </div>
          <span className={getTextClass('orders')}>{t('orders')}</span>
        </button>

        <button
          onClick={() => onNavigate('cart')}
          className="flex flex-col items-center gap-1 relative"
        >
          <div className={getButtonClass('cart')}>
            <ShoppingCart className={getIconClass('cart')} />
          </div>
          {cartCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">{cartCount}</span>
            </div>
          )}
          <span className={getTextClass('cart')}>{t('cart')}</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="flex flex-col items-center gap-1"
        >
          <div className={getButtonClass('profile')}>
            <User className={getIconClass('profile')} />
          </div>
          <span className={getTextClass('profile')}>{t('profile')}</span>
        </button>
      </div>
    </div>
  );
}
