import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthUser {
  email: string | undefined | null;
  id: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check initial session
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      handleAuthChange(null, session);
    } catch (error) {
      console.error('Session check error:', error);
      handleAuthChange(null, null);
    }
  };

  const handleAuthChange = async (event: AuthChangeEvent | null, session: Session | null) => {
    if (session?.user) {
      setUser({
        email: session.user.email,
        id: session.user.id
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
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            email,
            created_at: new Date().toISOString(),
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (!data?.user) {
        throw new Error('Registration failed - no user data');
      }

      // After successful registration, user needs to verify email
      // The auth state will be handled by the onAuthStateChange listener
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const demoUser = {
          email: DEMO_CREDENTIALS.email,
          id: 'demo-user-id',
          isDemo: true
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        setUser(demoUser);
        setIsAuthenticated(true);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from login');
      }

      // Auth state will be handled by onAuthStateChange listener
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
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

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new Error('Logout failed');
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