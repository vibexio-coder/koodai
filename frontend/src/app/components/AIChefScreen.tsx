import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChefHat, Sparkles, Plus, Minus, Trash2, Search, ListChecks, ShoppingBag, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateIngredients, getDishVarieties, Ingredient } from '../services/aiService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface AIChefScreenProps {
    onBack: () => void;
    onAddToCart: (items: any[]) => void;
}

export function AIChefScreen({ onBack, onAddToCart }: AIChefScreenProps) {
    const { t, language, setLanguage } = useLanguage();
    const [query, setQuery] = useState('');
    const [servings, setServings] = useState(4);
    const [loading, setLoading] = useState(false);
    const [varieties, setVarieties] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
    const [hasSearched, setHasSearched] = useState(false);
    const [activeDish, setActiveDish] = useState<string | null>(null);

    // Re-trigger search when language changes to translate content
    useEffect(() => {
        if (hasSearched && activeDish && !loading) {
            handleSearch(activeDish);
        }
    }, [language]);

    const handleSearch = async (overrideQuery?: string) => {
        const activeQuery = overrideQuery || query;
        if (!activeQuery.trim()) return;
        setLoading(true);
        setHasSearched(true);
        setIngredients([]);
        setVarieties([]);

        try {
            // Step 1: Check for varieties
            if (!overrideQuery) {
                const suggestedVarieties = await getDishVarieties(activeQuery, language);
                if (suggestedVarieties.length > 0) {
                    setVarieties(suggestedVarieties);
                    setLoading(false);
                    return;
                }
            }

            // Step 2: Generate ingredients and steps
            const results = await generateIngredients(activeQuery, servings, language);
            setIngredients(results.ingredients);
            setSteps(results.steps);
            setActiveTab('ingredients');
            setActiveDish(activeQuery);
        } catch (e: any) {
            console.error('Search error:', e);
            if (e.message === 'QUOTA_EXCEEDED' || e.message?.includes('429') || e.message?.includes('quota')) {
                toast.error(
                    language === 'ta'
                        ? 'கூகுள் AI பயன்பாட்டு வரம்பு முடிந்தது. 1 நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.'
                        : 'Google AI limit reached. Please wait 1 minute before trying again.'
                );
            } else if (e.message === 'API_KEY_MISSING') {
                toast.error('Chef is missing his tools (API Key).');
            } else {
                toast.error(language === 'ta' ? 'செஃப் பிஸியாக உள்ளார்! மீண்டும் முயற்சிக்கவும்.' : 'Chef is busy! Try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = (id: string, delta: number) => {
        setIngredients(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }));
    };

    const removeIngredient = (id: string) => {
        setIngredients(prev => prev.filter(item => item.id !== id));
    };

    const handleProceed = () => {
        if (ingredients.length === 0) return;
        // Map ingredients to cart format
        const cartItems = ingredients.map(ing => ({
            id: ing.id,
            name: ing.name,
            price: ing.price,
            quantity: ing.quantity,
            image: ing.image
        }));
        onAddToCart(cartItems);
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 pt-6 pb-12 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-colors hover:bg-white/30"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-6 h-6 text-white" />
                            <h1 className="text-xl font-bold text-white">{t('aiChefAssistant')}</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-all active:scale-95"
                    >
                        <Globe className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold text-white uppercase">
                            {language === 'en' ? 'தமிழ்' : 'EN'}
                        </span>
                    </button>
                </div>

                <p className="text-white/80 mb-6">
                    {t('chefGreeting')}
                </p>

                <div className="relative mb-6">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={t('chefPlaceholder')}
                        className="w-full pl-5 pr-12 py-4 bg-white rounded-2xl shadow-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                        onClick={() => handleSearch()}
                        className="absolute right-2 top-2 bottom-2 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <div className="text-white text-sm font-medium">{t('servingsLabel')}</div>
                        <div className="flex items-center gap-4 bg-white rounded-lg p-1">
                            <button
                                onClick={() => setServings(Math.max(1, servings - 1))}
                                className="w-8 h-8 flex items-center justify-center text-purple-600 font-bold hover:bg-purple-50 transition-colors rounded"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-black font-bold w-4 text-center">{servings}</span>
                            <button
                                onClick={() => setServings(Math.min(20, servings + 1))}
                                className="w-8 h-8 flex items-center justify-center text-purple-600 font-bold hover:bg-purple-50 transition-colors rounded"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!hasSearched && (
                        <div className="flex flex-wrap gap-2">
                            {(language === 'ta'
                                ? ['சிக்கன் பிரியாணி', 'மட்டன் பிரியாணி', 'பனீர் டிக்கா', 'மசாலா பாஸ்தா']
                                : ['Chicken Biryani', 'Mutton Biryani', 'Paneer Tikka', 'Masala Pasta']
                            ).map(dish => (
                                <button
                                    key={dish}
                                    onClick={() => {
                                        setQuery(dish);
                                        handleSearch(dish);
                                    }}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-xs py-2 px-4 rounded-full transition-all active:scale-95"
                                >
                                    {dish}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {varieties.length > 0 && !loading && (
                    <div className="mt-8 p-6 bg-purple-900/40 backdrop-blur-md rounded-2xl border border-purple-400/30 text-center animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-white font-bold text-lg mb-4">{t('varietyPrompt')}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {varieties.map(v => (
                                <button
                                    key={v}
                                    onClick={() => {
                                        setQuery(v);
                                        handleSearch(v);
                                    }}
                                    className="bg-white text-purple-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-purple-50 transition-all active:scale-95 text-sm"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-purple-600 font-medium animate-pulse">{t('analysingRecipe')}</p>
                    </div>
                ) : hasSearched && (ingredients.length > 0 || steps.length > 0) ? (
                    <div className="space-y-6">
                        {/* Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setActiveTab('ingredients')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-semibold text-sm ${activeTab === 'ingredients'
                                    ? 'bg-white text-purple-600 shadow-sm'
                                    : 'text-gray-500'
                                    }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {t('ingredientsTab')}
                            </button>
                            <button
                                onClick={() => setActiveTab('steps')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-semibold text-sm ${activeTab === 'steps'
                                    ? 'bg-white text-purple-600 shadow-sm'
                                    : 'text-gray-500'
                                    }`}
                            >
                                <ListChecks className="w-4 h-4" />
                                {t('preparationTab')}
                            </button>
                        </div>

                        {activeTab === 'ingredients' ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-black">{t('ingredientsNeeded')}</h2>
                                    <span className="text-sm text-gray-500">{ingredients.length} {t('items')}</span>
                                </div>

                                <div className="space-y-4">
                                    {ingredients.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-black">{item.name}</h3>
                                                        <p className="text-xs text-gray-500">₹{item.price} / {item.unit}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeIngredient(item.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-black">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3 text-black" />
                                                        </button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3 text-black" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleProceed}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl shadow-lg mt-4"
                                >
                                    {t('addAllToCart')}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : hasSearched ? (
                    <div className="text-center py-12 text-gray-500">
                        {t('noIngredientsFound')}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
