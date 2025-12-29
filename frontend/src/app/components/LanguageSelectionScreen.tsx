import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface LanguageSelectionScreenProps {
  onComplete: () => void;
}

export function LanguageSelectionScreen({ onComplete }: LanguageSelectionScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = React.useState<'en' | 'ta'>('en');

  const handleContinue = () => {
    setLanguage(selectedLang);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
          <Globe className="w-10 h-10 text-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-black">Select Your Language</h2>
          <p className="text-gray-600">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <button
            onClick={() => setSelectedLang('en')}
            className={`w-full p-6 rounded-2xl border-2 transition-all ${
              selectedLang === 'en'
                ? 'border-yellow-400 bg-yellow-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-black">English</span>
              {selectedLang === 'en' && (
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedLang('ta')}
            className={`w-full p-6 rounded-2xl border-2 transition-all ${
              selectedLang === 'ta'
                ? 'border-yellow-400 bg-yellow-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-black">தமிழ்</span>
              {selectedLang === 'ta' && (
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={handleContinue}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg"
        >
          Continue / தொடரவும்
        </Button>
      </div>
    </div>
  );
}
