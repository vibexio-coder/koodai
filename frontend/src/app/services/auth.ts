import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// User data interface
export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  phone: string
): Promise<UserCredential> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Save additional user data to Firestore
      const userData: UserData = {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
    }

    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error(error.message || 'Signup failed');
    }
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('Account has been disabled');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || 'Logout failed');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error.message || 'Password reset failed');
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(error.message || 'Failed to get user data');
  }
};

// Store remember me preference
export const storeRememberMe = (email: string, remember: boolean) => {
  if (remember) {
    localStorage.setItem('rememberedEmail', email);
  } else {
    localStorage.removeItem('rememberedEmail');
  }
};

// Get remembered email
export const getRememberedEmail = (): string | null => {
  return localStorage.getItem('rememberedEmail');
};