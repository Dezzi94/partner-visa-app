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
  register: (email: string, password: string) => Promise<FirebaseUser>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => { throw new Error('Not implemented') },
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

  const login = async (email: string, password: string) => {
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
      await signInWithEmailAndPassword(auth, email, password);
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
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Starting registration in AuthContext...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;
      
      console.log('User created in Firebase Auth, creating Firestore document...');
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        createdAt: new Date().toISOString(),
        documents: [],
        progress: {
          documents: { required: 0, optional: 0 },
          forms: { completed: 0, total: 0 },
          timeline: { milestones: 0, recommended: 0 },
          interview: { completed: 0, total: 0 }
        }
      });
      
      console.log('Firestore document created successfully');
      
      // Set the user state immediately after successful registration
      setUser({
        email: firebaseUser.email,
        uid: firebaseUser.uid
      });
      setIsAuthenticated(true);
      
      return firebaseUser;
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
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