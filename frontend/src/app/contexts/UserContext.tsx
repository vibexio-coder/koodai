import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Custom mock user type since we aren't using Firebase
interface User {
    uid: string;
    phoneNumber: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    login: (phoneNumber: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for mock session
        const stored = localStorage.getItem('koodai_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = (phoneNumber: string) => {
        const mockUser: User = {
            uid: 'mock_' + phoneNumber,
            phoneNumber,
            displayName: 'Guest User',
            photoURL: null
        };
        setUser(mockUser);
        localStorage.setItem('koodai_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('koodai_user');
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
