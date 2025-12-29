import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Store, ShoppingBag, Tag, Users, Trash2, MapPin, Truck, Database } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { seedDatabase } from '../services/seedData';

interface AdminDashboardProps {
    onBack: () => void;
}

type TabType = 'categories' | 'stores' | 'products' | 'partners';

export function AdminDashboardScreen({ onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('categories');
    const [loading, setLoading] = useState(false);
    const [seeding, setSeeding] = useState(false);

    // Categories Form State
    const [catName, setCatName] = useState('');
    const [catIcon, setCatIcon] = useState('ShoppingBag');
    const [catImage, setCatImage] = useState('');

    // Stores (Hotels/Shops) Form State
    const [storeName, setStoreName] = useState('');
    const [storeType, setStoreType] = useState<'hotel' | 'grocery' | 'pharmacy'>('hotel');
    const [storeRating, setStoreRating] = useState('4.5');
    const [storeImage, setStoreImage] = useState('');
    const [storeCat, setStoreCat] = useState('food');

    // Products (Menu/Pricing) Form State
    const [prodName, setProdName] = useState('');
    const [prodPrice, setProdPrice] = useState('');
    const [prodImage, setProdImage] = useState('');
    const [prodStoreId, setProdStoreId] = useState('');
    const [prodCategory, setProdCategory] = useState('food');

    // Delivery Partners Form State
    const [partnerName, setPartnerName] = useState('');
    const [partnerPhone, setPartnerPhone] = useState('');
    const [partnerVehicle, setPartnerVehicle] = useState('Bike');

    // Data lists for dropdowns
    const [storesList, setStoresList] = useState<any[]>([]);

    const fetchStores = useCallback(async () => {
        try {
            const snapshot = await getDocs(collection(db, 'stores'));
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStoresList(list);
        } catch (err) {
            console.error('Error fetching stores:', err);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'products') {
            fetchStores();
        }
    }, [activeTab, fetchStores]);

    const handleSeedData = async () => {
        if (!window.confirm("This will populate the database with original mock categories, stores, and products. Continue?")) return;
        setSeeding(true);
        console.log('Button clicked, starting seed...');
        try {
            const success = await seedDatabase();
            if (success) {
                toast.success("Database Seeded Successfully!");
                if (activeTab === 'products') fetchStores();
            }
        } catch (e: any) {
            console.error('Seed error:', e);
            toast.error("Seeding failed: " + e.message);
        } finally {
            setSeeding(false);
            console.log('Seeding process finished.');
        }
    };

    const handleAddCategory = async () => {
        if (!catName || !catImage) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            await addDoc(collection(db, 'categories'), {
                id: catName.toLowerCase().replace(/\s+/g, '_'),
                labelKey: catName.toLowerCase(),
                name: catName,
                iconName: catIcon,
                image: catImage,
                color: 'from-orange-400 to-red-400'
            });
            toast.success("Category Added!");
            setCatName(''); setCatImage('');
        } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
    };

    const handleAddStore = async () => {
        if (!storeName || !storeImage) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            await addDoc(collection(db, 'stores'), {
                name: storeName,
                type: storeType,
                rating: parseFloat(storeRating),
                image: storeImage,
                categories: [storeCat],
                deliveryTime: '25-30 min'
            });
            toast.success("Hotel/Shop Added!");
            setStoreName(''); setStoreImage('');
        } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
    };

    const handleAddProduct = async () => {
        if (!prodName || !prodPrice || !prodStoreId) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            await addDoc(collection(db, 'products'), {
                name: prodName,
                price: parseFloat(prodPrice),
                image: prodImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
                storeId: prodStoreId,
                categoryId: prodCategory,
                rating: 4.5
            });
            toast.success("Menu Item Added!");
            setProdName(''); setProdPrice(''); setProdImage('');
        } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
    };

    const handleAddPartner = async () => {
        if (!partnerName || !partnerPhone) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            await addDoc(collection(db, 'delivery_partners'), {
                name: partnerName,
                phoneNumber: partnerPhone,
                vehicleType: partnerVehicle,
                status: 'online',
                rating: 5.0
            });
            toast.success("Delivery Partner Added!");
            setPartnerName(''); setPartnerPhone('');
        } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-6 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 text-black" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-black">Admin Management</h1>
                            <p className="text-xs text-gray-500 italic">Manage your marketplace data</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSeedData}
                        disabled={seeding}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl font-bold text-xs hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                        <Database className="w-4 h-4" />
                        {seeding ? 'Seeding...' : 'Seed Mock Data'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white px-6 border-b border-gray-200 overflow-x-auto no-scrollbar scroll-smooth">
                <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={Tag} label="Categories" />
                <TabButton active={activeTab === 'stores'} onClick={() => setActiveTab('stores')} icon={Store} label="Hotels/Shops" />
                <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={ShoppingBag} label="Menu/Pricing" />
                <TabButton active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} icon={Truck} label="Partners" />
            </div>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                {activeTab === 'categories' && (
                    <FormCard title="Add New Category" onSubmit={handleAddCategory} loading={loading}>
                        <InputField label="Name" value={catName} onChange={setCatName} placeholder="e.g. Biryani, Pizza" />
                        <SelectField label="Icon" value={catIcon} onChange={setCatIcon} options={['ShoppingBag', 'Store', 'Apple', 'Beef', 'Pill']} />
                        <InputField label="Image URL" value={catImage} onChange={setCatImage} placeholder="https://..." />
                    </FormCard>
                )}

                {activeTab === 'stores' && (
                    <FormCard title="Register New Hotel/Shop" onSubmit={handleAddStore} loading={loading}>
                        <InputField label="Business Name" value={storeName} onChange={setStoreName} placeholder="e.g. Sangeetha Hotel" />
                        <div className="flex gap-4">
                            <SelectField label="Type" value={storeType} onChange={setStoreType} options={['hotel', 'grocery', 'pharmacy']} />
                            <InputField label="Rating" value={storeRating} onChange={setStoreRating} placeholder="4.5" type="number" />
                        </div>
                        <InputField label="Logo/Image URL" value={storeImage} onChange={setStoreImage} placeholder="https://..." />
                        <SelectField label="Main Category" value={storeCat} onChange={setStoreCat} options={['food', 'grocery', 'fruits', 'meat', 'medicine']} />
                    </FormCard>
                )}

                {activeTab === 'products' && (
                    <FormCard title="Add Menu Item & Pricing" onSubmit={handleAddProduct} loading={loading}>
                        <InputField label="Item Name" value={prodName} onChange={setProdName} placeholder="e.g. Veg Meals" />
                        <div className="flex gap-4">
                            <InputField label="Price (₹)" value={prodPrice} onChange={setProdPrice} placeholder="150" type="number" />
                            <SelectField label="Category" value={prodCategory} onChange={setProdCategory} options={['food', 'grocery', 'fruits', 'meat', 'medicine']} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Select Hotel/Shop</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors"
                                value={prodStoreId}
                                onChange={(e) => setProdStoreId(e.target.value)}
                            >
                                <option value="">Choose a store...</option>
                                {storesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <InputField label="Image URL" value={prodImage} onChange={setProdImage} placeholder="https://..." />
                    </FormCard>
                )}

                {activeTab === 'partners' && (
                    <FormCard title="Register Delivery Partner" onSubmit={handleAddPartner} loading={loading}>
                        <InputField label="Full Name" value={partnerName} onChange={setPartnerName} placeholder="e.g. Rajesh Kumar" />
                        <InputField label="Phone Number" value={partnerPhone} onChange={setPartnerPhone} placeholder="+91 98765 43210" />
                        <SelectField label="Vehicle" value={partnerVehicle} onChange={setPartnerVehicle} options={['Bike', 'Scooter', 'Cycle']} />
                    </FormCard>
                )}
            </div>
        </div>
    );
}

// Helper Components
function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap outline-none ${active ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`} />
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}

function FormCard({ title, children, onSubmit, loading }: any) {
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

function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <select
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-black focus:bg-white transition-all text-black"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
            </select>
        </div>
    );
}
