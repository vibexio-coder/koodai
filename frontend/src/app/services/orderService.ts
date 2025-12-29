import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export interface Order {
    id?: string;
    userId: string;
    items: any[];
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    createdAt: any;
    deliveryAddress: string;
}

export const orderService = {
    // Create a new order
    createOrder: async (userId: string, items: any[], total: number, address: string) => {
        try {
            const docRef = await addDoc(collection(db, 'orders'), {
                userId,
                items,
                total,
                status: 'pending',
                deliveryAddress: address,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    // Real-time subscription to User's orders
    subscribeToOrders: (userId: string, callback: (orders: Order[]) => void) => {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            callback(orders);
        });
    },

    // Update order status (for admin/driver demo)
    updateStatus: async (orderId: string, status: Order['status']) => {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
    }
};
