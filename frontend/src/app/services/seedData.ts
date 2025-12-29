import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export const categories = [
    { id: 'biryani', iconName: 'ShoppingBag', labelKey: 'biryani', color: 'from-orange-400 to-red-400', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
    { id: 'pizza', iconName: 'ShoppingBag', labelKey: 'pizza', color: 'from-amber-400 to-orange-400', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { id: 'burger', iconName: 'ShoppingBag', labelKey: 'burger', color: 'from-red-400 to-orange-400', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { id: 'south_indian', iconName: 'ShoppingBag', labelKey: 'south_indian', color: 'from-green-400 to-emerald-400', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
    { id: 'grocery', iconName: 'Store', labelKey: 'grocery', color: 'from-green-400 to-emerald-400', image: 'https://images.unsplash.com/photo-1623949786120-5cee72ef63f9?w=400' },
    { id: 'fruits', iconName: 'Apple', labelKey: 'fruits', color: 'from-lime-400 to-green-400', image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=400' },
    { id: 'meat', iconName: 'Beef', labelKey: 'meat', color: 'from-red-400 to-pink-400', image: 'https://images.unsplash.com/photo-1634932515818-7f9292c4e149?w=400' },
    { id: 'medicine', iconName: 'Pill', labelKey: 'medicine', color: 'from-blue-400 to-cyan-400', image: 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?w=400' },
];

export const stores = [
    { id: 's1', name: 'Thalappakatti Biryani', rating: 4.5, time: '25-30', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', categories: ['biryani'] },
    { id: 's2', name: 'Dominos Pizza', rating: 4.2, time: '30-35', distance: '2.5 km', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', categories: ['pizza'] },
    { id: 's3', name: 'Burger King', rating: 4.3, time: '20-25', distance: '1.8 km', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', categories: ['burger'] },
    { id: 's4', name: 'Saravana Bhavan', rating: 4.6, time: '15-20', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', categories: ['south_indian'] },
    { id: 's5', name: 'A2B Restaurants', rating: 4.4, time: '20-30', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', categories: ['south_indian'] },
    { id: 's6', name: 'Sukkubhai Biryani', rating: 4.7, time: '35-40', distance: '3.2 km', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', categories: ['biryani'] },
];

export const productsList = [
    { id: 'p1', name: 'Mutton Biryani', price: 420, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200', rating: 4.8, storeId: 's1', categoryId: 'biryani' },
    { id: 'p2', name: 'Chicken Biryani', price: 280, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200', rating: 4.5, storeId: 's1', categoryId: 'biryani' },
    { id: 'p3', name: 'Margherita Pizza', price: 199, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', rating: 4.2, storeId: 's2', categoryId: 'pizza' },
    { id: 'p4', name: 'Pepperoni Pizza', price: 349, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', rating: 4.4, storeId: 's2', categoryId: 'pizza' },
    { id: 'p5', name: 'Whopper Burger', price: 159, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', rating: 4.3, storeId: 's3', categoryId: 'burger' },
    { id: 'p6', name: 'Veg Burger', price: 99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', rating: 4.1, storeId: 's3', categoryId: 'burger' },
    { id: 'p7', name: 'Masala Dosa', price: 80, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200', rating: 4.6, storeId: 's4', categoryId: 'south_indian' },
    { id: 'p8', name: 'Idli Sambar', price: 60, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200', rating: 4.7, storeId: 's4', categoryId: 'south_indian' },
    { id: 'p9', name: 'Ghee Roast', price: 120, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200', rating: 4.5, storeId: 's5', categoryId: 'south_indian' },
];

async function withTimeout(promise: Promise<any>, ms: number) {
    let timeoutId: any;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`Timed out after ${ms}ms. Check your network or Firebase rules.`));
        }, ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function seedDatabase() {
    console.log('Seeding process started (Granular with Timeout)...');
    try {
        // 1. Categories
        for (const cat of categories) {
            console.log(`Setting category: ${cat.id}...`);
            await withTimeout(setDoc(doc(db, 'categories', cat.id), cat), 10000);
        }

        // 2. Stores
        for (const store of stores) {
            console.log(`Setting store: ${store.id}...`);
            await withTimeout(setDoc(doc(db, 'stores', store.id), store), 10000);
        }

        // 3. Products
        for (const prod of productsList) {
            console.log(`Setting product: ${prod.id}...`);
            await withTimeout(setDoc(doc(db, 'products', prod.id), prod), 10000);
        }

        console.log('Seeding successful!');
        return true;
    } catch (error: any) {
        console.error('Seeding error:', error.message);
        throw error;
    }
}
