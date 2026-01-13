import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Plus, Minus, Leaf, ChefHat, Flame, Timer, Package, Weight, Scale, Thermometer, Battery, Droplets, Scissors, Hash, Users, Clipboard, Zap, CheckCircle, AlertCircle, Info, Shield, Truck, ShoppingCart, Apple, Shirt, Pill, Beef, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProductDetailScreenProps {
  product: any;
  store: any;
  onBack: () => void;
  onAddToCart: (product: any, quantity: number) => void;
  onAddToWishlist: (product: any) => void; // Add this
  isInWishlist: boolean; // Add this
}

export function ProductDetailScreen({ 
  product, 
  store, 
  onBack, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist 
}: ProductDetailScreenProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details from Firebase when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        if (product && product.id) {
          // Fetch from menu collection
          const productRef = doc(db, 'menu', product.id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const data = productSnap.data();
            setProductData({
              id: productSnap.id,
              name: data.name || 'Unnamed Item',
              price: data.price || 0,
              image: data.image || '/placeholder-food.jpg',
              rating: data.rating || 0,
              description: data.description || 'A delicious dish prepared with the finest ingredients. Freshly prepared and served hot.',
              isVeg: data.isVeg !== false,
              spicyLevel: data.spicyLevel,
              preparationTime: data.preparationTime,
              available: data.available !== false,
              categoryName: data.categoryName,

              // Food specific
              foodType: data.foodType,
              cuisine: data.cuisine,
              ingredients: data.ingredients,
              calories: data.calories,
              bestSeller: data.bestSeller,
              packagingType: data.packagingType,

              // Groceries specific
              groceryType: data.groceryType,
              netWeight: data.netWeight,
              groceryManufacturer: data.groceryManufacturer,
              groceryStorageInstructions: data.groceryStorageInstructions,
              countryOfOrigin: data.countryOfOrigin,

              // Dress specific
              gender: data.gender,
              size: data.size,
              colorOptions: data.colorOptions,
              fabricMaterial: data.fabricMaterial,
              fitType: data.fitType,
              occasion: data.occasion,
              washCareInstructions: data.washCareInstructions,

              // Fruits & Vegetables specific
              fruitsType: data.fruitsType,
              organic: data.organic,
              fruitsWeight: data.fruitsWeight,
              freshnessDuration: data.freshnessDuration,
              sourceLocation: data.sourceLocation,
              cutOption: data.cutOption,
              seasonal: data.seasonal,
              fruitsStorageInstructions: data.fruitsStorageInstructions,

              // Medicine specific
              medicineType: data.medicineType,
              prescriptionRequired: data.prescriptionRequired,
              saltComposition: data.saltComposition,
              dosageInstructions: data.dosageInstructions,
              medicineManufacturer: data.medicineManufacturer,
              batchNumber: data.batchNumber,
              expiryDate: data.expiryDate,
              medicineStorageConditions: data.medicineStorageConditions,
              sideEffects: data.sideEffects,

              // Meat & Fish specific
              meatType: data.meatType,
              cutType: data.cutType,
              meatWeight: data.meatWeight,
              freshness: data.freshness,
              meatSource: data.meatSource,
              meatPackaging: data.meatPackaging,
              deliveryTimeSlot: data.deliveryTimeSlot,
              meatStorageInstructions: data.meatStorageInstructions,

              // Badges
              badges: data.badges || [],

              // Hotel info
              hotelId: data.hotelId,
              hotelName: data.hotelName
            });
          } else {
            setProductData(product);
          }
        } else {
          setProductData(product);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setProductData(product);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product]);

  // Get image source
  const getImageSource = (image: string) => {
    if (!image) {
      // Return default image based on category
      switch(productData?.categoryName) {
        case 'Medicine':
          return '/placeholder-medicine.jpg';
        case 'Groceries':
          return '/placeholder-grocery.jpg';
        case 'Fruits & Vegetables':
          return '/placeholder-fruits.jpg';
        case 'Meat & Fish':
          return '/placeholder-meat.jpg';
        case 'Dress & Gadgets':
          return '/placeholder-dress.jpg';
        default:
          return '/placeholder-food.jpg';
      }
    }
    
    if (image.startsWith('data:image')) {
      return image;
    }
    
    if (image.startsWith('http')) {
      return image;
    }
    
    return '/placeholder-food.jpg';
  };

  // Format price
  const formatPrice = (price: number) => {
    if (!price) return '₹0.00';
    return `₹${parseFloat(price.toString()).toFixed(2)}`;
  };

  // Get spicy level indicator - only for Food category
  const getSpicyIndicator = (level: string) => {
    if (!level) return '';
    
    switch(level) {
      case 'Mild': return '🌶️';
      case 'Medium': return '🌶️🌶️';
      case 'Spicy': return '🌶️🌶️🌶️';
      case 'Very Spicy': return '🌶️🌶️🌶️🌶️';
      default: return '';
    }
  };

  const handleAddToCart = () => {
    if (productData) {
      onAddToCart(productData, quantity);
      onBack();
    }
  };

  const handleAddToWishlist = () => {
    if (productData) {
      onAddToWishlist(productData);
    }
  };

  // Render category-specific details
  const renderCategorySpecificDetails = () => {
    if (!productData) return null;

    switch(productData.categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <ChefHat className="w-4 h-4" /> Food Details
                </h3>
                {productData.foodType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className={`text-sm ${productData.foodType === 'Veg' ? 'text-green-600' : 'text-red-600'}`}>
                      {productData.foodType}
                    </span>
                  </div>
                )}
                {productData.cuisine && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Cuisine:</span>
                    <span className="text-sm text-gray-600">{productData.cuisine}</span>
                  </div>
                )}
                {productData.spicyLevel && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Spice Level:</span>
                    <span className="text-sm text-gray-600">{productData.spicyLevel} {getSpicyIndicator(productData.spicyLevel)}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" /> Nutrition & Packaging
                </h3>
                {productData.calories && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Calories:</span>
                    <span className="text-sm text-gray-600">{productData.calories}</span>
                  </div>
                )}
                {productData.preparationTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Prep Time:</span>
                    <span className="text-sm text-gray-600">{productData.preparationTime} min</span>
                  </div>
                )}
                {productData.packagingType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Packaging:</span>
                    <span className="text-sm text-gray-600">{productData.packagingType}</span>
                  </div>
                )}
              </div>
            </div>
            
            {productData.ingredients && (
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm">Ingredients</h3>
                <p className="text-gray-600 leading-relaxed">{productData.ingredients}</p>
              </div>
            )}
            
            {productData.bestSeller && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-yellow-700">Best Seller Product</span>
                </div>
                <p className="text-yellow-600 text-sm mt-1">This is one of our most popular items!</p>
              </div>
            )}
          </div>
        );

      case 'Medicine':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4" /> Medicine Details
                </h3>
                {productData.medicineType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="text-sm text-gray-600">{productData.medicineType}</span>
                  </div>
                )}
                {productData.prescriptionRequired !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Prescription:</span>
                    <span className={`text-sm ${productData.prescriptionRequired ? 'text-red-600' : 'text-green-600'}`}>
                      {productData.prescriptionRequired ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                )}
                {productData.saltComposition && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Salt:</span>
                    <span className="text-sm text-gray-600">{productData.saltComposition}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Safety & Storage
                </h3>
                {productData.expiryDate && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Expiry:</span>
                    <span className={`text-sm ${new Date(productData.expiryDate) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
                      {new Date(productData.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {productData.batchNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Batch:</span>
                    <span className="text-sm text-gray-600">{productData.batchNumber}</span>
                  </div>
                )}
                {productData.manufacturer && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Manufacturer:</span>
                    <span className="text-sm text-gray-600">{productData.manufacturer}</span>
                  </div>
                )}
              </div>
            </div>
            
            {productData.dosageInstructions && (
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm">Dosage Instructions</h3>
                <p className="text-gray-600 leading-relaxed">{productData.dosageInstructions}</p>
              </div>
            )}
            
            {productData.storageConditions && (
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm">Storage Conditions</h3>
                <p className="text-gray-600 leading-relaxed">{productData.storageConditions}</p>
              </div>
            )}
            
            {productData.sideEffects && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-700">Side Effects</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{productData.sideEffects}</p>
              </div>
            )}
          </div>
        );

      case 'Groceries':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Product Details
                </h3>
                {productData.groceryType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="text-sm text-gray-600">{productData.groceryType}</span>
                  </div>
                )}
                {productData.netWeight && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Net Weight:</span>
                    <span className="text-sm text-gray-600">{productData.netWeight}</span>
                  </div>
                )}
                {productData.countryOfOrigin && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Origin:</span>
                    <span className="text-sm text-gray-600">{productData.countryOfOrigin}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" /> Brand & Storage
                </h3>
                {productData.manufacturer && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Brand:</span>
                    <span className="text-sm text-gray-600">{productData.manufacturer}</span>
                  </div>
                )}
                {productData.packagingType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Packaging:</span>
                    <span className="text-sm text-gray-600">{productData.packagingType}</span>
                  </div>
                )}
                {productData.storageInstructions && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Storage:</span>
                    <span className="text-sm text-gray-600">{productData.storageInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'Fruits & Vegetables':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Apple className="w-4 h-4" /> Product Details
                </h3>
                {productData.fruitsType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="text-sm text-gray-600">{productData.fruitsType}</span>
                  </div>
                )}
                {productData.weight && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Weight:</span>
                    <span className="text-sm text-gray-600">{productData.weight}</span>
                  </div>
                )}
                {productData.organic !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Organic:</span>
                    <span className={`text-sm ${productData.organic ? 'text-green-600' : 'text-gray-600'}`}>
                      {productData.organic ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Thermometer className="w-4 h-4" /> Freshness & Storage
                </h3>
                {productData.freshnessDuration && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Freshness:</span>
                    <span className="text-sm text-gray-600">{productData.freshnessDuration}</span>
                  </div>
                )}
                {productData.sourceLocation && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Source:</span>
                    <span className="text-sm text-gray-600">{productData.sourceLocation}</span>
                  </div>
                )}
                {productData.cutOption && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Cut Option:</span>
                    <span className="text-sm text-gray-600">{productData.cutOption}</span>
                  </div>
                )}
              </div>
            </div>
            
            {productData.seasonal && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">Seasonal Product</span>
                </div>
                <p className="text-green-600 text-sm mt-1">This product is currently in season!</p>
              </div>
            )}
          </div>
        );

      case 'Meat & Fish':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Beef className="w-4 h-4" /> Product Details
                </h3>
                {productData.meatType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="text-sm text-gray-600">{productData.meatType}</span>
                  </div>
                )}
                {productData.cutType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Cut Type:</span>
                    <span className="text-sm text-gray-600">{productData.cutType}</span>
                  </div>
                )}
                {productData.weight && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Weight:</span>
                    <span className="text-sm text-gray-600">{productData.weight}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Thermometer className="w-4 h-4" /> Freshness & Delivery
                </h3>
                {productData.freshness && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Freshness:</span>
                    <span className="text-sm text-gray-600">{productData.freshness}</span>
                  </div>
                )}
                {productData.source && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Source:</span>
                    <span className="text-sm text-gray-600">{productData.source}</span>
                  </div>
                )}
                {productData.deliveryTimeSlot && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Delivery Slot:</span>
                    <span className="text-sm text-gray-600">{productData.deliveryTimeSlot}</span>
                  </div>
                )}
              </div>
            </div>
            
            {productData.storageInstructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-700">Storage Instructions</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">{productData.storageInstructions}</p>
              </div>
            )}
          </div>
        );

      case 'Dress & Gadgets':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Shirt className="w-4 h-4" /> Product Details
                </h3>
                {productData.gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Gender:</span>
                    <span className="text-sm text-gray-600">{productData.gender}</span>
                  </div>
                )}
                {productData.size && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Size:</span>
                    <span className="text-sm text-gray-600">{productData.size}</span>
                  </div>
                )}
                {productData.fitType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Fit Type:</span>
                    <span className="text-sm text-gray-600">{productData.fitType}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" /> Style & Care
                </h3>
                {productData.occasion && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Occasion:</span>
                    <span className="text-sm text-gray-600">{productData.occasion}</span>
                  </div>
                )}
                {productData.fabricMaterial && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Fabric:</span>
                    <span className="text-sm text-gray-600">{productData.fabricMaterial}</span>
                  </div>
                )}
                {productData.colorOptions && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Colors:</span>
                    <span className="text-sm text-gray-600">{productData.colorOptions}</span>
                  </div>
                )}
              </div>
            </div>
            
            {productData.washCareInstructions && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-purple-700">Wash Care Instructions</span>
                </div>
                <p className="text-purple-600 text-sm mt-1">{productData.washCareInstructions}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render product badges
  const renderProductBadges = () => {
    if (!productData || !productData.badges || productData.badges.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {productData.badges.map((badge: string, index: number) => (
          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {badge}
          </span>
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  // Show error if no product data
  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">Unable to load product details.</p>
          <Button
            onClick={onBack}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Back Button */}
      <div className="relative h-64 flex-shrink-0 rounded-b-[50px] overflow-hidden shadow-md">
        <img
          src={getImageSource(productData.image)}
          alt={productData.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = getImageSource("");
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        
        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        {/* Veg/Non-Veg Badge - Only for Food products */}
        {productData.categoryName === 'Food' && (
          <div className="absolute top-20 right-6">
            {productData.isVeg ? (
              <div className="bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                <Leaf className="w-4 h-4" />
                Veg
              </div>
            ) : (
              <div className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                <ChefHat className="w-4 h-4" />
                Non-Veg
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="bg-white rounded-t-3xl relative z-10 px-6 pt-6">
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{productData.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                  <span className="text-sm font-semibold text-gray-900">{productData.rating || '0.0'}</span>
                </div>
                <span className="text-sm text-gray-600">(250+ {t('reviews')})</span>
              </div>
              
              {/* Product Badges */}
              {renderProductBadges()}
              
              {/* Price */}
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(productData.price)}</p>
                {!productData.available && (
                  <p className="text-red-500 text-sm font-medium mt-2">Currently Unavailable</p>
                )}
              </div>
            </div>

            {/* Category-specific details */}
            {renderCategorySpecificDetails()}

            {/* Description */}
            <div className="pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {productData.description || 'No description available.'}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Add to Cart Button - Fixed at bottom */}
      {productData.available && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold text-lg shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Cart • {formatPrice(productData.price * quantity)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}