import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  Search,
  Filter,
  X,
  Clock,
  DollarSign,
  Timer,
  Leaf,
  ChefHat,
  Flame,
  SearchX,
  Pill,
  ShoppingCart,
  Beef,
  Croissant,
  Bone,
  Percent,
  Truck,
  Shield,
  Heart,
  Apple,
  Shirt,
  Smartphone,
  Package,
  Weight,
  Scale,
  Thermometer,
  Battery,
  Droplets,
  Scissors,
  Hash,
  Users,
  Clipboard,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Input } from "./ui/input";
import { Screen } from "../types";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface MenuItem {
  weight: any;
  manufacturer: any;
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  rating?: number;
  isVeg: boolean;
  spicyLevel?: string;
  preparationTime?: string;
  available: boolean;
  categoryName?: string;
  productType?: string;

  // Food specific
  foodType?: string;
  cuisine?: string;
  ingredients?: string;
  calories?: string;
  bestSeller?: boolean;
  packagingType?: string;

  // Groceries specific
  groceryType?: string;
  netWeight?: string;
  groceryManufacturer?: string;
  groceryStorageInstructions?: string;
  countryOfOrigin?: string;

  // Dress specific
  gender?: string;
  size?: string;
  colorOptions?: string;
  fabricMaterial?: string;
  fitType?: string;
  occasion?: string;

  // Fruits & Vegetables specific
  fruitsType?: string;
  organic?: boolean;
  fruitsWeight?: string;
  freshnessDuration?: string;
  sourceLocation?: string;

  // Medicine specific
  medicineType?: string;
  prescriptionRequired?: boolean;
  saltComposition?: string;
  expiryDate?: string;
  batchNumber?: string;

  // Meat & Fish specific
  meatType?: string;
  cutType?: string;
  meatWeight?: string;
  freshness?: string;
  meatSource?: string;
  deliveryTimeSlot?: string;

  // Badges for display
  badges?: string[];

  // Hotel info
  hotelId?: string;
  hotelName?: string;

  // Cart specific
  quantity?: number;
}

interface ProductListingScreenProps {
  store: any;
  restaurantData: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
  onAddToCart: (product: MenuItem) => void;
  cartCount: number;
}

