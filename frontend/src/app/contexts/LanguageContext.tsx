import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

const translations: Translations = {
  // App Name
  appName: { en: 'KOODAI', ta: 'கூடை' },

  // Language Selection
  selectLanguage: { en: 'Select Your Language', ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்' },
  english: { en: 'English', ta: 'English' },
  tamil: { en: 'தமிழ்', ta: 'தமிழ்' },
  continue: { en: 'Continue', ta: 'தொடரவும்' },

  // Onboarding
  onboarding1Title: { en: 'Order Everything You Need', ta: 'நீங்கள் தேவைப்படும் அனைத்தையும் ஆர்டர் செய்யுங்கள்' },
  onboarding1Desc: { en: 'Food, groceries, medicines & more delivered to your doorstep', ta: 'உணவு, மளிகை, மருந்துகள் மற்றும் பல உங்கள் வீட்டு வாசலுக்கு வழங்கப்படும்' },
  onboarding2Title: { en: 'Fast & Reliable Delivery', ta: 'வேகமான மற்றும் நம்பகமான டெலிவரி' },
  onboarding2Desc: { en: 'Get your orders delivered quickly and safely', ta: 'உங்கள் ஆர்டர்களை விரைவாகவும் பாதுகாப்பாகவும் பெறுங்கள்' },
  onboarding3Title: { en: 'Multiple Categories', ta: 'பல வகைகள்' },
  onboarding3Desc: { en: 'Choose from Food, Grocery, Fruits, Meat & Medicine', ta: 'உணவு, மளிகை, பழங்கள், இறைச்சி மற்றும் மருந்து என்பவற்றிலிருந்து தேர்வு செய்யுங்கள்' },
  skip: { en: 'Skip', ta: 'தவிர்' },
  next: { en: 'Next', ta: 'அடுத்து' },
  getStarted: { en: 'Get Started', ta: 'தொடங்குங்கள்' },

  // Login
  welcomeBack: { en: 'Welcome to KOODAI', ta: 'KOODAI க்கு வரவேற்கிறோம்' },
  loginDesc: { en: 'Enter your mobile number to continue', ta: 'தொடர உங்கள் மொபைல் எண்ணை உள்ளிடவும்' },
  mobileNumber: { en: 'Mobile Number', ta: 'மொபைல் எண்' },
  sendOTP: { en: 'Send OTP', ta: 'OTP அனுப்பு' },
  enterOTP: { en: 'Enter OTP', ta: 'OTP உள்ளிடவும்' },
  otpSent: { en: 'OTP sent to', ta: 'OTP அனுப்பப்பட்டது' },
  verify: { en: 'Verify', ta: 'சரிபார்' },
  resendOTP: { en: 'Resend OTP', ta: 'OTP மீண்டும் அனுப்பு' },

  // Home
  home: { en: 'Home', ta: 'முகப்பு' },
  searchPlaceholder: { en: 'Search for items or stores...', ta: 'பொருட்கள் அல்லது கடைகளைத் தேடுங்கள்...' },
  categories: { en: 'Categories', ta: 'வகைகள்' },
  orderNow: { en: 'Order Now', ta: 'இப்போது ஆர்டர் செய்யுங்கள்' },

  // Categories
  food: { en: 'Food Delivery', ta: 'உணவு வழங்கல்' },
  grocery: { en: 'Grocery & Essentials', ta: 'மளிகை மற்றும் அத்தியாவசியங்கள்' },
  fruits: { en: 'Fruits & Vegetables', ta: 'பழங்கள் மற்றும் காய்கறிகள்' },
  meat: { en: 'Meat & Fish', ta: 'இறைச்சி மற்றும் மீன்' },
  medicine: { en: 'Medicine', ta: 'மருந்து' },

  // Store Listing
  stores: { en: 'Stores', ta: 'கடைகள்' },
  restaurants: { en: 'Restaurants', ta: 'உணவகங்கள்' },
  nearYou: { en: 'Near You', ta: 'உங்களுக்கு அருகில்' },
  rating: { en: 'Rating', ta: 'மதிப்பீடு' },
  mins: { en: 'mins', ta: 'நிமிடங்கள்' },

  // Product
  addToCart: { en: 'Add to Cart', ta: 'கூடையில் சேர்' },
  outOfStock: { en: 'Out of Stock', ta: 'கையிருப்பில் இல்லை' },
  reviews: { en: 'Reviews', ta: 'விமர்சனங்கள்' },
  description: { en: 'Description', ta: 'விளக்கம்' },

  // Cart
  cart: { en: 'Cart', ta: 'கூடை' },
  yourCart: { en: 'Your Cart', ta: 'உங்கள் கூடை' },
  emptyCart: { en: 'Your cart is empty', ta: 'உங்கள் கூடை காலியாக உள்ளது' },
  subtotal: { en: 'Subtotal', ta: 'மொத்தம்' },
  deliveryFee: { en: 'Delivery Fee', ta: 'டெலிவரி கட்டணம்' },
  total: { en: 'Total', ta: 'மொத்த தொகை' },
  proceedToCheckout: { en: 'Proceed to Checkout', ta: 'செக்அவுட்டுக்கு செல்லவும்' },

  // Checkout
  checkout: { en: 'Checkout', ta: 'செக்அவுட்' },
  deliveryAddress: { en: 'Delivery Address', ta: 'டெலிவரி முகவரி' },
  changeAddress: { en: 'Change', ta: 'மாற்று' },
  addAddress: { en: 'Add New Address', ta: 'புதிய முகவரியை சேர்' },
  paymentMethod: { en: 'Payment Method', ta: 'கட்டண முறை' },
  cashOnDelivery: { en: 'Cash on Delivery', ta: 'பணம் பெற்றபின் டெலிவரி' },
  placeOrder: { en: 'Place Order', ta: 'ஆர்டர் செய்யுங்கள்' },

  // Order Tracking
  trackOrder: { en: 'Track Order', ta: 'ஆர்டரைக் கண்காணிக்கவும்' },
  orderPlaced: { en: 'Order Placed', ta: 'ஆர்டர் செய்யப்பட்டது' },
  preparing: { en: 'Preparing', ta: 'தயாரிக்கப்படுகிறது' },
  outForDelivery: { en: 'Out for Delivery', ta: 'டெலிவரிக்கு வெளியே' },
  delivered: { en: 'Delivered', ta: 'டெலிவர் செய்யப்பட்டது' },
  estimatedTime: { en: 'Estimated Time', ta: 'மதிப்பிடப்பட்ட நேரம்' },

  // Orders
  orders: { en: 'Orders', ta: 'ஆர்டர்கள்' },
  myOrders: { en: 'My Orders', ta: 'என் ஆர்டர்கள்' },
  orderHistory: { en: 'Order History', ta: 'ஆர்டர் வரலாறு' },
  noOrders: { en: 'No orders yet', ta: 'இதுவரை ஆர்டர்கள் இல்லை' },
  reorder: { en: 'Reorder', ta: 'மீண்டும் ஆர்டர்' },

  // Profile
  profile: { en: 'Profile', ta: 'சுயவிவரம்' },
  myProfile: { en: 'My Profile', ta: 'என் சுயவிவரம்' },
  language: { en: 'Language', ta: 'மொழி' },
  settings: { en: 'Settings', ta: 'அமைப்புகள்' },
  help: { en: 'Help & Support', ta: 'உதவி மற்றும் ஆதரவு' },
  about: { en: 'About', ta: 'பற்றி' },
  logout: { en: 'Logout', ta: 'வெளியேறு' },

  // Common
  back: { en: 'Back', ta: 'பின்செல்' },
  save: { en: 'Save', ta: 'சேமி' },
  cancel: { en: 'Cancel', ta: 'ரத்து செய்' },
  delete: { en: 'Delete', ta: 'அழி' },
  edit: { en: 'Edit', ta: 'திருத்து' },
  search: { en: 'Search', ta: 'தேடு' },
  filter: { en: 'Filter', ta: 'வடிகட்டு' },
  sort: { en: 'Sort', ta: 'வரிசைப்படுத்து' },
  apply: { en: 'Apply', ta: 'பயன்படுத்து' },
  clear: { en: 'Clear', ta: 'அழி' },
  close: { en: 'Close', ta: 'மூடு' },
  viewAll: { en: 'View All', ta: 'அனைத்தையும் பார்' },
  viewDetails: { en: 'View Details', ta: 'விவரங்களைப் பார்' },

  // Items
  item: { en: 'item', ta: 'பொருள்' },
  items: { en: 'items', ta: 'பொருட்கள்' },

  // AI Chef
  aiChefAssistant: { en: 'AI Chef Assistant', ta: 'AI சமையல் உதவியாளர்' },
  chefGreeting: { en: "Tell me what you want to cook, and I'll prepare the shopping list for you!", ta: 'நீங்கள் என்ன சமைக்க விரும்புகிறீர்கள் என்று சொல்லுங்கள், உங்களுக்காக ஷாப்பிங் பட்டியலைத் தயார் செய்கிறேன்!' },
  chefPlaceholder: { en: 'e.g., Biryani, Pasta, Pizza...', ta: 'உதாரணமாக, பிரியாணி, பாஸ்தா, பீட்சா...' },
  servingsLabel: { en: 'Number of Servings', ta: 'நபர்களின் எண்ணிக்கை' },
  chefThinking: { en: 'Chef is thinking...', ta: 'சமையல்காரர் யோசிக்கிறார்...' },
  analysingRecipe: { en: 'Analysing recipe...', ta: 'சமையல் குறிப்பை ஆராய்கிறது...' },
  varietyPrompt: { en: 'Which variety would you like?', ta: 'உங்களுக்கு எந்த வகை வேண்டும்?' },
  ingredientsTab: { en: 'Ingredients', ta: 'தேவையான பொருட்கள்' },
  preparationTab: { en: 'Preparation', ta: 'தயாரிக்கும் முறை' },
  ingredientsNeeded: { en: 'Ingredients Needed', ta: 'தேவையான பொருட்கள்' },
  addAllToCart: { en: 'Add All to Cart', ta: 'அனைத்தையும் கூடையில் சேர்' },
  noIngredientsFound: { en: 'No ingredients found. Try a different dish!', ta: 'பொருட்கள் எதுவும் கிடைக்கவில்லை. வேறு உணவை முயற்சிக்கவும்!' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
