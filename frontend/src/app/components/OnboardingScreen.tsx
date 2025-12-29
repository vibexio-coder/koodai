import React, { useState } from 'react';
import { ShoppingBag, Truck, Grid3x3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: ShoppingBag,
    titleKey: 'onboarding1Title',
    descKey: 'onboarding1Desc',
    color: 'from-yellow-100 to-yellow-200',
  },
  {
    icon: Truck,
    titleKey: 'onboarding2Title',
    descKey: 'onboarding2Desc',
    color: 'from-orange-100 to-yellow-100',
  },
  {
    icon: Grid3x3,
    titleKey: 'onboarding3Title',
    descKey: 'onboarding3Desc',
    color: 'from-yellow-200 to-orange-100',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const Icon = slides[currentSlide].icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className={`w-64 h-64 bg-gradient-to-br ${slides[currentSlide].color} rounded-3xl flex items-center justify-center shadow-xl mb-8`}>
          <Icon className="w-32 h-32 text-yellow-600" />
        </div>

        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-black px-4">
            {t(slides[currentSlide].titleKey)}
          </h2>
          <p className="text-gray-600 px-6">
            {t(slides[currentSlide].descKey)}
          </p>
        </div>

        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-yellow-400'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-3">
        {currentSlide < slides.length - 1 ? (
          <>
            <Button
              onClick={handleNext}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg"
            >
              {t('next')}
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-gray-600 py-6"
            >
              {t('skip')}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg"
          >
            {t('getStarted')}
          </Button>
        )}
      </div>
    </div>
  );
}
