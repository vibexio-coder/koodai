import React from 'react';
import { Home, Package, ShoppingCart, User, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartCount: number;
  wishlistCount?: number;
}

export function BottomNav({ 
  currentScreen, 
  onNavigate, 
  cartCount, 
  wishlistCount = 0 
}: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    {
      screen: 'home' as Screen,
      icon: Home,
      label: t('home') || 'Home',
    },
    {
      screen: 'orders' as Screen,
      icon: Package,
      label: t('orders') || 'Orders',
    },
    {
      screen: 'wishlist' as Screen,
      icon: Heart,
      label: t('wishlist') || 'Wishlist',
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      screen: 'cart' as Screen,
      icon: ShoppingCart,
      label: t('cart') || 'Cart',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      screen: 'profile' as Screen,
      icon: User,
      label: t('profile') || 'Profile',
    },
  ];

  const getButtonClass = (screenName: Screen) => {
    const isActive = currentScreen === screenName;
    return isActive 
      ? "w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center" 
      : "w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center";
  };
  
  const getIconClass = (screenName: Screen) => {
    const isActive = currentScreen === screenName;
    return isActive ? "w-5 h-5 text-black" : "w-5 h-5 text-gray-600";
  };
  
  const getTextClass = (screenName: Screen) => {
    const isActive = currentScreen === screenName;
    return isActive ? "text-xs text-black font-medium" : "text-xs text-gray-600";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className="flex flex-col items-center gap-1 relative"
          >
            <div className={getButtonClass(item.screen)}>
              <item.icon className={getIconClass(item.screen)} />
            </div>
            
            {/* Badge for Cart and Wishlist */}
            {(item.badge !== undefined && item.badge > 0) && (
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                item.screen === 'cart' ? 'bg-red-500' : 'bg-red-500'
              }`}>
                <span className="text-xs text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              </div>
            )}
            
            <span className={getTextClass(item.screen)}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}