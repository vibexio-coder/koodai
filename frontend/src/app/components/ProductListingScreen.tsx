import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Plus, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from './ui/input';
import { productsList as mockProducts } from '../services/seedData';
import { Screen } from '../types';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

interface ProductListingScreenProps {
  store: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  cartCount: number;
}

export function ProductListingScreen({ store, onNavigate, onBack, onAddToCart, cartCount }: ProductListingScreenProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter products locally based on the selected store id
    const filtered = mockProducts.filter(p => p.storeId === store.id) as Product[];
    setProducts(filtered);
    setLoading(false);
  }, [store.id]);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-black">{store.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-sm text-black">{store.rating}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder={t('search')}
            className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
            >
              <button
                onClick={() => onNavigate('productDetail', { product })}
                className="w-full"
              >
                <div className="relative h-32 bg-yellow-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-black text-sm mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <p className="font-bold text-black">₹{product.price}</p>
                </div>
              </button>
              <div className="px-3 pb-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
