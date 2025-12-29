import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { SplashScreen } from './components/SplashScreen';
import { LanguageSelectionScreen } from './components/LanguageSelectionScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { StoreListingScreen } from './components/StoreListingScreen';
import { ProductListingScreen } from './components/ProductListingScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AIChefScreen } from './components/AIChefScreen';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { orderService } from './services/orderService';
import { useUser } from './contexts/UserContext';

import { Screen, CartItem, NavigationState } from './types.ts';

function AppContent() {
  const [currentNav, setCurrentNav] = useState<NavigationState>({
    screen: 'splash',
  });
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const navigate = (screen: Screen, data?: any) => {
    setNavigationStack([...navigationStack, currentNav]);
    setCurrentNav({ screen, data });
  };

  const goBack = () => {
    if (navigationStack.length > 0) {
      const previous = navigationStack[navigationStack.length - 1];
      setNavigationStack(navigationStack.slice(0, -1));
      setCurrentNav(previous);
    } else {
      setCurrentNav({ screen: 'home' });
    }
  };

  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    toast.success('Added to cart!');
  };

  const addMultipleToCart = (items: any[]) => {
    let newCart = [...cart];
    items.forEach(product => {
      const existingItemIndex = newCart.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        newCart[existingItemIndex].quantity += product.quantity;
      } else {
        newCart.push(product);
      }
    });
    setCart(newCart);
    toast.success('All ingredients added to cart!');
    navigate('cart');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success('Removed from cart');
  };

  const { user } = useUser();

  const placeOrder = async () => {
    // No login check needed for local mock mode
    try {
      // Simulate a short network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

      setCart([]);
      navigate('orderTracking', { orderId });
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const renderScreen = () => {
    switch (currentNav.screen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('language')} />;

      case 'language':
        return <LanguageSelectionScreen onComplete={() => navigate('onboarding')} />;

      case 'onboarding':
        return <OnboardingScreen onComplete={() => navigate('login')} />;

      case 'login':
        return <LoginScreen onComplete={() => navigate('home')} />;

      case 'home':
        return (
          <HomeScreen
            onNavigate={navigate}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        );

      case 'stores':
        return (
          <StoreListingScreen
            category={currentNav.data?.category || 'food'}
            onNavigate={navigate}
            onBack={goBack}
          />
        );

      case 'products':
        return (
          <ProductListingScreen
            store={currentNav.data?.store}
            onNavigate={navigate}
            onBack={goBack}
            onAddToCart={addToCart}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        );

      case 'productDetail':
        return (
          <ProductDetailScreen
            product={currentNav.data?.product}
            onBack={goBack}
            onAddToCart={addToCart}
          />
        );

      case 'cart':
        return (
          <CartScreen
            cart={cart}
            onBack={goBack}
            onNavigate={navigate}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            cart={cart}
            onBack={goBack}
            onPlaceOrder={placeOrder}
          />
        );

      case 'orderTracking':
        return (
          <OrderTrackingScreen
            orderId={currentNav.data?.orderId || 'ORD12345'}
            onBack={() => navigate('home')}
          />
        );

      case 'orders':
        return (
          <OrderHistoryScreen
            onBack={goBack}
            onNavigate={navigate}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onBack={goBack}
            onNavigate={navigate}
          />
        );

      case 'search':
        goBack();
        return null;

      case 'ai-chef':
        return (
          <AIChefScreen
            onBack={goBack}
            onAddToCart={addMultipleToCart}
          />
        );

      case 'admin':
        window.location.href = '/admin.html';
        return null;

      default:
        return <HomeScreen onNavigate={navigate} cartCount={cart.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto relative bg-white min-h-screen shadow-xl">
        {renderScreen()}

        {['home', 'orders', 'cart', 'profile', 'stores', 'products', 'productDetail'].includes(currentNav.screen) && (
          <BottomNav
            currentScreen={currentNav.screen}
            onNavigate={navigate}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>
  );
}
