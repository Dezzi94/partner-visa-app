import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
  email: string | null;
  uid: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

// Create a dummy context with no-op functions
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid
        });
        setIsAuthenticated(true);
      } else {
        // Check for demo user in localStorage
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          const userData = JSON.parse(demoUser);
          setUser({ ...userData, isDemo: true });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Check for demo account
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const demoUser = {
          email: DEMO_CREDENTIALS.email,
          uid: 'demo-user-id',
          isDemo: true
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        setUser(demoUser);
        setIsAuthenticated(true);
        return;
      }

      // Regular Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Set the user state after successful authentication
        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid
        });
        setIsAuthenticated(true);
      } catch (firebaseError: any) {
        // Handle Firebase Auth specific error codes
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            throw new Error('No account exists with this email. Please register first.');
          case 'auth/wrong-password':
            throw new Error('Incorrect password. Please try again.');
          case 'auth/invalid-email':
            throw new Error('Please enter a valid email address.');
          case 'auth/too-many-requests':
            throw new Error('Too many failed attempts. Please try again later.');
          case 'auth/user-disabled':
            throw new Error('This account has been disabled. Please contact support.');
          default:
            console.error('Firebase Auth Error:', firebaseError);
            throw new Error('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if it's a demo user
      if (user?.isDemo) {
        localStorage.removeItem('demoUser');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Regular Firebase logout
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      // Create the user in Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      try {
        // Create initial user document in Firestore
        const userDoc = {
          email: firebaseUser.email,
          createdAt: new Date().toISOString(),
          documents: [],
          progress: {
            documents: { required: 0, optional: 0 },
            forms: { completed: 0, total: 0 },
            timeline: { milestones: 0, recommended: 0 },
            interview: { completed: 0, total: 0 }
          }
        };

        // Try to create the Firestore document
        await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      } catch (firestoreError) {
        console.error('Error creating Firestore document:', firestoreError);
        // Continue even if Firestore fails - we can create the document later
      }

      // Update local state
      setUser({
        email: firebaseUser.email,
        uid: firebaseUser.uid
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 