export function ProductListingScreen({
  store,
  restaurantData,
  onNavigate,
  onBack,
  onAddToCart,
  cartCount,
}: ProductListingScreenProps) {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const [foodFilters, setFoodFilters] = useState({
    vegOnly: false,
    nonVegOnly: false,
    spicyOnly: false,
    bestSeller: false,
    availableOnly: true,
    cuisineFilter: "all",
  });

  const [medicalFilters, setMedicalFilters] = useState({
    prescriptionOnly: false,
    otcOnly: false,
    genericOnly: false,
    availableOnly: true,
    medicineTypeFilter: "all",
  });

  const [groceryFilters, setGroceryFilters] = useState({
    freshOnly: false,
    packagedOnly: false,
    organicOnly: false,
    availableOnly: true,
    groceryTypeFilter: "all",
  });

  const [meatFilters, setMeatFilters] = useState({
    freshOnly: false,
    frozenOnly: false,
    organicOnly: false,
    availableOnly: true,
    meatTypeFilter: "all",
  });

  const [fruitsFilters, setFruitsFilters] = useState({
    organicOnly: false,
    freshOnly: false,
    seasonalOnly: false,
    availableOnly: true,
    fruitsTypeFilter: "all",
  });

  const [dressFilters, setDressFilters] = useState({
    menOnly: false,
    womenOnly: false,
    unisexOnly: false,
    availableOnly: true,
    dressTypeFilter: "all",
  });

  const parseWeight = (weightString: string): { value: number; unit: string; isKg: boolean } => {
    if (!weightString) return { value: 0, unit: '', isKg: false };
    
    // Extract numeric value and unit
    const match = weightString.match(/(\d+(\.\d+)?)\s*(kg|g|ml|l|lb|oz)?/i);
    if (!match) return { value: 0, unit: '', isKg: false };
    
    const value = parseFloat(match[1]);
    const unit = match[3]?.toLowerCase() || '';
    
    if (unit === 'g' || unit === 'gm' || unit === 'gram') {
      return { value: value / 1000, unit: 'g', isKg: false };
    } else if (unit === 'kg' || unit === 'kilo' || unit === 'kilogram') {
      return { value, unit: 'kg', isKg: true };
    }
    
    return { value, unit, isKg: false };
  };

  // Calculate price per kg
  const calculatePricePerKg = (price: number, weightString: string): string => {
    const weight = parseWeight(weightString);
    if (weight.value <= 0) return '';
    
    const pricePerKg = price / weight.value;
    
    if (weight.unit === 'g') {
      const weightInKg = weight.value / 1000;
      const pricePerKgFromGrams = price / weightInKg;
      return `₹${pricePerKgFromGrams.toFixed(2)}/kg`;
    }
    
    return `₹${pricePerKg.toFixed(2)}/kg`;
  };

  const formatWeightDisplay = (weightString: string): string => {
    if (!weightString) return '';
    
    const weight = parseWeight(weightString);
    if (weight.value <= 0) return '';
    
    if (weight.unit === 'g') {
      return `${(weight.value * 1000).toFixed(0)}g`;
    }
    
    return `${weight.value}${weight.unit}`;
  };

  // Get current filters based on store type
  const getCurrentFilters = () => {
    switch (store?.categoryName) {
      case "Food":
        return foodFilters;
      case "Medicine":
        return medicalFilters;
      case "Groceries":
        return groceryFilters;
      case "Fruits & Vegetables":
        return fruitsFilters;
      case "Meat & Fish":
        return meatFilters;
      case "Dress & Gadgets":
        return dressFilters;
      default:
        return foodFilters;
    }
  };

  // Get filter icon based on store type
  const getFilterIcon = () => {
    switch (store?.categoryName) {
      case "Medicine":
        return <Pill className="w-4 h-4" />;
      case "Groceries":
        return <ShoppingCart className="w-4 h-4" />;
      case "Fruits & Vegetables":
        return <Apple className="w-4 h-4" />;
      case "Meat & Fish":
        return <Beef className="w-4 h-4" />;
      case "Dress & Gadgets":
        return <Shirt className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);

        const menuRef = collection(db, "menu");

        // Query menu items for this restaurant
        const q = query(
          menuRef,
          where("hotelId", "==", store.id),
          where("status", "==", "active")
        );

        const querySnapshot = await getDocs(q);

        const items: MenuItem[] = [];
        const categorySet = new Set<string>();

        querySnapshot.forEach((doc) => {
          const itemData = doc.data();
          const menuItem: MenuItem = {
            id: doc.id,
            name: itemData.name || "Unnamed Item",
            price: parseFloat(itemData.price) || 0,
            image: itemData.image || "/placeholder-food.jpg",
            description: itemData.description,
            rating: itemData.rating || 0,
            isVeg: itemData.isVeg !== false,
            spicyLevel: itemData.spicyLevel,
            preparationTime: itemData.preparationTime,
            available: itemData.available !== false,
            categoryName: itemData.categoryName,
            productType: itemData.productType,

            // Required properties
            weight: itemData.weight || itemData.netWeight || itemData.fruitsWeight || itemData.meatWeight,
            manufacturer: itemData.manufacturer,

            // Food specific
            foodType: itemData.foodType,
            cuisine: itemData.cuisine,
            ingredients: itemData.ingredients,
            calories: itemData.calories,
            bestSeller: itemData.bestSeller,
            packagingType: itemData.packagingType,

            // Groceries specific
            groceryType: itemData.groceryType,
            netWeight: itemData.netWeight,
            groceryManufacturer: itemData.groceryManufacturer,
            groceryStorageInstructions: itemData.groceryStorageInstructions,
            countryOfOrigin: itemData.countryOfOrigin,

            // Dress specific
            gender: itemData.gender,
            size: itemData.size,
            colorOptions: itemData.colorOptions,
            fabricMaterial: itemData.fabricMaterial,
            fitType: itemData.fitType,
            occasion: itemData.occasion,

            // Fruits & Vegetables specific
            fruitsType: itemData.fruitsType,
            organic: itemData.organic,
            fruitsWeight: itemData.fruitsWeight,
            freshnessDuration: itemData.freshnessDuration,
            sourceLocation: itemData.sourceLocation,

            // Medicine specific
            medicineType: itemData.medicineType,
            prescriptionRequired: itemData.prescriptionRequired,
            saltComposition: itemData.saltComposition,
            expiryDate: itemData.expiryDate,
            batchNumber: itemData.batchNumber,

            // Meat & Fish specific
            meatType: itemData.meatType,
            cutType: itemData.cutType,
            meatWeight: itemData.meatWeight,
            freshness: itemData.freshness,
            meatSource: itemData.meatSource,
            deliveryTimeSlot: itemData.deliveryTimeSlot,

            // Badges
            badges: itemData.badges || [],

            // Hotel info
            hotelId: itemData.hotelId,
            hotelName: itemData.hotelName,
          };

          items.push(menuItem);
          
          // Initialize quantity to 0
          setQuantities(prev => ({ ...prev, [menuItem.id]: 0 }));

          // Collect unique categories
          if (menuItem.categoryName) {
            categorySet.add(menuItem.categoryName);
          }
        });

        // Sort items by name
        items.sort((a, b) => a.name.localeCompare(b.name));

        setMenuItems(items);
        setFilteredItems(items);

        // Set categories
        const categoryList = Array.from(categorySet);
        setCategories(["all", ...categoryList]);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (store?.id) {
      fetchMenuItems();
    } else {
      console.error("No store ID provided");
      setLoading(false);
    }
  }, [store?.id]);

  // Apply filters based on store type
  useEffect(() => {
    let filtered = [...menuItems];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.categoryName?.toLowerCase().includes(query) ||
          item.productType?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.categoryName === activeCategory
      );
    }

    // Apply filters based on store type
    switch (store?.categoryName) {
      case "Food":
        if (foodFilters.vegOnly) {
          filtered = filtered.filter((item) => item.isVeg === true);
        }
        if (foodFilters.nonVegOnly) {
          filtered = filtered.filter((item) => item.isVeg === false);
        }
        if (foodFilters.spicyOnly) {
          filtered = filtered.filter(
            (item) =>
              item.spicyLevel === "Spicy" || item.spicyLevel === "Very Spicy"
          );
        }
        if (foodFilters.bestSeller) {
          filtered = filtered.filter((item) => item.bestSeller === true);
        }
        if (foodFilters.cuisineFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.cuisine === foodFilters.cuisineFilter
          );
        }
        if (foodFilters.availableOnly) {
          filtered = filtered.filter((item) => item.available !== false);
        }
        break;

      case "Medicine":
        if (medicalFilters.prescriptionOnly) {
          filtered = filtered.filter(
            (item) => item.prescriptionRequired === true
          );
        }
        if (medicalFilters.otcOnly) {
          filtered = filtered.filter(
            (item) => item.prescriptionRequired === false
          );
        }
        // Apply medicine type filter
        if (medicalFilters.medicineTypeFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.medicineType === medicalFilters.medicineTypeFilter
          );
        }
        // Check expiry for medicines
        if (medicalFilters.availableOnly) {
          filtered = filtered.filter((item) => {
            if (item.expiryDate) {
              const expiryDate = new Date(item.expiryDate);
              const today = new Date();
              return expiryDate > today && item.available !== false;
            }
            return item.available !== false;
          });
        }
        break;

      case "Groceries":
        // Apply grocery filters
        if (groceryFilters.freshOnly) {
          filtered = filtered.filter(
            (item) =>
              item.groceryType?.toLowerCase().includes("fresh") ||
              item.netWeight?.toLowerCase().includes("fresh")
          );
        }
        if (groceryFilters.packagedOnly) {
          filtered = filtered.filter(
            (item) =>
              item.packagingType?.toLowerCase().includes("packet") ||
              item.packagingType?.toLowerCase().includes("box") ||
              item.packagingType?.toLowerCase().includes("bottle")
          );
        }
        if (groceryFilters.organicOnly) {
          filtered = filtered.filter((item) =>
            item.groceryType?.toLowerCase().includes("organic")
          );
        }
        // Apply grocery type filter
        if (groceryFilters.groceryTypeFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.groceryType === groceryFilters.groceryTypeFilter
          );
        }
        if (groceryFilters.availableOnly) {
          filtered = filtered.filter((item) => item.available !== false);
        }
        break;

      case "Fruits & Vegetables":
        // Apply fruits filters
        if (fruitsFilters.organicOnly) {
          filtered = filtered.filter((item) => item.organic === true);
        }
        if (fruitsFilters.freshOnly) {
          filtered = filtered.filter(
            (item) =>
              item.freshnessDuration?.toLowerCase().includes("fresh") ||
              item.fruitsType?.toLowerCase().includes("fresh")
          );
        }
        if (fruitsFilters.seasonalOnly) {
          filtered = filtered.filter((item) =>
            item.fruitsType?.toLowerCase().includes("seasonal")
          );
        }
        // Apply fruits type filter
        if (fruitsFilters.fruitsTypeFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.fruitsType === fruitsFilters.fruitsTypeFilter
          );
        }
        if (fruitsFilters.availableOnly) {
          filtered = filtered.filter((item) => item.available !== false);
        }
        break;

      case "Meat & Fish":
        // Apply meat filters
        if (meatFilters.freshOnly) {
          filtered = filtered.filter((item) =>
            item.freshness?.toLowerCase().includes("fresh")
          );
        }
        if (meatFilters.frozenOnly) {
          filtered = filtered.filter((item) =>
            item.freshness?.toLowerCase().includes("frozen")
          );
        }
        if (meatFilters.organicOnly) {
          filtered = filtered.filter((item) =>
            item.meatType?.toLowerCase().includes("organic")
          );
        }
        // Apply meat type filter
        if (meatFilters.meatTypeFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.meatType === meatFilters.meatTypeFilter
          );
        }
        if (meatFilters.availableOnly) {
          filtered = filtered.filter((item) => item.available !== false);
        }
        break;

      case "Dress & Gadgets":
        // Apply dress filters
        if (dressFilters.menOnly) {
          filtered = filtered.filter(
            (item) =>
              item.gender?.toLowerCase().includes("men") ||
              item.gender?.toLowerCase().includes("male")
          );
        }
        if (dressFilters.womenOnly) {
          filtered = filtered.filter(
            (item) =>
              item.gender?.toLowerCase().includes("women") ||
              item.gender?.toLowerCase().includes("female")
          );
        }
        if (dressFilters.unisexOnly) {
          filtered = filtered.filter((item) =>
            item.gender?.toLowerCase().includes("unisex")
          );
        }
        // Apply dress type filter
        if (dressFilters.dressTypeFilter !== "all") {
          filtered = filtered.filter(
            (item) => item.occasion === dressFilters.dressTypeFilter
          );
        }
        if (dressFilters.availableOnly) {
          filtered = filtered.filter((item) => item.available !== false);
        }
        break;

      default:
        // Apply availability filter for all
        filtered = filtered.filter((item) => item.available !== false);
    }

    setFilteredItems(filtered);
  }, [
    menuItems,
    searchQuery,
    activeCategory,
    store?.categoryName,
    foodFilters,
    medicalFilters,
    groceryFilters,
    meatFilters,
    fruitsFilters,
    dressFilters,
  ]);

  // Get image source
  const getImageSource = (image: string) => {
    if (!image) {
      // Return default image based on store type
      switch (store?.categoryName) {
        case "Medicine":
          return "/placeholder-medicine.jpg";
        case "Groceries":
          return "/placeholder-grocery.jpg";
        case "Fruits & Vegetables":
          return "/placeholder-fruits.jpg";
        case "Meat & Fish":
          return "/placeholder-meat.jpg";
        case "Dress & Gadgets":
          return "/placeholder-dress.jpg";
        default:
          return "/placeholder-food.jpg";
      }
    }

    if (image.startsWith("data:image")) {
      return image;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return "/placeholder-food.jpg";
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");

    // Reset filters based on store type
    switch (store?.categoryName) {
      case "Food":
        setFoodFilters({
          vegOnly: false,
          nonVegOnly: false,
          spicyOnly: false,
          bestSeller: false,
          availableOnly: true,
          cuisineFilter: "all",
        });
        break;
      case "Medicine":
        setMedicalFilters({
          prescriptionOnly: false,
          otcOnly: false,
          genericOnly: false,
          availableOnly: true,
          medicineTypeFilter: "all",
        });
        break;
      case "Groceries":
        setGroceryFilters({
          freshOnly: false,
          packagedOnly: false,
          organicOnly: false,
          availableOnly: true,
          groceryTypeFilter: "all",
        });
        break;
      case "Fruits & Vegetables":
        setFruitsFilters({
          organicOnly: false,
          freshOnly: false,
          seasonalOnly: false,
          availableOnly: true,
          fruitsTypeFilter: "all",
        });
        break;
      case "Meat & Fish":
        setMeatFilters({
          freshOnly: false,
          frozenOnly: false,
          organicOnly: false,
          availableOnly: true,
          meatTypeFilter: "all",
        });
        break;
      case "Dress & Gadgets":
        setDressFilters({
          menOnly: false,
          womenOnly: false,
          unisexOnly: false,
          availableOnly: true,
          dressTypeFilter: "all",
        });
        break;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Handle add to cart with quantity
  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 0;
    
    // If quantity is 0, just add one
    if (quantity === 0) {
      setQuantities(prev => ({ ...prev, [item.id]: 1 }));
      onAddToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
        description: item.description,
        available: item.available,
        weight: item.weight,
        manufacturer: item.manufacturer,
        quantity: 1
      });
    } else {
      // Quantity is already set via the quantity selector
      onAddToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
        description: item.description,
        available: item.available,
        weight: item.weight,
        manufacturer: item.manufacturer,
        quantity: quantity
      });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
    
    // If quantity becomes 0 and was previously > 0, we might want to remove from cart
    // This depends on your cart implementation
  };

  // Render category-specific badges on product card
  const renderProductBadges = (item: MenuItem) => {
    const badges: React.ReactNode[] = [];

    /* 🔹 Veg / Non-Veg Badge (Food only) */
    if (item.categoryName === "Food") {
      if (item.isVeg) {
        badges.push(
          <span
            key="veg"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                     bg-green-50 text-green-700 border border-green-200"
          >
            <span className="w-3 h-3 border border-green-700 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-green-700 rounded-full" />
            </span>
            Veg
          </span>
        );
      } else {
        badges.push(
          <span
            key="nonveg"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                     bg-red-50 text-red-700 border border-red-200"
          >
            <span className="w-3 h-3 border border-red-700 flex items-center justify-center">
              <span
                className="w-0 h-0
                border-l-[3px] border-l-transparent
                border-r-[3px] border-r-transparent
                border-b-[5px] border-b-red-700"
              />
            </span>
          </span>
        );
      }
    }

    /* 🔹 Bestseller Badge */
    if (item.bestSeller) {
      badges.push(
        <span
          key="bestseller"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                   bg-yellow-50 text-yellow-700 border border-yellow-300"
        >
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          Bestseller
        </span>
      );
    }

    if (item.badges?.length) {
      item.badges.forEach((badge) => {
        badges.push(
          <span
            key={badge}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px]
                     bg-gray-100 text-gray-700 border border-gray-200"
          >
            {badge}
          </span>
        );
      });
    }

    return badges.slice(0, 3); // keep UI clean
  };

  // Render weight and price per kg information
  const renderWeightAndPriceInfo = (item: MenuItem) => {
    const category = item.categoryName;
    const weight = item.weight || item.netWeight || item.fruitsWeight || item.meatWeight;
    
    if (!weight) return null;
    
    // Show weight and price per kg for Meat & Fish, Fruits & Vegetables
    if (category === "Meat & Fish" || category === "Fruits & Vegetables" || category === "Groceries") {
      const pricePerKg = calculatePricePerKg(item.price, weight);
      const weightDisplay = formatWeightDisplay(weight);
      
      if (!pricePerKg || !weightDisplay) return null;
      
      return (
        <div className="mt-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Weight className="w-3 h-3 text-gray-500" />
              <span>{weightDisplay}</span>
            </div>
            <div className="text-xs font-medium text-green-700">
              {pricePerKg}
            </div>
          </div>
        </div>
      );
    }
    
    // For other categories, just show weight if available
    const weightDisplay = formatWeightDisplay(weight);
    if (weightDisplay) {
      return (
        <div className="mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Weight className="w-3 h-3 text-gray-500" />
            <span>{weightDisplay}</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Render quantity selector
  const renderQuantitySelector = (item: MenuItem) => {
    const quantity = quantities[item.id] || 0;
    
    if (quantity > 0) {
      return (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(item.id, quantity - 1);
            }}
            className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500"
          >
            <Minus className="w-4 h-4 text-black" />
          </button>
          <span className="font-bold text-black text-lg min-w-[24px] text-center">
            {quantity}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(item.id, quantity + 1);
            }}
            className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500"
          >
            <Plus className="w-4 h-4 text-black" />
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(item);
          }}
          disabled={!item.available}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm ${
            item.available
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">
            {item.available ? t("addToCart") : "Unavailable"}
          </span>
        </button>
      );
    }
  };

  // Render Food filters (Veg/Non-Veg)
  const renderFoodFilters = () => {
    // Get unique cuisines
    const uniqueCuisines = [
      ...new Set(menuItems.map((item) => item.cuisine).filter(Boolean)),
    ];

    return (
      <>
        {" "}
        <style>{`
  /* Hide scrollbar but keep scrolling */
  .hide-scrollbar {
    scrollbar-width: none;        /* Firefox */
    -ms-overflow-style: none;     /* IE & Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;                /* Chrome, Safari */
  }
`}</style>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() =>
              setFoodFilters((prev) => ({ ...prev, vegOnly: !prev.vegOnly }))
            }
            className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
              foodFilters.vegOnly
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            Veg
          </button>

          <button
            onClick={() =>
              setFoodFilters((prev) => ({
                ...prev,
                nonVegOnly: !prev.nonVegOnly,
              }))
            }
            className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
              foodFilters.nonVegOnly
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            <div className="w-4 h-4 border border-red-700 flex items-center justify-center">
              <div
                className="w-0 h-0 
                border-l-[3px] border-l-transparent
                border-r-[3px] border-r-transparent
                border-b-[4px] border-b-red-700
              "
              />
            </div>
            Non-Veg
          </button>

          <button
            onClick={() =>
              setFoodFilters((prev) => ({
                ...prev,
                spicyOnly: !prev.spicyOnly,
              }))
            }
            className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
              foodFilters.spicyOnly
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            <Flame className="w-3 h-3" />
            Spicy
          </button>

          <button
            onClick={() =>
              setFoodFilters((prev) => ({
                ...prev,
                bestSeller: !prev.bestSeller,
              }))
            }
            className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
              foodFilters.bestSeller
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            <Star className="w-3 h-3" />
            Best Seller
          </button>

          {uniqueCuisines.length > 0 && (
            <select
              value={foodFilters.cuisineFilter}
              onChange={(e) =>
                setFoodFilters((prev) => ({
                  ...prev,
                  cuisineFilter: e.target.value,
                }))
              }
              className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
            >
              <option value="all">All Cuisines</option>
              {uniqueCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          )}
        </div>
      </>
    );
  };

  // Render Medicine filters
  const renderMedicalFilters = () => {
    const uniqueMedicineTypes = [
      ...new Set(menuItems.map((item) => item.medicineType).filter(Boolean)),
    ];

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() =>
            setMedicalFilters((prev) => ({
              ...prev,
              prescriptionOnly: !prev.prescriptionOnly,
            }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            medicalFilters.prescriptionOnly
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Pill className="w-3 h-3" />
          Prescription
        </button>

        <button
          onClick={() =>
            setMedicalFilters((prev) => ({ ...prev, otcOnly: !prev.otcOnly }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            medicalFilters.otcOnly
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Shield className="w-3 h-3" />
          OTC
        </button>

        {uniqueMedicineTypes.length > 0 && (
          <select
            value={medicalFilters.medicineTypeFilter}
            onChange={(e) =>
              setMedicalFilters((prev) => ({
                ...prev,
                medicineTypeFilter: e.target.value,
              }))
            }
            className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
          >
            <option value="all">All Types</option>
            {uniqueMedicineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Render Grocery filters
  const renderGroceryFilters = () => {
    const uniqueGroceryTypes = [
      ...new Set(menuItems.map((item) => item.groceryType).filter(Boolean)),
    ];

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
       
        {uniqueGroceryTypes.length > 0 && (
          <select
            value={groceryFilters.groceryTypeFilter}
            onChange={(e) =>
              setGroceryFilters((prev) => ({
                ...prev,
                groceryTypeFilter: e.target.value,
              }))
            }
            className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
          >
            <option value="all">All Types</option>
            {uniqueGroceryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Render Fruits & Vegetables filters
  const renderFruitsFilters = () => {
    const uniqueFruitTypes = [
      ...new Set(menuItems.map((item) => item.fruitsType).filter(Boolean)),
    ];

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() =>
            setFruitsFilters((prev) => ({
              ...prev,
              organicOnly: !prev.organicOnly,
            }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            fruitsFilters.organicOnly
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Leaf className="w-3 h-3" />
          Organic
        </button>

      

        {uniqueFruitTypes.length > 0 && (
          <select
            value={fruitsFilters.fruitsTypeFilter}
            onChange={(e) =>
              setFruitsFilters((prev) => ({
                ...prev,
                fruitsTypeFilter: e.target.value,
              }))
            }
            className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
          >
            <option value="all">All Types</option>
            {uniqueFruitTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Render Meat & Fish filters
  const renderMeatFilters = () => {
    const uniqueMeatTypes = [
      ...new Set(menuItems.map((item) => item.meatType).filter(Boolean)),
    ];

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() =>
            setMeatFilters((prev) => ({ ...prev, freshOnly: !prev.freshOnly }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            meatFilters.freshOnly
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Beef className="w-3 h-3" />
          Fresh
        </button>

        <button
          onClick={() =>
            setMeatFilters((prev) => ({
              ...prev,
              frozenOnly: !prev.frozenOnly,
            }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            meatFilters.frozenOnly
              ? "bg-blue-100 text-blue-700 border border-blue-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Thermometer className="w-3 h-3" />
          Frozen
        </button>

        {uniqueMeatTypes.length > 0 && (
          <select
            value={meatFilters.meatTypeFilter}
            onChange={(e) =>
              setMeatFilters((prev) => ({
                ...prev,
                meatTypeFilter: e.target.value,
              }))
            }
            className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
          >
            <option value="all">All Types</option>
            {uniqueMeatTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Render Dress & Gadgets filters
  const renderDressFilters = () => {
    const uniqueOccasions = [
      ...new Set(menuItems.map((item) => item.occasion).filter(Boolean)),
    ];

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() =>
            setDressFilters((prev) => ({ ...prev, menOnly: !prev.menOnly }))
          }
          className={`px-2 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            dressFilters.menOnly
              ? "bg-blue-100 text-blue-700 border border-blue-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Users className="w-3 h-3" />
          Men
        </button>

        <button
          onClick={() =>
            setDressFilters((prev) => ({ ...prev, womenOnly: !prev.womenOnly }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            dressFilters.womenOnly
              ? "bg-pink-100 text-pink-700 border border-pink-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Users className="w-3 h-3" />
          Women
        </button>

         <button
          onClick={() =>
            setDressFilters((prev) => ({ ...prev, unisexOnly: !prev.unisexOnly }))
          }
          className={`px-4 py-1 rounded-full whitespace-nowrap text-[12px] font-medium flex items-center gap-2 ${
            dressFilters.unisexOnly
              ? "bg-purple-100 text-purple-700 border border-purple-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          <Users className="w-3 h-3" />
          Unisex
        </button>

        {uniqueOccasions.length > 0 && (
          <select
            value={dressFilters.dressTypeFilter}
            onChange={(e) =>
              setDressFilters((prev) => ({
                ...prev,
                dressTypeFilter: e.target.value,
              }))
            }
            className="px-4 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
          >
            <option value="all">All Occasions</option>
            {uniqueOccasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Render appropriate filters based on store type
  const renderFilters = () => {
    switch (store?.categoryName) {
      case "Food":
        return renderFoodFilters();
      case "Medicine":
        return renderMedicalFilters();
      case "Groceries":
        return renderGroceryFilters();
      case "Fruits & Vegetables":
        return renderFruitsFilters();
      case "Meat & Fish":
        return renderMeatFilters();
      case "Dress & Gadgets":
        return renderDressFilters();
      default:
        return renderFoodFilters();
    }
  };

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.margin = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
      document.body.style.margin = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white pb-32 overflow-x-hidden">
        {/* Restaurant Header - Fixed */}
        <div className="sticky top-0 z-50">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-black">{store.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3 text-black" />
                    <span className="text-[12px] text-black">
                      {store.deliveryTime || "30-40"} min
                    </span>
                    {store.address && (
                      <span className="text-[11px] text-black/70 leading-tight line-clamp-1">
                        {store.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-md">
                <Star className="w-4 h-4 text-white fill-yellow-400" />
                <span className="text-[13px] text-black">
                  {store.rating || "4.5"}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={`Search ${
                  store?.categoryName?.toLowerCase() || "products"
                }...`}
                className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-xl shadow-sm text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons - Different for each store type */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar">
          {renderFilters()}
          {(searchQuery ||
            Object.values(getCurrentFilters()).some(
              (f) => f !== false && f !== "all"
            )) && <div className="mt-2"></div>}
        </div>

        {/* Product Grid */}
        <div className="px-6 py-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading Products...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery ||
                Object.values(getCurrentFilters()).some(
                  (f) => f !== false && f !== "all"
                )
                  ? "No products found"
                  : "No products available"}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "Try changing your filters"}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() =>
                      onNavigate("productDetail", {
                        product: item,
                        store: store,
                      })
                    }
                    className="w-full text-left"
                  >
                    <div className="flex">
                      <div className="relative w-32 h-32 bg-yellow-50">
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getImageSource("");
                          }}
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-black text-sm line-clamp-2">
                            {item.name}
                          </h3>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {renderProductBadges(item)}
                        </div>
                        
                        {/* Price */}
                        <p className="font-bold text-black text-[18px] ml-1">
                          {formatPrice(item.price)}
                        </p>
                        
                        {/* Weight and Price per kg */}
                        {renderWeightAndPriceInfo(item)}
                      </div>
                    </div>
                  </button>

                  {/* Quantity Selector or Add to Cart Button */}
                  <div className="mt-4 px-4">
                    {renderQuantitySelector(item)}
                  </div>

                  {/* Product Details */}

                  {/* Rating and availability */}
                  <div className="flex items-center justify-between mt-2 px-4 pb-4">
                    {item.rating && item.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {item.rating}
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {!item.available && (
                      <span className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}