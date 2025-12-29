import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface OrderTrackingScreenProps {
  orderId: string;
  onBack: () => void;
}

export function OrderTrackingScreen({ orderId, onBack }: OrderTrackingScreenProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<string>('pending');

  const statusSteps = [
    { key: 'orderPlaced', status: 'pending' },
    { key: 'confirmed', status: 'confirmed' },
    { key: 'preparing', status: 'preparing' },
    { key: 'outForDelivery', status: 'out_for_delivery' },
    { key: 'delivered', status: 'delivered' },
  ];

  useEffect(() => {
    if (!orderId) return;

    const unsub = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        setStatus(doc.data().status);
      }
    });

    return () => unsub();
  }, [orderId]);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(s => s.status === status);
  };

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
          <div>
            <h1 className="text-xl font-bold text-black">{t('trackOrder')}</h1>
            <p className="text-sm text-black/80">Order #{orderId.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-64 bg-gradient-to-br from-yellow-100 to-yellow-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-yellow-600 mx-auto mb-2" />
            <p className="text-gray-600">Live tracking map</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Delivery Person */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black">Rajesh Kumar</p>
              <p className="text-sm text-gray-600">Delivery Partner</p>
            </div>
            <button className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-center">
          <p className="text-sm text-black/80 mb-1">{t('estimatedTime')}</p>
          <p className="text-3xl font-bold text-black">
            {status === 'delivered' ? 'Arrived' : '15-20 min'}
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const currentIndex = getCurrentStepIndex();
            const completed = index <= currentIndex;

            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                  >
                    {completed ? (
                      <span className="text-black font-bold">✓</span>
                    ) : (
                      <span className="text-gray-500">{index + 1}</span>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-0.5 h-12 ${completed ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className={`font-semibold ${completed ? 'text-black' : 'text-gray-400'}`}>
                    {t(step.key) || step.key}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
