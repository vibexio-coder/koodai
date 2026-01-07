import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  DollarSign,
  SearchX,
  Utensils,
  Tag as OfferTag,
  Search,
  Timer,
  Filter,
  Percent,
  FilterXIcon,
  FilterIcon,
  XIcon,
  SlidersHorizontal,
  Pill,
  ShoppingCart,
  Beef,
  Croissant,
  Bone,
  Store,
  Apple,
  Smartphone,
  Shirt,
  Tag,
  Truck,
  CheckCircle,
  Home,
  Gift,
  Package,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  Users,
  Sparkles,
  ThumbsUp,
  Heart,
  Target,
  Leaf,
  Droplets,
  Thermometer,
  Scale,
  Scissors,
  Cloud,
  Moon,
  Sun,
  Watch,
  Music,
  Camera,
  Headphones,
  Gamepad,
  Book,
  Baby,
  Flower,
  Coffee,
  Pizza,
  Sandwich,
  Soup,
  Wine,
  Beer,
  Egg,
  Milk,
  Carrot,
  Cherry,
  Fish,
  Drumstick,
  Salad,
  Cookie,
  CakeSlice,
  IceCream,
  Candy,
  Citrus,
  Nut,
  Wheat,
  Weight,
  Ruler,
  Palette,
  ShirtIcon,
  SmartphoneIcon,
  ShoppingBag,
  PillIcon,
  BeefIcon,
  AppleIcon,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Screen } from "../types";
import { db } from "../services/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

interface StoreListingScreenProps {
  category: string;
  categoryName: string;
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
}

