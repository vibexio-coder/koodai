/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Plus, Store, ShoppingBag, Tag, Truck, Upload, Hotel, Utensils, Timer, DollarSign, Phone, MapPin, Mail, Globe, CheckCircle, Menu, Apple, Beef, Pill, ShoppingCart, Bone, Croissant, Shirt, Smartphone, Filter, Flame, Leaf, Package, Weight, Calendar, Scale, Thermometer, User, Battery, Shield, Droplets, Scissors, Hash, Users, Clipboard, AlertCircle, Info, Zap, Clock, Star, Award, Check, X, ChevronDown } from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [hotelImageFile, setHotelImageFile] = useState(null);
  const [hotelImagePreview, setHotelImagePreview] = useState('');
  const [menuImageFile, setMenuImageFile] = useState(null);
  const [menuImagePreview, setMenuImagePreview] = useState('');

  // Categories Form State
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('ShoppingBag');
  const [catImage, setCatImage] = useState('');

  // Hotels Form State
  const [hotelName, setHotelName] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelRating, setHotelRating] = useState('4.5');
  const [hotelImage, setHotelImage] = useState('');
  const [hotelCategory, setHotelCategory] = useState('');
  const [hotelIsVeg, setHotelIsVeg] = useState(false);
  const [hotelDeliveryTime, setHotelDeliveryTime] = useState('30-40');
  const [hotelDeliveryFee, setHotelDeliveryFee] = useState('40');
  const [hotelMinOrder, setHotelMinOrder] = useState('150');

  // Special Offers for all categories
  const [hotelOffers, setHotelOffers] = useState('');
  const [hotelFeatured, setHotelFeatured] = useState(false);
  const [hotelStatus, setHotelStatus] = useState('active');
  const [hotelWebsite, setHotelWebsite] = useState('');
  const [hotelHygienePass, setHotelHygienePass] = useState(true);
  const [hotelOpen, setHotelOpen] = useState(true);

  // Category-specific business fields for 6 categories
  const [hotelCuisine, setHotelCuisine] = useState('South Indian');
  const [hotelPriceRange, setHotelPriceRange] = useState('₹₹');
  const [hotelMedicineType, setHotelMedicineType] = useState('Pharmacy');
  const [hotelGroceryType, setHotelGroceryType] = useState('Supermarket');
  const [hotelFruitsType, setHotelFruitsType] = useState('Fruits Store');
  const [hotelMeatType, setHotelMeatType] = useState('Meat Shop');
  const [hotelDressType, setHotelDressType] = useState('Clothing Store');

  // Menu Form State - Updated with comprehensive fields
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuImage, setMenuImage] = useState('');
  const [menuHotelId, setMenuHotelId] = useState('');
  const [menuCategory, setMenuCategory] = useState('');
  const [menuIsVeg, setMenuIsVeg] = useState(true);
  const [menuAvailable, setMenuAvailable] = useState(true);
  const [menuSpicyLevel, setMenuSpicyLevel] = useState('Medium');
  const [menuPreparationTime, setMenuPreparationTime] = useState('15-20');

  // ============== FOOD SPECIFIC FIELDS ==============
  const [foodType, setFoodType] = useState('Veg');
  const [foodCuisine, setFoodCuisine] = useState('Indian');
  const [foodIngredients, setFoodIngredients] = useState('');
  const [foodSpiceLevel, setFoodSpiceLevel] = useState('Medium');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodPrepTime, setFoodPrepTime] = useState('15-20');
  const [foodBestSeller, setFoodBestSeller] = useState(false);
  const [foodAddons, setFoodAddons] = useState([]);
  const [foodPackaging, setFoodPackaging] = useState('Regular');
  
  // ============== GROCERIES SPECIFIC FIELDS ==============
  const [groceryType, setGroceryType] = useState('Staples');
  const [groceryWeight, setGroceryWeight] = useState('');
  const [groceryPackaging, setGroceryPackaging] = useState('Packet');
  const [groceryManufacturer, setGroceryManufacturer] = useState('');
  const [groceryStorage, setGroceryStorage] = useState('');
  const [groceryOrigin, setGroceryOrigin] = useState('India');
  
  // ============== DRESS & GADGETS SPECIFIC FIELDS ==============
  const [dressGender, setDressGender] = useState('Unisex');
  const [dressSize, setDressSize] = useState('');
  const [dressColor, setDressColor] = useState('');
  const [dressFabric, setDressFabric] = useState('');
  const [dressFit, setDressFit] = useState('Regular');
  const [dressOccasion, setDressOccasion] = useState('Casual');
  const [dressWashCare, setDressWashCare] = useState('');
  const [dressOrigin, setDressOrigin] = useState('India');
  
  // ============== FRUITS & VEGETABLES SPECIFIC FIELDS ==============
  const [fruitsType, setFruitsType] = useState('Fruits');
  const [fruitsOrganic, setFruitsOrganic] = useState(false);
  const [fruitsWeight, setFruitsWeight] = useState('');
  const [fruitsFreshness, setFruitsFreshness] = useState('3-5 days');
  const [fruitsSource, setFruitsSource] = useState('');
  const [fruitsStorage, setFruitsStorage] = useState('Refrigerate');
  const [fruitsCutOption, setFruitsCutOption] = useState('Uncut');
  const [fruitsSeasonal, setFruitsSeasonal] = useState(false);
  
  // ============== MEDICINE SPECIFIC FIELDS ==============
  const [medicineType, setMedicineType] = useState('Tablet');
  const [medicinePrescription, setMedicinePrescription] = useState(true);
  const [medicineSalt, setMedicineSalt] = useState('');
  const [medicineDosage, setMedicineDosage] = useState('');
  const [medicineManufacturer, setMedicineManufacturer] = useState('');
  const [medicineBatch, setMedicineBatch] = useState('');
  const [medicineExpiry, setMedicineExpiry] = useState('');
  const [medicineStorage, setMedicineStorage] = useState('Room Temperature');
  const [medicineSideEffects, setMedicineSideEffects] = useState('');
  
  // ============== MEAT & FISH SPECIFIC FIELDS ==============
  const [meatType, setMeatType] = useState('Chicken');
  const [meatCutType, setMeatCutType] = useState('Curry Cut');
  const [meatWeight, setMeatWeight] = useState('');
  const [meatFreshness, setMeatFreshness] = useState('Fresh');
  const [meatSource, setMeatSource] = useState('');
  const [meatPackaging, setMeatPackaging] = useState('Vacuum Packed');
  const [meatDeliverySlot, setMeatDeliverySlot] = useState('Morning');
  const [meatStorage, setMeatStorage] = useState('Freeze immediately');

  // State for dynamic data
  const [categories, setCategories] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);

  // Initialize default categories for 6 categories
  const initializeDefaultCategories = async () => {
    try {
      const defaultCategories = [
        {
          name: 'Food',
          icon: 'Utensils',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=60',
          order: 1
        },
        {
          name: 'Medicine',
          icon: 'Pill',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&auto=format&fit=crop&q=60',
          order: 2
        },
        {
          name: 'Groceries',
          icon: 'ShoppingCart',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60',
          order: 3
        },
        {
          name: 'Fruits & Vegetables',
          icon: 'Apple',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=60',
          order: 4
        },
        {
          name: 'Meat & Fish',
          icon: 'Beef',
          image: 'https://images.unsplash.com/photo-1602476522486-3c138c5e4c44?w=400&auto=format&fit=crop&q=60',
          order: 5
        },
        {
          name: 'Dress & Gadgets',
          icon: 'ShoppingBag',
          image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=60',
          order: 6
        }
      ];

      // Check if categories already exist
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add default categories
        for (const category of defaultCategories) {
          const categoryData = {
            name: category.name,
            icon: category.icon,
            image: category.image,
            order: category.order,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            slug: category.name.toLowerCase().replace(/\s+/g, '-'),
            isDefault: true
          };

          await addDoc(categoriesRef, categoryData);
        }
        console.log('Default categories initialized');
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
    }
  };

  // Fetch existing categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        // Initialize default categories if none exist
        await initializeDefaultCategories();

        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categoriesData.push({
            id: doc.id,
            name: data.name,
            icon: data.icon,
            image: data.image,
            order: data.order || 0,
            status: data.status || 'active'
          });
        });

        setCategories(categoriesData);

        // Set default category if available
        if (categoriesData.length > 0 && !hotelCategory) {
          setHotelCategory(categoriesData[0].id);
        }
        if (categoriesData.length > 0 && !menuCategory) {
          setMenuCategory(categoriesData[0].id);
        }

      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchHotels = async () => {
      try {
        setLoadingHotels(true);
        const hotelsRef = collection(db, 'hotels');
        const q = query(hotelsRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);

        const hotelsData = [];
        querySnapshot.forEach((doc) => {
          hotelsData.push({
            id: doc.id,
            name: doc.data().name || 'Unnamed Hotel',
            categoryId: doc.data().categoryId,
            categoryName: doc.data().categoryName
          });
        });

        setHotelsList(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchCategories();
    fetchHotels();
  }, []);

  // Handle image file selection for categories
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB for optimal performance');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setCatImage('');
    }
  };

  // Handle image file selection for hotels
  const handleHotelImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB for optimal performance');
        return;
      }

      setHotelImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setHotelImagePreview(previewUrl);
      setHotelImage('');
    }
  };

  // Handle image file selection for menu items
  const handleMenuImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB for optimal performance');
        return;
      }

      setMenuImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMenuImagePreview(previewUrl);
      setMenuImage('');
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Icon options for categories
  const iconOptions = [
    'Utensils', 'Pill', 'ShoppingCart', 'Apple', 'Beef', 'ShoppingBag'
  ];

  // Handle Add Category
  const handleAddCategory = async () => {
    if (!catName.trim()) {
      alert('Please enter category name');
      return;
    }

    if (!imageFile && !catImage.trim()) {
      alert('Please upload an image or provide an image URL');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = catImage;

      if (imageFile) {
        imageUrl = await convertToBase64(imageFile);
      }

      const maxOrder = categories.length > 0
        ? Math.max(...categories.map(cat => cat.order || 0))
        : 0;

      const categoryData = {
        name: catName.trim(),
        icon: catIcon,
        image: imageUrl,
        order: maxOrder + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        slug: catName.trim().toLowerCase().replace(/\s+/g, '-'),
        imageStorageType: imageFile ? 'base64' : 'url'
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);

      alert(`Category "${catName}" added successfully!\nID: ${docRef.id}`);

      // Refresh categories list
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);

      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesData.push({
          id: doc.id,
          name: data.name,
          icon: data.icon,
          image: data.image,
          order: data.order || 0,
          status: data.status || 'active'
        });
      });

      setCategories(categoriesData);

      // Reset form
      setCatName('');
      setCatIcon('ShoppingBag');
      setCatImage('');
      setImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview('');
      }

    } catch (error) {
      console.error('Error adding category:', error);
      alert(`Failed to add category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Hotel (Restaurant/Store)
  const handleAddHotel = async () => {
    if (!hotelName.trim() || !hotelAddress.trim() || !hotelCategory || !hotelImage.trim() && !hotelImageFile) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = hotelImage;

      if (hotelImageFile) {
        imageUrl = await convertToBase64(hotelImageFile);
      }

      // Find selected category name
      const selectedCategory = categories.find(cat => cat.id === hotelCategory);
      const categoryName = selectedCategory ? selectedCategory.name : '';

      let categorySpecificData = {};

      switch (categoryName) {
        case 'Food':
          categorySpecificData = {
            cuisine: hotelCuisine,
            priceRange: hotelPriceRange,
            isVeg: hotelIsVeg
          };
          break;
        case 'Medicine':
          categorySpecificData = {
            medicineType: hotelMedicineType,
            isVeg: false
          };
          break;
        case 'Groceries':
          categorySpecificData = {
            groceryType: hotelGroceryType,
            isVeg: false
          };
          break;
        case 'Fruits & Vegetables':
          categorySpecificData = {
            fruitsType: hotelFruitsType,
            isVeg: true
          };
          break;
        case 'Meat & Fish':
          categorySpecificData = {
            meatType: hotelMeatType,
            isVeg: false
          };
          break;
        case 'Dress & Gadgets':
          categorySpecificData = {
            dressType: hotelDressType,
            priceRange: hotelPriceRange,
            isVeg: false
          };
          break;
        default:
          categorySpecificData = {
            isVeg: false
          };
      }

      const hotelData = {
        // Basic Info
        name: hotelName.trim(),
        description: hotelDescription.trim(),

        // Category Information
        categoryId: hotelCategory,
        categoryName: categoryName,

        // Category-specific data
        ...categorySpecificData,

        // Ratings & Pricing
        rating: parseFloat(hotelRating) || 4.5,

        // Delivery Info
        deliveryTime: hotelDeliveryTime.trim(),
        deliveryFee: parseFloat(hotelDeliveryFee) || 40,
        minOrder: parseFloat(hotelMinOrder) || 150,

        // Media
        image: imageUrl,
        offers: hotelOffers,

        // Location & Contact
        address: hotelAddress.trim(),
        phone: hotelPhone.trim(),
        email: hotelEmail.trim(),
        website: hotelWebsite.trim(),

        // Status & Settings
        status: hotelStatus,
        featured: hotelFeatured,
        open: hotelOpen,
        hygienePass: hotelHygienePass,

        // Business Type based on category
        businessType: categoryName === 'Food' ? 'restaurant' : 'store',

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        // Storage type
        imageStorageType: hotelImageFile ? 'base64' : 'url',

        // Additional fields
        commissionRate: 15,
        deliveryRadius: 5,
        avgPreparationTime: hotelDeliveryTime.replace('min', '').trim(),
        orderCount: 0
      };

      const docRef = await addDoc(collection(db, 'hotels'), hotelData);

      alert(`Business "${hotelName}" added successfully!\nID: ${docRef.id}`);

      // Refresh hotels list
      const hotelsRef = collection(db, 'hotels');
      const q = query(hotelsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      const hotelsData = [];
      querySnapshot.forEach((doc) => {
        hotelsData.push({
          id: doc.id,
          name: doc.data().name || 'Unnamed Business',
          categoryId: doc.data().categoryId,
          categoryName: doc.data().categoryName
        });
      });

      setHotelsList(hotelsData);

      // Reset form
      setHotelName('');
      setHotelDescription('');
      setHotelAddress('');
      setHotelPhone('');
      setHotelEmail('');
      setHotelRating('4.5');
      setHotelImage('');
      setHotelCategory(categories.length > 0 ? categories[0].id : '');
      setHotelIsVeg(false);
      setHotelDeliveryTime('30-40');
      setHotelDeliveryFee('40');
      setHotelMinOrder('150');
      setHotelCuisine('South Indian');
      setHotelPriceRange('₹₹');
      setHotelMedicineType('Pharmacy');
      setHotelGroceryType('Supermarket');
      setHotelFruitsType('Fruits Store');
      setHotelMeatType('Meat Shop');
      setHotelDressType('Clothing Store');
      setHotelOffers('');
      setHotelFeatured(false);
      setHotelStatus('active');
      setHotelWebsite('');
      setHotelHygienePass(true);
      setHotelOpen(true);
      setHotelImageFile(null);

      // Revoke object URL
      if (hotelImagePreview) {
        URL.revokeObjectURL(hotelImagePreview);
        setHotelImagePreview('');
      }

    } catch (error) {
      console.error('Error adding business:', error);
      alert(`❌ Failed to add business: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Menu Item with comprehensive category-specific fields
  const handleAddMenu = async () => {
    const selectedCategory = categories.find(cat => cat.id === menuCategory);
    const categoryName = selectedCategory ? selectedCategory.name : '';
    
    // Validate based on category
    let isValid = true;
    let errorMessage = '';

    if (!menuName.trim() || !menuPrice.trim() || !menuHotelId || !menuCategory) {
      isValid = false;
      errorMessage = 'Please fill all required fields';
    }

    // Category-specific validations
    switch(categoryName) {
      case 'Medicine':
        if (!medicineExpiry) {
          isValid = false;
          errorMessage = 'Expiry date is mandatory for medicines';
        }
        if (!medicineBatch) {
          isValid = false;
          errorMessage = 'Batch number is required for medicines';
        }
        break;
      case 'Groceries':
      case 'Fruits & Vegetables':
      case 'Meat & Fish':
        if (!groceryWeight && !fruitsWeight && !meatWeight) {
          isValid = false;
          errorMessage = 'Weight is required for this category';
        }
        break;
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    setLoading(true);

    try {
      let imageUrl = menuImage;

      if (menuImageFile) {
        imageUrl = await convertToBase64(menuImageFile);
      }

      // Find selected hotel
      const selectedHotel = hotelsList.find(hotel => hotel.id === menuHotelId);

      let categorySpecificData = {};

      switch (categoryName) {
        case 'Food':
          categorySpecificData = {
            productType: 'Food',
            foodType: foodType,
            cuisine: foodCuisine,
            ingredients: foodIngredients,
            spiceLevel: foodSpiceLevel,
            calories: foodCalories,
            preparationTime: foodPrepTime,
            bestSeller: foodBestSeller,
            addonsAvailable: foodAddons,
            packagingType: foodPackaging,
            isVeg: foodType === 'Veg' || foodType === 'Egg',
            isEgg: foodType === 'Egg',
            badges: [
              foodType === 'Veg' ? 'Veg' : foodType === 'Non-Veg' ? 'Non-Veg' : 'Egg',
              foodSpiceLevel,
              foodBestSeller ? 'Bestseller' : null
            ].filter(Boolean)
          };
          break;

        case 'Groceries':
          categorySpecificData = {
            productType: 'Groceries',
            groceryType: groceryType,
            netWeight: groceryWeight,
            packagingType: groceryPackaging,
            manufacturer: groceryManufacturer,
            storageInstructions: groceryStorage,
            countryOfOrigin: groceryOrigin,
            bestSeller: false,
            badges: [
              groceryType,
              groceryPackaging,
              groceryOrigin
            ]
          };
          break;

        case 'Dress & Gadgets':
          categorySpecificData = {
            productType: 'Dress',
            gender: dressGender,
            size: dressSize,
            colorOptions: dressColor,
            fabricMaterial: dressFabric,
            fitType: dressFit,
            occasion: dressOccasion,
            washCareInstructions: dressWashCare,
            countryOfManufacture: dressOrigin,
            // Badges for UI
            badges: [
              dressGender,
              dressFit,
              dressOccasion
            ]
          };
          break;

        case 'Fruits & Vegetables':
          categorySpecificData = {
            productType: 'FruitsVegetables',
            type: fruitsType,
            organic: fruitsOrganic,
            weight: fruitsWeight,
            freshnessDuration: fruitsFreshness,
            sourceLocation: fruitsSource,
            storageInstructions: fruitsStorage,
            cutOption: fruitsCutOption,
            seasonal: fruitsSeasonal,
            // Badges for UI
            badges: [
              fruitsOrganic ? 'Organic' : 'Non-Organic',
              fruitsCutOption,
              fruitsSeasonal ? 'Seasonal' : null
            ].filter(Boolean)
          };
          break;

        case 'Medicine':
          categorySpecificData = {
            productType: 'Medicine',
            medicineType: medicineType,
            prescriptionRequired: medicinePrescription,
            saltComposition: medicineSalt,
            dosageInstructions: medicineDosage,
            manufacturer: medicineManufacturer,
            batchNumber: medicineBatch,
            expiryDate: medicineExpiry,
            storageConditions: medicineStorage,
            sideEffects: medicineSideEffects,
            // Safety check - disable if expired
            available: new Date(medicineExpiry) > new Date(),
            // Badges for UI
            badges: [
              medicinePrescription ? 'Prescription' : 'OTC',
              medicineType,
              medicineManufacturer
            ]
          };
          break;

        case 'Meat & Fish':
          categorySpecificData = {
            productType: 'MeatFish',
            meatType: meatType,
            cutType: meatCutType,
            weight: meatWeight,
            freshness: meatFreshness,
            source: meatSource,
            packaging: meatPackaging,
            deliveryTimeSlot: meatDeliverySlot,
            storageInstructions: meatStorage,
            // Badges for UI
            badges: [
              meatType,
              meatFreshness,
              meatCutType
            ]
          };
          break;

        default:
          categorySpecificData = {
            productType: 'General'
          };
      }

      const menuData = {
        // Basic Info
        name: menuName.trim(),
        description: menuDescription.trim(),
        price: parseFloat(menuPrice),

        // Hotel Info
        hotelId: menuHotelId,
        hotelName: selectedHotel ? selectedHotel.name : menuHotelId,

        // Category
        categoryId: menuCategory,
        categoryName: categoryName,

        // Category-specific comprehensive data
        ...categorySpecificData,

        // Type & Availability
        isVeg: menuIsVeg,
        available: menuAvailable && (categoryName !== 'Medicine' || new Date(medicineExpiry) > new Date()),
        spicyLevel: categoryName === 'Food' ? menuSpicyLevel : '',
        preparationTime: categoryName === 'Food' ? menuPreparationTime : '',

        // Media
        image: imageUrl,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        // Status - auto-check for medicines
        status: (categoryName === 'Medicine' && new Date(medicineExpiry) <= new Date()) ? 'expired' : 'active',

        // Storage type
        imageStorageType: menuImageFile ? 'base64' : 'url',

        // Additional fields
        rating: 0,
        orderCount: 0,
        tags: [],

        // Inventory management
        stockQuantity: 100,
        lowStockThreshold: 10,
        reorderPoint: 5,

        // SEO & Display
        displayPriority: foodBestSeller ? 1 : 0,
        featured: foodBestSeller || false
      };

      const docRef = await addDoc(collection(db, 'menu'), menuData);

      alert(`✅ Product "${menuName}" added successfully!\nID: ${docRef.id}`);

      // Reset form
      resetMenuForm();

    } catch (error) {
      console.error('Error adding menu item:', error);
      alert(`❌ Failed to add menu item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetMenuForm = () => {
    setMenuName('');
    setMenuDescription('');
    setMenuPrice('');
    setMenuImage('');
    setMenuHotelId('');
    setMenuCategory(categories.length > 0 ? categories[0].id : '');
    setMenuIsVeg(true);
    setMenuAvailable(true);
    setMenuSpicyLevel('Medium');
    setMenuPreparationTime('15-20');
    
    // Food
    setFoodType('Veg');
    setFoodCuisine('Indian');
    setFoodIngredients('');
    setFoodSpiceLevel('Medium');
    setFoodCalories('');
    setFoodPrepTime('15-20');
    setFoodBestSeller(false);
    setFoodAddons([]);
    setFoodPackaging('Regular');
    
    // Groceries
    setGroceryType('Staples');
    setGroceryWeight('');
    setGroceryPackaging('Packet');
    setGroceryManufacturer('');
    setGroceryStorage('');
    setGroceryOrigin('India');
    
    // Dress
    setDressGender('Unisex');
    setDressSize('');
    setDressColor('');
    setDressFabric('');
    setDressFit('Regular');
    setDressOccasion('Casual');
    setDressWashCare('');
    setDressOrigin('India');
    
    // Fruits & Vegetables
    setFruitsType('Fruits');
    setFruitsOrganic(false);
    setFruitsWeight('');
    setFruitsFreshness('3-5 days');
    setFruitsSource('');
    setFruitsStorage('Refrigerate');
    setFruitsCutOption('Uncut');
    setFruitsSeasonal(false);
    
    // Medicine
    setMedicineType('Tablet');
    setMedicinePrescription(true);
    setMedicineSalt('');
    setMedicineDosage('');
    setMedicineManufacturer('');
    setMedicineBatch('');
    setMedicineExpiry('');
    setMedicineStorage('Room Temperature');
    setMedicineSideEffects('');
    
    // Meat & Fish
    setMeatType('Chicken');
    setMeatCutType('Curry Cut');
    setMeatWeight('');
    setMeatFreshness('Fresh');
    setMeatSource('');
    setMeatPackaging('Vacuum Packed');
    setMeatDeliverySlot('Morning');
    setMeatStorage('Freeze immediately');
    
    setMenuImageFile(null);
    
    if (menuImagePreview) {
      URL.revokeObjectURL(menuImagePreview);
      setMenuImagePreview('');
    }
  };

  // Clear image selection functions
  const clearImageSelection = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setCatImage('');
  };

  const clearHotelImageSelection = () => {
    if (hotelImagePreview) {
      URL.revokeObjectURL(hotelImagePreview);
    }
    setHotelImageFile(null);
    setHotelImagePreview('');
    setHotelImage('');
  };

  const clearMenuImageSelection = () => {
    if (menuImagePreview) {
      URL.revokeObjectURL(menuImagePreview);
    }
    setMenuImageFile(null);
    setMenuImagePreview('');
    setMenuImage('');
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (hotelImagePreview) URL.revokeObjectURL(hotelImagePreview);
      if (menuImagePreview) URL.revokeObjectURL(menuImagePreview);
    };
  }, [imagePreview, hotelImagePreview, menuImagePreview]);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Utensils': Utensils,
      'Pill': Pill,
      'ShoppingCart': ShoppingCart,
      'Apple': Apple,
      'Beef': Beef,
      'ShoppingBag': ShoppingBag,
      'Store': Store,
      'Tag': Tag,
      'Filter': Filter,
    };

    return iconMap[iconName] || ShoppingBag;
  };

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(cat => cat.id === menuCategory);
    return selectedCategory ? selectedCategory.name : '';
  };

  const getSelectedBusinessCategoryName = () => {
    const selectedCategory = categories.find(cat => cat.id === hotelCategory);
    return selectedCategory ? selectedCategory.name : '';
  };

  const renderBusinessCategorySpecificFields = () => {
    const categoryName = getSelectedBusinessCategoryName();

    switch (categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Restaurant Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Cuisine *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelCuisine}
                  onChange={(e) => setHotelCuisine(e.target.value)}
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Multi-Cuisine">Multi-Cuisine</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Fine Dining">Fine Dining</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelPriceRange}
                  onChange={(e) => setHotelPriceRange(e.target.value)}
                >
                  <option value="₹">Budget (₹)</option>
                  <option value="₹₹">Moderate (₹₹)</option>
                  <option value="₹₹₹">Premium (₹₹₹)</option>
                  <option value="₹₹₹₹">Luxury (₹₹₹₹)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl flex-1">
                <input
                  type="checkbox"
                  id="isVeg"
                  checked={hotelIsVeg}
                  onChange={(e) => setHotelIsVeg(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="isVeg" className="text-sm font-medium text-gray-700">
                  Pure Vegetarian
                </label>
              </div>
              <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
            </div>
          </div>
        );

      case 'Medicine':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Medical Store Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelMedicineType}
                  onChange={(e) => setHotelMedicineType(e.target.value)}
                >
                  <option value="Pharmacy">General Pharmacy</option>
                  <option value="24x7 Pharmacy">24x7 Pharmacy</option>
                  <option value="Generic Medicine Store">Generic Medicine Store</option>
                  <option value="Ayurvedic Store">Ayurvedic Store</option>
                  <option value="Homeopathic Store">Homeopathic Store</option>
                  <option value="Medical Equipment">Medical Equipment</option>
                  <option value="Surgical Supplies">Surgical Supplies</option>
                  <option value="Diagnostic Center">Diagnostic Center</option>
                </select>
              </div>
              <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
            </div>
          </div>
        );

      case 'Groceries':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Grocery Store Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelGroceryType}
                  onChange={(e) => setHotelGroceryType(e.target.value)}
                >
                  <option value="Supermarket">Supermarket</option>
                  <option value="Kirana Store">Kirana Store</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Bulk Store">Bulk Store</option>
                  <option value="Convenience Store">Convenience Store</option>
                  <option value="Specialty Store">Specialty Store</option>
                  <option value="Online Grocery">Online Grocery</option>
                </select>
              </div>
              <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
            </div>
          </div>
        );

      case 'Fruits & Vegetables':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Fruits & Vegetables Store Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelFruitsType}
                  onChange={(e) => setHotelFruitsType(e.target.value)}
                >
                  <option value="Fruits Store">Fruits Store</option>
                  <option value="Vegetables Store">Vegetables Store</option>
                  <option value="Fruits & Vegetables">Both Fruits & Vegetables</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Juice Center">Juice Center</option>
                  <option value="Exotic Fruits">Exotic Fruits</option>
                  <option value="Local Market">Local Market Vendor</option>
                </select>
              </div>
              <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
            </div>
          </div>
        );

      case 'Meat & Fish':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Meat & Fish Shop Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Shop Type *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelMeatType}
                  onChange={(e) => setHotelMeatType(e.target.value)}
                >
                  <option value="Meat Shop">Meat Shop</option>
                  <option value="Fish Shop">Fish Shop</option>
                  <option value="Both Meat & Fish">Both Meat & Fish</option>
                  <option value="Chicken Speciality">Chicken Speciality</option>
                  <option value="Mutton Speciality">Mutton Speciality</option>
                  <option value="Seafood">Seafood Shop</option>
                  <option value="Halal Meat">Halal Meat Shop</option>
                  <option value="Frozen Meat">Frozen Meat Shop</option>
                </select>
              </div>
              <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
            </div>
          </div>
        );

      case 'Dress & Gadgets':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Dress & Gadgets Store Details</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelDressType}
                  onChange={(e) => setHotelDressType(e.target.value)}
                >
                  <option value="Clothing Store">Clothing Store</option>
                  <option value="Electronics Store">Electronics Store</option>
                  <option value="Both Clothing & Electronics">Both Clothing & Electronics</option>
                  <option value="Mobile Store">Mobile Store</option>
                  <option value="Footwear Store">Footwear Store</option>
                  <option value="Accessories Store">Accessories Store</option>
                  <option value="Department Store">Department Store</option>
                  <option value="Brand Outlet">Brand Outlet</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range *</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                  value={hotelPriceRange}
                  onChange={(e) => setHotelPriceRange(e.target.value)}
                >
                  <option value="Budget">Budget</option>
                  <option value="Mid Range">Mid Range</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
            <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Business Details</h3>
            <InputField label="Rating" value={hotelRating} onChange={setHotelRating} placeholder="4.5" type="number" min="0" max="5" step="0.1" required />
          </div>
        );
    }
  };

  const renderProductCategorySpecificFields = () => {
    const categoryName = getSelectedCategoryName();

    switch (categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Food Product Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Food Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  required
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Egg">Contains Egg</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cuisine *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodCuisine}
                  onChange={(e) => setFoodCuisine(e.target.value)}
                  required
                >
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Continental">Continental</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ingredients</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={foodIngredients}
                onChange={(e) => setFoodIngredients(e.target.value)}
                placeholder="List main ingredients..."
                rows="2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Spice Level</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodSpiceLevel}
                  onChange={(e) => setFoodSpiceLevel(e.target.value)}
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Spicy">Spicy</option>
                  <option value="Very Spicy">Very Spicy</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Calories (approx)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodCalories}
                  onChange={(e) => setFoodCalories(e.target.value)}
                  placeholder="e.g., 250 kcal"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prep Time (min)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodPrepTime}
                  onChange={(e) => setFoodPrepTime(e.target.value)}
                  placeholder="15-20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Packaging Type</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={foodPackaging}
                  onChange={(e) => setFoodPackaging(e.target.value)}
                >
                  <option value="Regular">Regular</option>
                  <option value="Eco-friendly">Eco-friendly</option>
                  <option value="Premium">Premium</option>
                  <option value="Microwave Safe">Microwave Safe</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="foodBestSeller"
                checked={foodBestSeller}
                onChange={(e) => setFoodBestSeller(e.target.checked)}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
              />
              <label htmlFor="foodBestSeller" className="text-sm font-medium text-gray-700">
                Mark as Best Seller
              </label>
            </div>
          </div>
        );

      case 'Groceries':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Grocery Product Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={groceryType}
                  onChange={(e) => setGroceryType(e.target.value)}
                  required
                >
                  <option value="Staples">Staples</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy Products</option>
                  <option value="Frozen">Frozen Foods</option>
                  <option value="Cooking">Cooking Essentials</option>
                  <option value="Household">Household Items</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Net Weight/Volume *</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={groceryWeight}
                  onChange={(e) => setGroceryWeight(e.target.value)}
                  placeholder="e.g., 1kg, 500ml"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Packaging Type</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={groceryPackaging}
                  onChange={(e) => setGroceryPackaging(e.target.value)}
                >
                  <option value="Packet">Packet</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Box">Box</option>
                  <option value="Can">Can</option>
                  <option value="Jar">Jar</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Country of Origin</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={groceryOrigin}
                  onChange={(e) => setGroceryOrigin(e.target.value)}
                  placeholder="India"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Manufacturer Details</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={groceryManufacturer}
                onChange={(e) => setGroceryManufacturer(e.target.value)}
                placeholder="Manufacturer name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Storage Instructions</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={groceryStorage}
                onChange={(e) => setGroceryStorage(e.target.value)}
                placeholder="Store in cool, dry place..."
                rows="2"
              />
            </div>
          </div>
        );

      case 'Dress & Gadgets':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <Shirt className="w-4 h-4" /> Dress & Clothing Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={dressGender}
                  onChange={(e) => setDressGender(e.target.value)}
                  required
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={dressSize}
                  onChange={(e) => setDressSize(e.target.value)}
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Color Options</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={dressColor}
                onChange={(e) => setDressColor(e.target.value)}
                placeholder="Red, Blue, Black, White"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fabric/Material</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={dressFabric}
                  onChange={(e) => setDressFabric(e.target.value)}
                  placeholder="Cotton, Silk, Polyester"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fit Type</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={dressFit}
                  onChange={(e) => setDressFit(e.target.value)}
                >
                  <option value="Slim">Slim</option>
                  <option value="Regular">Regular</option>
                  <option value="Loose">Loose</option>
                  <option value="Oversized">Oversized</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Occasion</label>
              <select
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={dressOccasion}
                onChange={(e) => setDressOccasion(e.target.value)}
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Sports">Sports</option>
                <option value="Ethnic">Ethnic</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Wash Care Instructions</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={dressWashCare}
                onChange={(e) => setDressWashCare(e.target.value)}
                placeholder="Machine wash cold, Do not bleach..."
                rows="2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country of Manufacture</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={dressOrigin}
                onChange={(e) => setDressOrigin(e.target.value)}
                placeholder="India"
              />
            </div>
          </div>
        );

      case 'Fruits & Vegetables':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <Apple className="w-4 h-4" /> Fruits & Vegetables Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={fruitsType}
                  onChange={(e) => setFruitsType(e.target.value)}
                  required
                >
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                  <option value="Herbs">Herbs</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight *</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={fruitsWeight}
                  onChange={(e) => setFruitsWeight(e.target.value)}
                  placeholder="e.g., 1kg, 500g"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="fruitsOrganic"
                checked={fruitsOrganic}
                onChange={(e) => setFruitsOrganic(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="fruitsOrganic" className="text-sm font-medium text-gray-700">
                Organic Product
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Freshness Duration</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={fruitsFreshness}
                  onChange={(e) => setFruitsFreshness(e.target.value)}
                  placeholder="3-5 days"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cut Option</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={fruitsCutOption}
                  onChange={(e) => setFruitsCutOption(e.target.value)}
                >
                  <option value="Uncut">Uncut</option>
                  <option value="Cut">Cut</option>
                  <option value="Cleaned">Cleaned</option>
                  <option value="Chopped">Chopped</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source Location</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={fruitsSource}
                onChange={(e) => setFruitsSource(e.target.value)}
                placeholder="Farm name or region"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Storage Instructions</label>
              <select
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={fruitsStorage}
                onChange={(e) => setFruitsStorage(e.target.value)}
              >
                <option value="Refrigerate">Refrigerate</option>
                <option value="Room Temperature">Room Temperature</option>
                <option value="Cool Dry Place">Cool Dry Place</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="fruitsSeasonal"
                checked={fruitsSeasonal}
                onChange={(e) => setFruitsSeasonal(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="fruitsSeasonal" className="text-sm font-medium text-gray-700">
                Seasonal Product
              </label>
            </div>
          </div>
        );

      case 'Medicine':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <Pill className="w-4 h-4" /> Medicine Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Medicine Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineType}
                  onChange={(e) => setMedicineType(e.target.value)}
                  required
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream/Ointment</option>
                  <option value="Drops">Eye/Ear Drops</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Suppository">Suppository</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
                <input
                  type="date"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineExpiry}
                  onChange={(e) => setMedicineExpiry(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="medicinePrescription"
                checked={medicinePrescription}
                onChange={(e) => setMedicinePrescription(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="medicinePrescription" className="text-sm font-medium text-gray-700">
                Prescription Required
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salt Composition</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineSalt}
                  onChange={(e) => setMedicineSalt(e.target.value)}
                  placeholder="Active ingredient"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Batch Number *</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineBatch}
                  onChange={(e) => setMedicineBatch(e.target.value)}
                  placeholder="Batch/Lot number"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dosage Instructions</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={medicineDosage}
                onChange={(e) => setMedicineDosage(e.target.value)}
                placeholder="Take 1 tablet twice daily after meals"
                rows="2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Manufacturer</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineManufacturer}
                  onChange={(e) => setMedicineManufacturer(e.target.value)}
                  placeholder="Pharmaceutical company"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Storage Conditions</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={medicineStorage}
                  onChange={(e) => setMedicineStorage(e.target.value)}
                >
                  <option value="Room Temperature">Room Temperature</option>
                  <option value="Refrigerate">Refrigerate (2-8°C)</option>
                  <option value="Cool Place">Cool Dry Place</option>
                  <option value="Avoid Sunlight">Avoid Sunlight</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Side Effects (optional)</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={medicineSideEffects}
                onChange={(e) => setMedicineSideEffects(e.target.value)}
                placeholder="Common side effects..."
                rows="2"
              />
            </div>
          </div>
        );

      case 'Meat & Fish':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
              <Beef className="w-4 h-4" /> Meat & Fish Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Meat Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatType}
                  onChange={(e) => setMeatType(e.target.value)}
                  required
                >
                  <option value="Chicken">Chicken</option>
                  <option value="Mutton">Mutton</option>
                  <option value="Fish">Fish</option>
                  <option value="Prawns">Prawns</option>
                  <option value="Crab">Crab</option>
                  <option value="Eggs">Eggs</option>
                  <option value="Processed">Processed Meat</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cut Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatCutType}
                  onChange={(e) => setMeatCutType(e.target.value)}
                  required
                >
                  <option value="Curry Cut">Curry Cut</option>
                  <option value="Boneless">Boneless</option>
                  <option value="Whole">Whole</option>
                  <option value="Fillet">Fillet</option>
                  <option value="Minced">Minced</option>
                  <option value="Slices">Slices</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight *</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatWeight}
                  onChange={(e) => setMeatWeight(e.target.value)}
                  placeholder="e.g., 1kg, 500g"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Freshness</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatFreshness}
                  onChange={(e) => setMeatFreshness(e.target.value)}
                >
                  <option value="Fresh">Fresh</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Marinated">Marinated</option>
                  <option value="Ready to Cook">Ready to Cook</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={meatSource}
                onChange={(e) => setMeatSource(e.target.value)}
                placeholder="Farm name or region"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Packaging</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatPackaging}
                  onChange={(e) => setMeatPackaging(e.target.value)}
                >
                  <option value="Vacuum Packed">Vacuum Packed</option>
                  <option value="Ice Packed">Ice Packed</option>
                  <option value="Regular">Regular Packaging</option>
                  <option value="Premium">Premium Packaging</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Delivery Slot</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={meatDeliverySlot}
                  onChange={(e) => setMeatDeliverySlot(e.target.value)}
                >
                  <option value="Morning">Morning (8AM-12PM)</option>
                  <option value="Afternoon">Afternoon (12PM-4PM)</option>
                  <option value="Evening">Evening (4PM-8PM)</option>
                  <option value="Any">Any Time</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Storage Instructions</label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={meatStorage}
                onChange={(e) => setMeatStorage(e.target.value)}
                placeholder="Freeze immediately upon delivery..."
                rows="2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAdminBestPractices = () => {
    const categoryName = getSelectedCategoryName();
    
    const practices = {
      'Food': [
        '✓ Use dropdowns for food type, cuisine, spice level',
        '✓ Auto-hide non-veg options for pure veg restaurants',
        '✓ Validate preparation time is realistic',
        '✓ Show food type badge (Veg/Non-Veg/Egg) on UI'
      ],
      'Medicine': [
        '✓ Expiry date is MANDATORY - validate daily',
        '✓ Disable purchase if medicine expired/out of stock',
        '✓ Show prescription badge prominently',
        '✓ Batch number must be recorded'
      ],
      'Groceries': [
        '✓ Weight/volume is required',
        '✓ Manufacturer details help with traceability',
        '✓ Country of origin important for imports',
        '✓ Storage instructions prevent returns'
      ],
      'Fruits & Vegetables': [
        '✓ Organic/Non-Organic clearly marked',
        '✓ Freshness duration helps customers plan',
        '✓ Seasonal products get special display',
        '✓ Cut option affects pricing'
      ],
      'Meat & Fish': [
        '✓ Source tracing builds trust',
        '✓ Delivery slots ensure freshness',
        '✓ Storage instructions prevent spoilage',
        '✓ Cut type affects preparation'
      ],
      'Dress & Gadgets': [
        '✓ Size charts prevent returns',
        '✓ Fabric care reduces customer complaints',
        '✓ Country of origin for duty/tax',
        '✓ Fit type helps customers choose'
      ]
    };
    
    const currentPractices = practices[categoryName] || [
      '✓ Fill all mandatory fields marked with *',
      '✓ Upload clear product images',
      '✓ Set realistic pricing',
      '✓ Update stock regularly'
    ];
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" /> Admin Best Practices for {categoryName}
        </h4>
        <ul className="space-y-1">
          {currentPractices.map((practice, index) => (
            <li key={index} className="text-blue-700 text-xs flex items-start gap-2">
              <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
              {practice}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-black">Admin Management</h1>
              <p className="text-xs text-gray-500 italic">Manage your marketplace data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-6 border-b border-gray-200 overflow-x-auto no-scrollbar scroll-smooth">
        <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={Tag} label="Categories" />
        <TabButton active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} icon={Hotel} label="Businesses" />
        <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={Menu} label="Products" />
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        {activeTab === 'categories' && (
          <FormCard title="Manage Categories" onSubmit={handleAddCategory} loading={loading}>
            <InputField label="Name" value={catName} onChange={setCatName} placeholder="e.g. Food, Medicine, Groceries" required />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Icon *</label>
              <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded-xl">
                {iconOptions.map((icon) => {
                  const IconComp = getIconComponent(icon);
                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCatIcon(icon)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 ${catIcon === icon ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-xs">{icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category Image *</label>
              <div className="space-y-3">
                <label className="block">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove uploaded image
                  </button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <InputField
                  label="Image URL (if not uploading)"
                  value={catImage}
                  onChange={setCatImage}
                  placeholder="https://..."
                  disabled={!!imageFile}
                />

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Upload an image file (JPEG, PNG, max 2MB) OR provide an image URL
                </p>
              </div>
            </div>

          </FormCard>
        )}

        {activeTab === 'hotels' && (
          <FormCard title="Register New Business" onSubmit={handleAddHotel} loading={loading}>
            {/* Section: Basic Information */}
            <div className="space-y-4">
              <InputField label="Business Name *" value={hotelName} onChange={setHotelName} placeholder="e.g. Sangeetha Hotel, Medical Store, Grocery Mart" required />
              <InputField label="Description" value={hotelDescription} onChange={setHotelDescription} placeholder="Brief description about the business..." />
            </div>

            {/* Section: Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Business Category *</label>
              {loadingCategories ? (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-yellow-800 text-xs">Add categories first</p>
                </div>
              ) : (
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories
                    .filter(cat => cat.status === 'active')
                    .map((category) => {
                      const IconComp = getIconComponent(category.icon);
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                </select>
              )}
            </div>

            {/* Category-specific business fields */}
            {renderBusinessCategorySpecificFields()}

            {/* Special Offers - Available for ALL categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Special Offers</h3>
              <InputField
                label="Offers & Discounts"
                value={hotelOffers}
                onChange={setHotelOffers}
                placeholder="e.g. 20% OFF on first order, Free delivery above ₹300, Buy 1 Get 1 Free, 10% cashback"
              />
            </div>

            {/* Section: Delivery & Pricing (Common for all) */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Delivery & Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Delivery Time" value={hotelDeliveryTime} onChange={setHotelDeliveryTime} placeholder="30-40 min" required />
                <InputField label="Min Order (₹)" value={hotelMinOrder} onChange={setHotelMinOrder} placeholder="150" type="number" min="0" required />
              </div>
            </div>

            {/* Section: Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Contact Information</h3>
              <InputField label="Address *" value={hotelAddress} onChange={setHotelAddress} placeholder="Full address with city and pincode" required />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Phone Number" value={hotelPhone} onChange={setHotelPhone} placeholder="+91 9876543210" />
                <InputField label="Email" value={hotelEmail} onChange={setHotelEmail} placeholder="contact@business.com" type="email" />
              </div>
            </div>

            {/* Section: Business Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Business Image *</label>
              <div className="space-y-3">
                <label className="block">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {hotelImageFile ? hotelImageFile.name : 'Click to upload business image'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleHotelImageUpload}
                    />
                  </div>
                </label>

                {hotelImageFile && (
                  <button
                    type="button"
                    onClick={clearHotelImageSelection}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove uploaded image
                  </button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <InputField
                  label="Image URL (if not uploading)"
                  value={hotelImage}
                  onChange={setHotelImage}
                  placeholder="https://..."
                  disabled={!!hotelImageFile}
                  required={!hotelImageFile}
                />

                {hotelImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={hotelImagePreview}
                        alt="Business Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Upload an image file (JPEG, PNG, max 2MB) OR provide an image URL
                </p>
              </div>
            </div>
          </FormCard>
        )}

        {activeTab === 'menu' && (
          <FormCard title="Add Product" onSubmit={handleAddMenu} loading={loading}>
            {/* Basic Information */}
            <div className="space-y-4">
              <InputField label="Product Name *" value={menuName} onChange={setMenuName} placeholder="e.g. Butter Chicken, Medicine, Grocery Item" required />
              <InputField label="Description" value={menuDescription} onChange={setMenuDescription} placeholder="Brief description about the product..." />
            </div>

            {/* Price */}
            <InputField label="Price (₹) *" value={menuPrice} onChange={setMenuPrice} placeholder="250" type="number" min="0" required />

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Category *</label>
              {loadingCategories ? (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-yellow-800 text-xs">Add categories first</p>
                </div>
              ) : (
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={menuCategory}
                  onChange={(e) => setMenuCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories
                    .filter(cat => cat.status === 'active')
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Category-specific product fields */}
            {renderProductCategorySpecificFields()}

            {/* Business Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Business *</label>
              {loadingHotels ? (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Loading businesses...</p>
                </div>
              ) : hotelsList.length === 0 ? (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-yellow-800 text-xs">Add businesses first from Businesses tab</p>
                </div>
              ) : (
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={menuHotelId}
                  onChange={(e) => setMenuHotelId(e.target.value)}
                  required
                >
                  <option value="">Choose a business...</option>
                  {hotelsList.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} ({hotel.categoryName})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Product Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Image</label>
              <div className="space-y-3">
                <label className="block">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {menuImageFile ? menuImageFile.name : 'Click to upload product image'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMenuImageUpload}
                    />
                  </div>
                </label>

                {menuImageFile && (
                  <button
                    type="button"
                    onClick={clearMenuImageSelection}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove uploaded image
                  </button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <InputField
                  label="Image URL (if not uploading)"
                  value={menuImage}
                  onChange={setMenuImage}
                  placeholder="https://..."
                  disabled={!!menuImageFile}
                />

                {menuImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={menuImagePreview}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Upload an image file (JPEG, PNG, max 2MB) OR provide an image URL
                </p>
              </div>
            </div>

            {/* Product Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Product Settings</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="menuIsVeg"
                    checked={menuIsVeg}
                    onChange={(e) => setMenuIsVeg(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="menuIsVeg" className="text-sm font-medium text-gray-700">
                    Suitable for Vegetarians
                  </label>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="menuAvailable"
                    checked={menuAvailable}
                    onChange={(e) => setMenuAvailable(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="menuAvailable" className="text-sm font-medium text-gray-700">
                    Available
                  </label>
                </div>
              </div>

              {/* Conditional fields for Food category */}
              {(() => {
                const selectedBusiness = hotelsList.find(hotel => hotel.id === menuHotelId);
                if (selectedBusiness?.categoryName === 'Food') {
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Spicy Level</label>
                        <select
                          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                          value={menuSpicyLevel}
                          onChange={(e) => setMenuSpicyLevel(e.target.value)}
                        >
                          <option value="Mild">Mild</option>
                          <option value="Medium">Medium</option>
                          <option value="Spicy">Spicy</option>
                          <option value="Very Spicy">Very Spicy</option>
                        </select>
                      </div>

                      <InputField
                        label="Prep Time (min)"
                        value={menuPreparationTime}
                        onChange={setMenuPreparationTime}
                        placeholder="15-20"
                      />
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Admin Best Practices */}
            {renderAdminBestPractices()}
          </FormCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

function TabButton({ active, onClick, icon, label }) {
  const IconComp = icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap outline-none ${active ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
    >
      {IconComp && <IconComp className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`} />}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function FormCard({ title, children, onSubmit, loading }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="font-bold text-xl text-black">{title}</h2>
      <div className="space-y-4">{children}</div>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-5 h-5" />}
        {loading ? 'Processing...' : 'Add to Database'}
      </button>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required = false, disabled = false, min, max, step }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}