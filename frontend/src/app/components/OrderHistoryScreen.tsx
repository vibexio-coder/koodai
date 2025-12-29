import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Screen } from '../types';

interface OrderHistoryScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

const mockOrders = [
  {
    id: 'ORD12345',
    date: 'Dec 24, 2025',
    items: 3,
    total: 450,
    status: 'Delivered',
    storeName: 'Saravana Bhavan',
  },
  {
    id: 'ORD12344',
    date: 'Dec 20, 2025',
    items: 5,
    total: 680,
    status: 'Delivered',
    storeName: 'Fresh Vegetables Market',
  },
  {
    id: 'ORD12343',
    date: 'Dec 18, 2025',
    items: 2,
    total: 320,
    status: 'Cancelled',
    storeName: 'MedPlus Pharmacy',
  },
];

export function OrderHistoryScreen({ onBack, onNavigate }: OrderHistoryScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black">{t('orderHistory')}</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 py-6 space-y-4 pb-32">
        {mockOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <p className="text-gray-600 text-center">{t('noOrders')}</p>
          </div>
        ) : (
          mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-black">{order.storeName}</p>
                  <p className="text-sm text-gray-600 mt-1">Order #{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}
                >
                  {order.status}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-yellow-200">
                <div>
                  <p className="text-sm text-gray-600">
                    {order.items} {order.items === 1 ? t('item') : t('items')}
                  </p>
                  <p className="font-bold text-black mt-1">₹{order.total}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'Delivered' && (
                    <Button
                      variant="outline"
                      className="border-yellow-400 text-black hover:bg-yellow-50"
                    >
                      {t('reorder')}
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      onNavigate('orderTracking', { orderId: order.id })
                    }
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    {t('viewDetails')}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
