import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { auth, db, database } from '../config/firebase';

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

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string): Promise<void> => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Initial user data
      const userData = {
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

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Create user data in Realtime Database
      await set(ref(database, `users/${firebaseUser.uid}`), userData);

      // Update local state
      setUser({
        email: firebaseUser.email,
        uid: firebaseUser.uid
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          throw new Error('This email is already registered. Please try logging in instead.');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled. Please contact support.');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Please use at least 6 characters.');
        default:
          throw new Error('Failed to create account. Please try again.');
      }
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
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

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser({
        email: firebaseUser.email,
        uid: firebaseUser.uid
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/user-not-found':
          throw new Error('No account exists with this email. Please register first.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password. Please try again.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later.');
        default:
          throw new Error('Failed to login. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      if (user?.isDemo) {
        localStorage.removeItem('demoUser');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 