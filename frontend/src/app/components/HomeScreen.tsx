import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ShoppingBag,
  Store,
  Apple,
  Beef,
  Pill,
  Sparkles,
  ChefHat,
  Home,
  Package,
  Utensils,
  Heart,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Input } from "./ui/input";
import { db } from "../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { categories as mockCategories } from "../services/seedData";
import { Screen } from "../types";

interface HomeScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  cartCount: number;
  wishlistCount?: number;
  onAddToWishlist?: (product: any) => void; // Add this line
}

const iconMap: { [key: string]: React.ElementType } = {
  ShoppingBag,
  Store,
  Apple,
  Beef,
  Pill,
  ShoppingCart,
  ChefHat,
  Sparkles,
  Home,
  Package,
  Utensils,
  Heart,
  "shopping-bag": ShoppingBag,
  store: Store,
  apple: Apple,
  beef: Beef,
  pill: Pill,
  home: Home,
  package: Package,
  utensils: Utensils,
  heart: Heart,
};

export function HomeScreen({ 
  onNavigate, 
  cartCount, 
  wishlistCount = 0, 
  onAddToWishlist 
}: HomeScreenProps) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query categories collection, order by order field
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const firebaseCategories = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            icon: iconMap[data.icon] || ShoppingBag,
            iconName: data.icon || "ShoppingBag",
            image: data.image || "",
            labelKey:
              data.name?.toLowerCase().replace(/\s+/g, "") || "category",
            color: getColorForCategory(data.name),
            status: data.status || "active",
            order: data.order || 0,
          };
        });

        // If Firebase returns categories, use them
        if (firebaseCategories.length > 0) {
          setCategories(firebaseCategories);
        } else {
          // Fallback to mock data if Firebase is empty
          console.log("No categories found in Firebase, using mock data");
          setCategories(
            mockCategories.map((cat) => ({
              ...cat,
              icon: iconMap[cat.iconName] || ShoppingBag,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Using sample data.");

        // Fallback to mock data on error
        setCategories(
          mockCategories.map((cat) => ({
            ...cat,
            icon: iconMap[cat.iconName] || ShoppingBag,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to assign colors based on category name
  const getColorForCategory = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
      food: "from-orange-500 to-yellow-50",
      groceries: "from-green-500 to-emerald-50",
      meat: "from-rose-500 to-red-50",
      medicine: "from-blue-500 to-cyan-50",
      fruits: "from-amber-500 to-orange-50",
      dress: "from-cyan-500 to-cyan-50",
      default: "from-purple-500 to-purple-100",
    };

    const lowerName = categoryName?.toLowerCase() || "";

    // Check for keywords in category name
    for (const [key, color] of Object.entries(colorMap)) {
      if (lowerName.includes(key)) {
        return color;
      }
    }

    return colorMap["default"];
  };

  // Function to handle image source (base64 or URL)
  const getImageSource = (image: string): string => {
    if (!image) return "/placeholder-image.jpg";

    if (image.startsWith("data:image")) {
      return image;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return "/placeholder-image.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">KOODAI</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-black" />
              <span className="text-sm text-black font-medium">
                Deliver to Home • Chennai
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("profile")}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <User className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Search for restaurants, dishes, or categories..."
            className="w-full pl-14 pr-4 py-6 bg-white border-0 rounded-2xl shadow-lg text-black placeholder-gray-500"
            onClick={() => onNavigate("search")}
          />
        </div>
      </div>

      {/* AI Chef Banner */}
      <div className="px-6 -mt-4 mb-8 relative z-10">
        <button
          onClick={() => onNavigate("ai-chef")}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-5 shadow-xl flex items-center justify-between hover:shadow-2xl transition-all duration-300"
        >
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur font-semibold">
                NEW
              </span>
              <span className="text-purple-100 text-xs flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </div>
            <h3 className="font-bold text-white text-xl mb-1">
              AI Chef Assistant
            </h3>
            <p className="text-purple-100 text-sm">
              Get ingredients list automatically!
            </p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur border border-white/30">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
        </button>
      </div>

      {/* Categories Section */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <p className="text-gray-500 text-sm mt-1">
              Browse by your favorite cuisine
            </p>
          </div>
          {error && (
            <span className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
              {error}
            </span>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              No categories found
            </p>
            <p className="text-gray-500 text-sm">
              Add categories from the admin dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories
              .filter((cat) => cat.status === "active")
              .map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      onNavigate("stores", {
                        category: category.id,
                        categoryName: category.name,
                      })
                    }
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group"
                  >
                    {/* Image Container */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={getImageSource(category.image)}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-50`}
                      />

                      {/* Icon Badge */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-center text-[15px] mb-1">
                        {category.name}
                      </h3>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl px-6 py-3 flex justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center text-yellow-500"
        >
          <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-1">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => onNavigate("orders")}
          className="flex flex-col items-center text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1 hover:bg-yellow-50 transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Orders</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate("wishlist")}
          className="flex flex-col items-center text-gray-400 hover:text-red-500 transition-colors relative"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1 hover:bg-red-50 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate("cart")}
          className="flex flex-col items-center text-gray-400 hover:text-yellow-500 transition-colors relative"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1 hover:bg-yellow-50 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Cart</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate("profile")}
          className="flex flex-col items-center text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1 hover:bg-yellow-50 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}