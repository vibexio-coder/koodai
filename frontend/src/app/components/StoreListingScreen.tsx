import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { stores as mockStores } from '../services/seedData';
import { Screen } from '../types';

interface StoreListingScreenProps {
  category: string;
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
}

export function StoreListingScreen({ category, onNavigate, onBack }: StoreListingScreenProps) {
  const { t } = useLanguage();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter stores locally based on the selected category
    const filtered = mockStores.filter(s => s.categories.includes(category));
    setStores(filtered);
    setLoading(false);
  }, [category]);

  const getCategoryTitle = () => {
    return t(category);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black capitalize">{getCategoryTitle()}</h1>
            <p className="text-sm text-black/80">{stores.length} {t('stores')}</p>
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading hotels...</div>
        ) : stores.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No hotels found in this category.</div>
        ) : (
          stores.map((store) => (
            <button
              key={store.id}
              onClick={() => onNavigate('products', { store })}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-lg text-left">{store.name}</h3>
                </div>
              </div>

              <div className="p-4 bg-yellow-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-black">{store.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{store.deliveryTime || store.time} {t('mins')}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{store.distance}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
