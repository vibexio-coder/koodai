import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  getCurrentUser,
  getUserData,
  UserData as FirebaseUserData,
  storeRememberMe,
  getRememberedEmail
} from '../services/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';

interface UserContextType {
  user: FirebaseUser | null;
  userData: FirebaseUserData | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  rememberedEmail: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<FirebaseUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for remembered email
    const remembered = getRememberedEmail();
    if (remembered) {
      setRememberedEmail(remembered);
    }

    // Check for currently authenticated user
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Get additional user data from Firestore
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      storeRememberMe(email, rememberMe);
      setRememberedEmail(rememberMe ? email : null);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.name, data.phone);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setRememberedEmail(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userData, 
      login, 
      signup, 
      logout, 
      resetPassword,
      isLoading,
      rememberedEmail 
    }}>
      {children}
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