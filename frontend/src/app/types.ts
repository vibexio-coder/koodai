export type Screen =
    | 'splash'
    | 'language'
    | 'onboarding'
    | 'login'
    | 'home'
    | 'stores'
    | 'products'
    | 'productDetail'
    | 'cart'
    | 'wishlist'
    | 'checkout'
    | 'orderTracking'
    | 'orders'
    | 'profile'
    | 'search'
    | 'ai-chef'
    | 'admin';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  storeName?: string;
}

export interface NavigationState {
    screen: Screen;
    data?: any;
}