export function StoreListingScreen({
  category,
  categoryName,
  onNavigate,
  onBack,
}: StoreListingScreenProps) {
  const { t } = useLanguage();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryData, setCategoryData] = useState<any>(null);
  
  // Food Filters
  const [foodFilters, setFoodFilters] = useState({
    vegFilter: 'Both',
    cuisineFilter: [] as string[],
    mealTypeFilter: [] as string[],
    serviceFilter: [] as string[],
    otherFilter: [] as string[],
    bestSeller: false,
    ratingFilter: 0,
    priceSort: '',
    distanceSort: false,
    offers: false,
  });

  // Grocery Filters
  const [groceryFilters, setGroceryFilters] = useState({
    typeFilter: [] as string[],
    brandFilter: [] as string[],
    otherFilter: [] as string[],
    organic: false,
    comboPacks: false,
    priceRange: '',
    fastDelivery: false,
    inStock: true,
  });

  // Vegetables & Fruits Filters
  const [vegFilters, setVegFilters] = useState({
    typeFilter: [] as string[],
    qualityFilter: 'All',
    cutTypeFilter: [] as string[],
    otherFilter: [] as string[],
    seasonal: false,
    pricePerKg: '',
    freshArrival: false,
    bestSeller: false,
  });

  // Dress/Clothing Filters
  const [dressFilters, setDressFilters] = useState({
    categoryFilter: [] as string[],
    typeFilter: [] as string[],
    sizeFilter: [] as string[],
    fabricFilter: [] as string[],
    brandFilter: [] as string[],
    colorFilter: [] as string[],
    priceRange: '',
    newArrivals: false,
    offers: false,
  });

  // Meat & Fish Filters
  const [meatFilters, setMeatFilters] = useState({
    categoryFilter: [] as string[],
    cutTypeFilter: [] as string[],
    processingFilter: [] as string[],
    otherFilter: [] as string[],
    todaysCatch: false,
    weightRange: '',
    priceRange: '',
    bestSeller: false,
    deliveryTime: '',
  });

  // Medicine Filters
  const [medicineFilters, setMedicineFilters] = useState({
    categoryFilter: [] as string[],
    typeFilter: [] as string[],
    prescriptionFilter: 'All',
    otherFilter: [] as string[],
    generic: false,
    brandFilter: [] as string[],
    is24x7: false,
    discounted: false,
    inStock: true,
  });

  // Get category icon component
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, any> = {
      'Food': Utensils,
      'Medicine': Pill,
      'Groceries': ShoppingCart,
      'Fruits & Vegetables': Apple,
      'Meat & Fish': Beef,
      'Dress & Gadgets': Shirt,
    };
    
    const IconComponent = iconMap[categoryName] || Store;
    return <IconComponent className="w-6 h-6 text-yellow-600" />;
  };

  // Fetch category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (category) {
        try {
          const categoryRef = doc(db, 'categories', category);
          const categorySnap = await getDoc(categoryRef);
          if (categorySnap.exists()) {
            setCategoryData({
              id: categorySnap.id,
              ...categorySnap.data()
            });
          }
        } catch (error) {
          console.error("Error fetching category details:", error);
        }
      }
    };

    fetchCategoryDetails();
  }, [category]);

  useEffect(() => {
    const fetchRestaurantsByCategory = async () => {
      try {
        setLoading(true);
        const restaurantsRef = collection(db, "hotels");

        // Query businesses by categoryId
        const q = query(restaurantsRef, where("categoryId", "==", category));
        const querySnapshot = await getDocs(q);

        const restaurantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRestaurants(restaurantsData);
        setFilteredRestaurants(restaurantsData);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRestaurantsByCategory();
    }
  }, [category]);

  // Get current category name
  const getCurrentCategoryName = () => {
    if (categoryData?.name) return categoryData.name;
    if (categoryName) return categoryName;
    return "Businesses";
  };

  // Apply filters based on category
  const applyFilters = () => {
    let filtered = [...restaurants];
    const categoryName = getCurrentCategoryName();

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((restaurant) => {
        const name = restaurant.name?.toLowerCase() || '';
        const cuisine = restaurant.cuisine?.toLowerCase() || '';
        const description = restaurant.description?.toLowerCase() || '';
        const address = restaurant.address?.toLowerCase() || '';
        const offers = restaurant.offers?.toLowerCase() || '';
        
        return (
          name.includes(query) ||
          cuisine.includes(query) ||
          description.includes(query) ||
          address.includes(query) ||
          offers.includes(query)
        );
      });
    }

    // Get filters from restaurant data
    const restaurantFilters = filtered.map(r => r.filters || {});

    // Apply category-specific filters
    switch(categoryName) {
      case 'Food':
        filtered = applyFoodFilters(filtered, restaurantFilters);
        break;
      case 'Medicine':
        filtered = applyMedicineFilters(filtered, restaurantFilters);
        break;
      case 'Groceries':
        filtered = applyGroceryFilters(filtered, restaurantFilters);
        break;
      case 'Fruits & Vegetables':
        filtered = applyVegFilters(filtered, restaurantFilters);
        break;
      case 'Meat & Fish':
        filtered = applyMeatFilters(filtered, restaurantFilters);
        break;
      case 'Dress & Gadgets':
        filtered = applyDressFilters(filtered, restaurantFilters);
        break;
    }

    // Apply sorting
    if (foodFilters.priceSort) {
      filtered = sortByPrice(filtered, foodFilters.priceSort);
    }

    setFilteredRestaurants(filtered);
    setShowFilters(false);
  };

  // Food Filters Application
  const applyFoodFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};
      
      // Veg Filter
      if (foodFilters.vegFilter !== 'Both') {
        const isVeg = restaurant.isVeg || false;
        if (foodFilters.vegFilter === 'Veg' && !isVeg) return false;
        if (foodFilters.vegFilter === 'Non-Veg' && isVeg) return false;
      }

      // Cuisine Filter
      if (foodFilters.cuisineFilter.length > 0) {
        const cuisine = restaurant.cuisine || '';
        if (!foodFilters.cuisineFilter.includes(cuisine)) return false;
      }

      // Meal Type Filter
      if (foodFilters.mealTypeFilter.length > 0) {
        const hasMealType = restaurant.mealType || [];
        if (!foodFilters.mealTypeFilter.some(meal => hasMealType.includes(meal))) return false;
      }

      // Service Filter
      if (foodFilters.serviceFilter.length > 0) {
        const services = restaurant.services || [];
        if (!foodFilters.serviceFilter.every(service => services.includes(service))) return false;
      }

      // Rating Filter
      if (foodFilters.ratingFilter > 0) {
        const rating = restaurant.rating || 0;
        if (rating < foodFilters.ratingFilter) return false;
      }

      // Best Seller
      if (foodFilters.bestSeller && !filters.bestSeller) return false;

      // Offers
      if (foodFilters.offers && (!restaurant.offers || restaurant.offers.trim() === '')) return false;

      return true;
    });
  };

  // Medicine Filters Application
  const applyMedicineFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};

      // Category Filter
      if (medicineFilters.categoryFilter.length > 0) {
        const category = restaurant.medicineType || '';
        if (!medicineFilters.categoryFilter.includes(category)) return false;
      }

      // Type Filter
      if (medicineFilters.typeFilter.length > 0) {
        const types = restaurant.productTypes || [];
        if (!medicineFilters.typeFilter.some(type => types.includes(type))) return false;
      }

      // Prescription Filter
      if (medicineFilters.prescriptionFilter !== 'All') {
        const requiresPrescription = restaurant.requiresPrescription || false;
        if (medicineFilters.prescriptionFilter === 'Prescription' && !requiresPrescription) return false;
        if (medicineFilters.prescriptionFilter === 'Non-Prescription' && requiresPrescription) return false;
      }

      // Generic
      if (medicineFilters.generic && !filters.generic) return false;

      // 24x7
      if (medicineFilters.is24x7 && !filters.is24x7) return false;

      // Discounted
      if (medicineFilters.discounted && !filters.discounted) return false;

      // In Stock
      if (medicineFilters.inStock && !filters.inStock) return false;

      return true;
    });
  };

  // Grocery Filters Application
  const applyGroceryFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};

      // Type Filter
      if (groceryFilters.typeFilter.length > 0) {
        const types = restaurant.groceryTypes || [];
        if (!groceryFilters.typeFilter.some(type => types.includes(type))) return false;
      }

      // Organic
      if (groceryFilters.organic && !filters.organic) return false;

      // Combo Packs
      if (groceryFilters.comboPacks && !filters.comboPacks) return false;

      // Fast Delivery
      if (groceryFilters.fastDelivery && !filters.fastDelivery) return false;

      // In Stock
      if (groceryFilters.inStock && !filters.inStock) return false;

      return true;
    });
  };

  // Vegetables & Fruits Filters Application
  const applyVegFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};

      // Type Filter
      if (vegFilters.typeFilter.length > 0) {
        const types = restaurant.productTypes || [];
        if (!vegFilters.typeFilter.some(type => types.includes(type))) return false;
      }

      // Quality Filter
      if (vegFilters.qualityFilter !== 'All') {
        const isOrganic = restaurant.isOrganic || false;
        if (vegFilters.qualityFilter === 'Organic' && !isOrganic) return false;
        if (vegFilters.qualityFilter === 'Non-Organic' && isOrganic) return false;
      }

      // Seasonal
      if (vegFilters.seasonal && !filters.seasonal) return false;

      // Fresh Arrival
      if (vegFilters.freshArrival && !filters.freshArrival) return false;

      // Best Seller
      if (vegFilters.bestSeller && !filters.bestSeller) return false;

      return true;
    });
  };

  // Dress Filters Application
  const applyDressFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};

      // Category Filter
      if (dressFilters.categoryFilter.length > 0) {
        const categories = restaurant.categories || [];
        if (!dressFilters.categoryFilter.some(cat => categories.includes(cat))) return false;
      }

      // Type Filter
      if (dressFilters.typeFilter.length > 0) {
        const types = restaurant.clothingTypes || [];
        if (!dressFilters.typeFilter.some(type => types.includes(type))) return false;
      }

      // New Arrivals
      if (dressFilters.newArrivals && !filters.newArrivals) return false;

      // Offers
      if (dressFilters.offers && (!restaurant.offers || restaurant.offers.trim() === '')) return false;

      return true;
    });
  };

  // Meat & Fish Filters Application
  const applyMeatFilters = (restaurants: any[], filterData: any[]) => {
    return restaurants.filter((restaurant, index) => {
      const filters = filterData[index] || {};

      // Category Filter
      if (meatFilters.categoryFilter.length > 0) {
        const categories = restaurant.meatTypes || [];
        if (!meatFilters.categoryFilter.some(cat => categories.includes(cat))) return false;
      }

      // Today's Catch
      if (meatFilters.todaysCatch && !filters.todaysCatch) return false;

      // Best Seller
      if (meatFilters.bestSeller && !filters.bestSeller) return false;

      return true;
    });
  };

  // Sorting function
  const sortByPrice = (restaurants: any[], order: string) => {
    return [...restaurants].sort((a, b) => {
      const priceA = a.minOrder || 150;
      const priceB = b.minOrder || 150;
      return order === 'low-high' ? priceA - priceB : priceB - priceA;
    });
  };

  // Reset all filters for current category
  const resetFilters = () => {
    const categoryName = getCurrentCategoryName();
    
    switch(categoryName) {
      case 'Food':
        setFoodFilters({
          vegFilter: 'Both',
          cuisineFilter: [],
          mealTypeFilter: [],
          serviceFilter: [],
          otherFilter: [],
          bestSeller: false,
          ratingFilter: 0,
          priceSort: '',
          distanceSort: false,
          offers: false,
        });
        break;
      case 'Medicine':
        setMedicineFilters({
          categoryFilter: [],
          typeFilter: [],
          prescriptionFilter: 'All',
          otherFilter: [],
          generic: false,
          brandFilter: [],
          is24x7: false,
          discounted: false,
          inStock: true,
        });
        break;
      case 'Groceries':
        setGroceryFilters({
          typeFilter: [],
          brandFilter: [],
          otherFilter: [],
          organic: false,
          comboPacks: false,
          priceRange: '',
          fastDelivery: false,
          inStock: true,
        });
        break;
      case 'Fruits & Vegetables':
        setVegFilters({
          typeFilter: [],
          qualityFilter: 'All',
          cutTypeFilter: [],
          otherFilter: [],
          seasonal: false,
          pricePerKg: '',
          freshArrival: false,
          bestSeller: false,
        });
        break;
      case 'Meat & Fish':
        setMeatFilters({
          categoryFilter: [],
          cutTypeFilter: [],
          processingFilter: [],
          otherFilter: [],
          todaysCatch: false,
          weightRange: '',
          priceRange: '',
          bestSeller: false,
          deliveryTime: '',
        });
        break;
      case 'Dress & Gadgets':
        setDressFilters({
          categoryFilter: [],
          typeFilter: [],
          sizeFilter: [],
          fabricFilter: [],
          brandFilter: [],
          colorFilter: [],
          priceRange: '',
          newArrivals: false,
          offers: false,
        });
        break;
    }
    
    setSearchQuery('');
    setFilteredRestaurants(restaurants);
  };

  // Handle multi-select for filters
  const handleMultiSelect = (value: string, currentArray: string[], setFunction: Function, category: string) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFunction(newArray);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    const categoryName = getCurrentCategoryName();
    let count = 0;

    switch(categoryName) {
      case 'Food':
        count += foodFilters.vegFilter !== 'Both' ? 1 : 0;
        count += foodFilters.cuisineFilter.length;
        count += foodFilters.mealTypeFilter.length;
        count += foodFilters.serviceFilter.length;
        count += foodFilters.bestSeller ? 1 : 0;
        count += foodFilters.ratingFilter > 0 ? 1 : 0;
        count += foodFilters.priceSort ? 1 : 0;
        count += foodFilters.offers ? 1 : 0;
        break;
      case 'Medicine':
        count += medicineFilters.categoryFilter.length;
        count += medicineFilters.typeFilter.length;
        count += medicineFilters.prescriptionFilter !== 'All' ? 1 : 0;
        count += medicineFilters.generic ? 1 : 0;
        count += medicineFilters.is24x7 ? 1 : 0;
        count += medicineFilters.discounted ? 1 : 0;
        break;
      case 'Groceries':
        count += groceryFilters.typeFilter.length;
        count += groceryFilters.organic ? 1 : 0;
        count += groceryFilters.comboPacks ? 1 : 0;
        count += groceryFilters.fastDelivery ? 1 : 0;
        break;
      case 'Fruits & Vegetables':
        count += vegFilters.typeFilter.length;
        count += vegFilters.qualityFilter !== 'All' ? 1 : 0;
        count += vegFilters.seasonal ? 1 : 0;
        count += vegFilters.freshArrival ? 1 : 0;
        count += vegFilters.bestSeller ? 1 : 0;
        break;
      case 'Meat & Fish':
        count += meatFilters.categoryFilter.length;
        count += meatFilters.todaysCatch ? 1 : 0;
        count += meatFilters.bestSeller ? 1 : 0;
        break;
      case 'Dress & Gadgets':
        count += dressFilters.categoryFilter.length;
        count += dressFilters.typeFilter.length;
        count += dressFilters.newArrivals ? 1 : 0;
        count += dressFilters.offers ? 1 : 0;
        break;
    }

    return count;
  };

  // Render food filters panel
  const renderFoodFilters = () => (
    <div className="space-y-6">
      {/* Veg/Non-Veg Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Diet Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Veg', 'Non-Veg', 'Both'].map((type) => (
            <button
              key={type}
              onClick={() => setFoodFilters({...foodFilters, vegFilter: type})}
              className={`p-3 rounded-xl text-sm font-medium ${
                foodFilters.vegFilter === type 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Cuisine</h3>
        <div className="grid grid-cols-2 gap-2">
          {['South Indian', 'North Indian', 'Chinese', 'Continental', 'Fast Food', 'Street Food', 'Bakery', 'Desserts'].map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => handleMultiSelect(cuisine, foodFilters.cuisineFilter, (val: string[]) => setFoodFilters({...foodFilters, cuisineFilter: val}), 'food')}
              className={`p-3 rounded-xl text-sm font-medium ${
                foodFilters.cuisineFilter.includes(cuisine)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Type Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Meal Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
            <button
              key={meal}
              onClick={() => handleMultiSelect(meal, foodFilters.mealTypeFilter, (val: string[]) => setFoodFilters({...foodFilters, mealTypeFilter: val}), 'food')}
              className={`p-3 rounded-xl text-sm font-medium ${
                foodFilters.mealTypeFilter.includes(meal)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Service Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Dine-in', 'Takeaway', 'Delivery', '24×7'].map((service) => (
            <button
              key={service}
              onClick={() => handleMultiSelect(service, foodFilters.serviceFilter, (val: string[]) => setFoodFilters({...foodFilters, serviceFilter: val}), 'food')}
              className={`p-3 rounded-xl text-sm font-medium ${
                foodFilters.serviceFilter.includes(service)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setFoodFilters({...foodFilters, bestSeller: !foodFilters.bestSeller})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            foodFilters.bestSeller
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Award className="w-4 h-4" />
          Bestseller
        </button>

        <button
          onClick={() => setFoodFilters({...foodFilters, ratingFilter: foodFilters.ratingFilter === 4 ? 0 : 4})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            foodFilters.ratingFilter === 4
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Star className="w-4 h-4" />
          4★ & above
        </button>

        <select
          value={foodFilters.priceSort}
          onChange={(e) => setFoodFilters({...foodFilters, priceSort: e.target.value})}
          className="p-3 rounded-xl border border-gray-300 bg-white text-gray-700"
        >
          <option value="">Sort by Price</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>

        <button
          onClick={() => setFoodFilters({...foodFilters, offers: !foodFilters.offers})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            foodFilters.offers
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Tag className="w-4 h-4" />
          Offers
        </button>
      </div>
    </div>
  );

  // Render medicine filters panel
  const renderMedicineFilters = () => (
    <div className="space-y-6">
      {/* Medicine Category */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Medicine Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Allopathy', 'Ayurvedic', 'Homeopathy', 'OTC'].map((category) => (
            <button
              key={category}
              onClick={() => handleMultiSelect(category, medicineFilters.categoryFilter, (val: string[]) => setMedicineFilters({...medicineFilters, categoryFilter: val}), 'medicine')}
              className={`p-3 rounded-xl text-sm font-medium ${
                medicineFilters.categoryFilter.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Product Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Tablets', 'Syrups', 'Injections', 'Creams', 'Medical Devices'].map((type) => (
            <button
              key={type}
              onClick={() => handleMultiSelect(type, medicineFilters.typeFilter, (val: string[]) => setMedicineFilters({...medicineFilters, typeFilter: val}), 'medicine')}
              className={`p-3 rounded-xl text-sm font-medium ${
                medicineFilters.typeFilter.includes(type)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Type */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Prescription Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'Prescription', 'Non-Prescription'].map((type) => (
            <button
              key={type}
              onClick={() => setMedicineFilters({...medicineFilters, prescriptionFilter: type})}
              className={`p-3 rounded-xl text-sm font-medium ${
                medicineFilters.prescriptionFilter === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMedicineFilters({...medicineFilters, generic: !medicineFilters.generic})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            medicineFilters.generic
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Generic
        </button>

        <button
          onClick={() => setMedicineFilters({...medicineFilters, is24x7: !medicineFilters.is24x7})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            medicineFilters.is24x7
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          24×7 Store
        </button>

        <button
          onClick={() => setMedicineFilters({...medicineFilters, discounted: !medicineFilters.discounted})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            medicineFilters.discounted
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Percent className="w-4 h-4" />
          Discounted
        </button>

        <button
          onClick={() => setMedicineFilters({...medicineFilters, inStock: !medicineFilters.inStock})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            medicineFilters.inStock
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          In Stock
        </button>
      </div>
    </div>
  );

  // Render grocery filters panel
  const renderGroceryFilters = () => (
    <div className="space-y-6">
      {/* Product Type */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Product Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Staples', 'Snacks & Beverages', 'Dairy Products', 'Frozen Foods', 'Cooking Essentials', 'Household Items'].map((type) => (
            <button
              key={type}
              onClick={() => handleMultiSelect(type, groceryFilters.typeFilter, (val: string[]) => setGroceryFilters({...groceryFilters, typeFilter: val}), 'grocery')}
              className={`p-3 rounded-xl text-sm font-medium ${
                groceryFilters.typeFilter.includes(type)
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setGroceryFilters({...groceryFilters, organic: !groceryFilters.organic})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            groceryFilters.organic
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Leaf className="w-4 h-4" />
          Organic
        </button>

        <button
          onClick={() => setGroceryFilters({...groceryFilters, comboPacks: !groceryFilters.comboPacks})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            groceryFilters.comboPacks
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Combo Packs
        </button>

        <button
          onClick={() => setGroceryFilters({...groceryFilters, fastDelivery: !groceryFilters.fastDelivery})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            groceryFilters.fastDelivery
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          Fast Delivery
        </button>

        <button
          onClick={() => setGroceryFilters({...groceryFilters, inStock: !groceryFilters.inStock})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            groceryFilters.inStock
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          In Stock
        </button>
      </div>
    </div>
  );

  // Render vegetables & fruits filters panel
  const renderVegFilters = () => (
    <div className="space-y-6">
      {/* Type Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Product Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Vegetables', 'Fruits', 'Leafy Greens', 'Exotic Vegetables', 'Exotic Fruits'].map((type) => (
            <button
              key={type}
              onClick={() => handleMultiSelect(type, vegFilters.typeFilter, (val: string[]) => setVegFilters({...vegFilters, typeFilter: val}), 'veg')}
              className={`p-3 rounded-xl text-sm font-medium ${
                vegFilters.typeFilter.includes(type)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Quality</h3>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'Organic', 'Non-Organic'].map((quality) => (
            <button
              key={quality}
              onClick={() => setVegFilters({...vegFilters, qualityFilter: quality})}
              className={`p-3 rounded-xl text-sm font-medium ${
                vegFilters.qualityFilter === quality
                  ? quality === 'Organic' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setVegFilters({...vegFilters, seasonal: !vegFilters.seasonal})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            vegFilters.seasonal
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Sun className="w-4 h-4" />
          Seasonal
        </button>

        <button
          onClick={() => setVegFilters({...vegFilters, freshArrival: !vegFilters.freshArrival})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            vegFilters.freshArrival
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Fresh Arrival
        </button>

        <button
          onClick={() => setVegFilters({...vegFilters, bestSeller: !vegFilters.bestSeller})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            vegFilters.bestSeller
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Bestseller
        </button>
      </div>
    </div>
  );

  // Render dress & gadgets filters panel
  const renderDressFilters = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Men', 'Women', 'Kids'].map((category) => (
            <button
              key={category}
              onClick={() => handleMultiSelect(category, dressFilters.categoryFilter, (val: string[]) => setDressFilters({...dressFilters, categoryFilter: val}), 'dress')}
              className={`p-3 rounded-xl text-sm font-medium ${
                dressFilters.categoryFilter.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Casual Wear', 'Formal Wear', 'Ethnic Wear', 'Party Wear', 'Sports Wear'].map((type) => (
            <button
              key={type}
              onClick={() => handleMultiSelect(type, dressFilters.typeFilter, (val: string[]) => setDressFilters({...dressFilters, typeFilter: val}), 'dress')}
              className={`p-3 rounded-xl text-sm font-medium ${
                dressFilters.typeFilter.includes(type)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
          }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setDressFilters({...dressFilters, newArrivals: !dressFilters.newArrivals})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            dressFilters.newArrivals
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          New Arrivals
        </button>

        <button
          onClick={() => setDressFilters({...dressFilters, offers: !dressFilters.offers})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            dressFilters.offers
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Tag className="w-4 h-4" />
          Offers
        </button>
      </div>
    </div>
  );

  // Render meat & fish filters panel
  const renderMeatFilters = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Chicken', 'Mutton', 'Fish', 'Prawns', 'Crab', 'Eggs'].map((category) => (
            <button
              key={category}
              onClick={() => handleMultiSelect(category, meatFilters.categoryFilter, (val: string[]) => setMeatFilters({...meatFilters, categoryFilter: val}), 'meat')}
              className={`p-3 rounded-xl text-sm font-medium ${
                meatFilters.categoryFilter.includes(category)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMeatFilters({...meatFilters, todaysCatch: !meatFilters.todaysCatch})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            meatFilters.todaysCatch
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Fish className="w-4 h-4" />
          Today's Catch
        </button>

        <button
          onClick={() => setMeatFilters({...meatFilters, bestSeller: !meatFilters.bestSeller})}
          className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            meatFilters.bestSeller
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Bestseller
        </button>
      </div>
    </div>
  );

  // Get business type from admin panel data
  const getBusinessTypeFromData = (restaurant: any) => {
    const currentCategoryName = getCurrentCategoryName();
    
    switch(currentCategoryName) {
      case 'Food':
        return restaurant.cuisine || 'Restaurant';
      
      case 'Medicine':
        return restaurant.medicineType || 'Pharmacy';
      
      case 'Groceries':
        return restaurant.groceryType || 'Grocery Store';
      
      case 'Fruits & Vegetables':
        return restaurant.fruitsType || 'Fruits & Vegetables Store';
      
      case 'Meat & Fish':
        return restaurant.meatType || 'Meat Shop';
      
      case 'Dress & Gadgets':
        return restaurant.dressType || 'Dress & Gadgets Store';
      
      default:
        return currentCategoryName || 'Business';
    }
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

  // Render appropriate filters based on category
  const renderFiltersPanel = () => {
    const categoryName = getCurrentCategoryName();
    
    switch(categoryName) {
      case 'Food':
        return renderFoodFilters();
      case 'Medicine':
        return renderMedicineFilters();
      case 'Groceries':
        return renderGroceryFilters();
      case 'Fruits & Vegetables':
        return renderVegFilters();
      case 'Dress & Gadgets':
        return renderDressFilters();
      case 'Meat & Fish':
        return renderMeatFilters();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header - Made Sticky */}
      <div className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>

            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${getCurrentCategoryName().toLowerCase()}...`}
                className="w-full pl-12 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-black placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap ${
                getActiveFilterCount() > 0
                  ? "bg-yellow-600 text-white border-yellow-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-white text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {getActiveFilterCount() > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                <FilterXIcon className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {getCurrentCategoryName()} Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          {renderFiltersPanel()}
        </div>
      )}

      {/* Businesses List */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading {getCurrentCategoryName()}...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery || getActiveFilterCount() > 0
                ? "No results found"
                : `No ${getCurrentCategoryName()} found`}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `No ${getCurrentCategoryName().toLowerCase()} found for "${searchQuery}"`
                : getActiveFilterCount() > 0
                ? "Try changing your filters"
                : `No ${getCurrentCategoryName().toLowerCase()} registered yet.`}
            </p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() =>
                onNavigate("products", {
                  store: {
                    id: restaurant.id,
                    name: restaurant.name,
                    image: restaurant.image,
                    rating: restaurant.rating,
                    deliveryTime: restaurant.deliveryTime,
                    cuisine: restaurant.cuisine || getBusinessTypeFromData(restaurant),
                    priceRange: restaurant.priceRange,
                    offers: restaurant.offers,
                    type: getCurrentCategoryName() === 'Food' ? "restaurant" : "store",
                    categoryName: getCurrentCategoryName(),
                  },
                  restaurantData: restaurant,
                })
              }
              className="w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow active:scale-[0.98]"
            >
              {/* Restaurant Image with Overlay */}
              <div className="relative h-48">
                <img
                  src={getImageSource(restaurant.image)}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Business Name and Type */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-xl mb-1 text-left">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300">
                      {getCategoryIcon(getCurrentCategoryName())}
                    </span>
                    <span className="text-yellow-200 text-sm font-medium">
                      {getBusinessTypeFromData(restaurant)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="p-4 space-y-3">
                {/* Delivery Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                      <Timer className="w-3 h-3 text-gray-600" />
                      <span className="text-[12px] font-semibold text-gray-800">
                        {restaurant.deliveryTime || '30-40'} min
                      </span>
                    </div>
                    <div className="text-[12px] font-medium text-gray-700">
                      Min: ₹{restaurant.minOrder || 150}
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="font-bold text-black text-sm">
                      {restaurant.rating || '4.5'}
                    </span>
                  </div>
                </div>

                {/* Offers */}
                {restaurant.offers && restaurant.offers.trim() !== "" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <OfferTag className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-left">
                        <span className="text-xs font-semibold text-yellow-800">
                          OFFERS
                        </span>
                        <p className="text-sm text-gray-800 mt-0.5">
                          {restaurant.offers}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-center gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600 text-left line-clamp-2">
                    {restaurant.address || 'Address not available'}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}