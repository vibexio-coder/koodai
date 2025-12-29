import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center">
      <div className="text-center space-y-6 animate-pulse">
        <div className="w-24 h-24 mx-auto bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg">
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-black">KOODAI</h1>
        <p className="text-gray-600">Your Everything Delivery App</p>
      </div>
    </div>
  );
}
