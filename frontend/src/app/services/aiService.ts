import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    image: string;
}

export interface RecipeResult {
    ingredients: Ingredient[];
    steps: string[];
}

// Internal testing helper (no longer used as automatic fallback)
export async function generateWithMock(query: string, servings: number = 4, language: string = 'en'): Promise<RecipeResult> {
    const scale = servings / 4;
    const lang: 'en' | 'ta' = language === 'ta' ? 'ta' : 'en';
    const db: any = {
        'biryani': {
            en: {
                ingredients: [
                    { id: 'i1', name: 'Basmati Rice', quantity: 1, unit: 'kg', price: 120, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
                    { id: 'i2', name: 'Chicken', quantity: 1, unit: 'kg', price: 280, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200' }
                ],
                steps: ["Wash rice.", "Cook meat."]
            },
            ta: {
                ingredients: [
                    { id: 'i1', name: 'பாசுமதி அரிசி', quantity: 1, unit: 'kg', price: 120, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
                    { id: 'i2', name: 'கோழி இறைச்சி', quantity: 1, unit: 'kg', price: 280, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200' }
                ],
                steps: ["அரிசியை கழுவவும்.", "இறைச்சியை சமைக்கவும்."]
            }
        }
    };
    return new Promise((resolve) => {
        setTimeout(() => {
            const baseData = db['biryani'][lang];
            const scaledIngredients = baseData.ingredients.map((item: any) => ({
                ...item,
                quantity: Number((item.quantity * scale).toFixed(2)),
                price: Math.round(item.price * scale)
            }));
            resolve({ ingredients: scaledIngredients, steps: baseData.steps });
        }, 500);
    });
}

// Refinement of model names based on standard aliases
const AI_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
];

export async function getDishVarieties(query: string, language: string = 'en'): Promise<string[]> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('API_KEY_MISSING');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        let responseText = "";
        let errorDetails = "";

        const langName = language === 'ta' ? 'Tamil' : 'English';
        const prompt = `
            The user searched for: "${query}".
            Output Language: ${langName}.
            Is this a broad dish category? (e.g. "Cake", "Burger", "Noodles") 
            If YES, return a JSON array of 4 popular specific varieties in ${langName}.
            CRITICAL: No meat in Veg varieties. No Chicken in Mutton varieties.
            If NO, return an empty array [].
            Return ONLY the JSON array.
        `;

        for (const modelName of AI_MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                responseText = result.response.text();
                if (responseText) break;
            } catch (err: any) {
                console.warn(`AI model ${modelName} failed in Varieties check.`, err);
                errorDetails = err.message || String(err);
                if (err.message?.includes('429')) throw new Error('QUOTA_EXCEEDED');
            }
        }

        if (!responseText) throw new Error(errorDetails.includes('429') ? 'QUOTA_EXCEEDED' : 'AI_MODELS_FAILED');

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const data = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
        return Array.isArray(data) ? data : [];
    } catch (e: any) {
        console.error('getDishVarieties global catch:', e);
        throw e;
    }
}

export async function generateIngredients(query: string, servings: number = 4, language: string = 'en'): Promise<RecipeResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('API_KEY_MISSING');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        let responseText = "";
        let errorDetails = "";

        const langName = language === 'ta' ? 'Tamil' : 'English';
        const prompt = `
            You are a professional chef.
            Query: "${query}".
            Required Language: ${langName}.
            Servings: ${servings}.
            
            CRITICAL REQUIREMENTS:
            1. All names and steps MUST be in ${langName}.
            2. Strictly follow dietary keywords (Veg = No Meat, Mutton = Mutton ONLY, Chicken = Chicken ONLY).
            3. Return a JSON object with "ingredients" (name, quantity, unit, price) and "steps" (string array).
            4. Use total price in INR. Scale for ${servings} people.
            5. Return ONLY JSON. No explanations.
        `;

        for (const modelName of AI_MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                responseText = result.response.text();
                if (responseText) break;
            } catch (err: any) {
                console.warn(`AI model ${modelName} failed in Ingredients generation.`, err);
                errorDetails = err.message || String(err);
                if (err.message?.includes('429')) throw new Error('QUOTA_EXCEEDED');
            }
        }

        if (!responseText) throw new Error(errorDetails.includes('429') ? 'QUOTA_EXCEEDED' : 'AI_MODELS_FAILED');

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const data = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        const ingredients = (data.ingredients || []).map((item: any, index: number) => ({
            id: `gen_${Date.now()}_${index}`,
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || 'pcs',
            price: item.price || 0,
            image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200`
        }));

        return { ingredients, steps: data.steps || [] };
    } catch (error: any) {
        console.error('generateIngredients global catch:', error);
        throw error;
    }
}
