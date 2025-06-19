import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserType) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          // Clear user state and localStorage when signed out or token refresh fails
          setUser(null);
          localStorage.removeItem('user');
        }
      }
      
      if (event === 'SIGNED_IN' && session) {
        // Optionally handle successful sign in
        console.log('User signed in:', session.user);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      if (err instanceof Error) {
        try {
          // Parse the outer JSON structure
          const errorData = JSON.parse(err.message);
          
          // Check if there's a nested body that needs parsing
          if (errorData.body && typeof errorData.body === 'string') {
            try {
              // Parse the nested body JSON
              const bodyData = JSON.parse(errorData.body);
              if (bodyData.code === 'email_not_confirmed') {
                setError('Please check your email inbox and click the confirmation link to verify your email address before logging in.');
                return;
              }
              // Set error message from the body if available
              setError(bodyData.message || 'Login failed');
              return;
            } catch {
              // If body parsing fails, use the outer error message
              setError(errorData.message || 'Login failed');
              return;
            }
          }
          // If no body, use the outer error message
          setError(errorData.message || 'Login failed');
        } catch {
          // If JSON parsing fails completely, use the original error message
          setError(err.message || 'Login failed');
        }
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(name, email, password);
      // Registration successful - user profile will be created by database triggers
      // User will need to log in after email confirmation (if enabled)
      setError('Registration successful! Please check your email to confirm your account, then log in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};