import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, User, MapPin, ShoppingBag, Store, Apple, Beef, Pill, Sparkles, ChefHat } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from './ui/input';
import { db } from '../services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { categories as mockCategories } from '../services/seedData';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  cartCount: number; // cartCount is still part of the interface but not destructured in the component
}

const iconMap: { [key: string]: React.ElementType } = {
  ShoppingBag,
  Store,
  Apple,
  Beef,
  Pill,
};

export function HomeScreen({ onNavigate }: HomeScreenProps) { // Removed cartCount from destructuring
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>(mockCategories.map(cat => ({ // Initialize with processed mockCategories
    ...cat,
    icon: iconMap[cat.iconName] || ShoppingBag // Apply icon mapping to mock data
  })));
  const [loading, setLoading] = useState(false); // Set loading to false initially

  // No longer fetching from Firestore to prioritize internal mock data
  useEffect(() => {
    // Categories are initialized from mockData, and icon mapping is applied
    // If mockCategories were to be fetched asynchronously, this useEffect would handle it.
    // For now, it just ensures state is set if not already.
    setCategories(mockCategories.map(cat => ({
      ...cat,
      icon: iconMap[cat.iconName] || ShoppingBag
    })));
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 pt-8 pb-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-black">KOODAI</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-black" />
              <span className="text-sm text-black">Deliver to Home</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <User className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-6 bg-white border-0 rounded-xl shadow-sm"
            onClick={() => onNavigate('search')}
          />
        </div>
      </div>

      {/* AI Chef Banner */}
      <div className="px-6 -mt-6 mb-6 relative z-10">
        <button
          onClick={() => onNavigate('ai-chef')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-lg flex items-center justify-between"
        >
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur">New</span>
              <span className="text-purple-200 text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </div>
            <h3 className="font-bold text-white text-lg">AI Chef Assistant</h3>
            <p className="text-purple-100 text-xs">Get ingredients list automatically!</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>

      {/* Categories */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-black mb-4">{t('categories')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('stores', { category: category.id })}
                className="bg-yellow-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-yellow-200"
              >
                <div className="relative h-32">
                  <img
                    src={category.image}
                    alt={t(category.labelKey)}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-black text-sm">{t(category.labelKey)}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
