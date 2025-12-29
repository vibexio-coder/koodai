import React from 'react';
import { ArrowLeft, User, Globe, Settings, HelpCircle, Info, LogOut, ChevronRight, Database, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { seedDatabase } from '../services/seedData';
import { toast } from 'sonner';
import { Screen } from '../types';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onBack, onNavigate }: ProfileScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useUser();
  const [showLanguageDialog, setShowLanguageDialog] = React.useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const menuItems = [
    {
      icon: Globe,
      label: t('language'),
      value: language === 'en' ? 'English' : 'தமிழ்',
      onClick: () => setShowLanguageDialog(true),
    },
    {
      icon: Settings,
      label: t('settings'),
      onClick: () => { },
    },
    {
      icon: HelpCircle,
      label: t('help'),
      onClick: () => { },
    },
    {
      icon: Info,
      label: t('about'),
      onClick: () => { },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 pt-6 pb-12 shadow-md">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black">{t('myProfile')}</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="font-bold text-black text-lg">{user?.displayName || t('guestUser')}</h2>
              <p className="text-gray-600">
                {user?.phoneNumber ? `+91 ${user.phoneNumber}` : t('notLoggedIn')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-6 space-y-2 pb-32">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full bg-yellow-50 rounded-2xl p-4 border border-yellow-200 hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">{item.label}</p>
                    {item.value && (
                      <p className="text-sm text-gray-600">{item.value}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 rounded-2xl p-4 border border-red-200 hover:bg-red-100 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-red-600">{t('logout')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </div>
        </button>

        {/* Admin: Seed Database */}
        <button
          onClick={async () => {
            const success = await seedDatabase();
            if (success) toast.success('Database seeded!');
            else toast.error('Seeding failed.');
          }}
          className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-600">Seed Database (Admin)</p>
            </div>
          </div>
        </button>
        {/* Admin Dashboard */}
        <button
          onClick={() => onNavigate('admin')}
          className="w-full bg-blue-50 rounded-2xl p-4 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-blue-600">Admin Dashboard</p>
            </div>
          </div>
        </button>
      </div>

      {/* Language Selection Dialog */}
      {showLanguageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-black text-lg">{t('selectLanguage')}</h3>

            <button
              onClick={() => {
                setLanguage('en');
                setShowLanguageDialog(false);
              }}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${language === 'en'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black">English</span>
                {language === 'en' && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => {
                setLanguage('ta');
                setShowLanguageDialog(false);
              }}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${language === 'ta'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black">தமிழ்</span>
                {language === 'ta' && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setShowLanguageDialog(false)}
              className="w-full p-3 text-gray-600"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
