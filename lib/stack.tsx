// Simple mock auth context interacting with local backend
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

// User type
interface User {
  id: string;
  email: string;
  displayName: string | null;
  clientMetadata: Record<string, any>;
  signOut: () => Promise<void>;
  update: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
}

const AuthContext = createContext<{
  user: User | null;
  signIn: (credentials: any) => Promise<void>;
  signUp: (credentials: any) => Promise<{ status: string; error?: { message: string } }>;
  signOut: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
} | null>(null);

export const useUser = () => {
  const context = useContext(AuthContext);
  return context?.user ?? null;
};

export const useStackApp = () => {
  const context = useContext(AuthContext);
  // Allow useStackApp to work even if context is missing (returns stub) 
  // or fix the provider wrapping. Since we wrap in main.tsx, this should be fine.
  // The error "AuthContext not found" implies usage outside provider or provider not mounting.
  if (!context) {
      console.warn('AuthContext not found, returning stub');
      return {
        signInWithCredential: async () => {},
        signUpWithCredential: async () => ({ status: 'error', error: { message: 'Auth context missing' } }),
        getUser: async () => null,
      };
  }
  
  return {
    signInWithCredential: context.signIn,
    signUpWithCredential: context.signUp,
    getUser: async () => context.user,
  };
};

export const StackProvider = ({ children, app }: any) => {
  const [user, setUser] = useState<User | null>(null);

  // Disable auto-login to force user to login on refresh/restart
  // useEffect(() => {
  //   // Check local storage for persisted user
  //   const savedUser = localStorage.getItem('mock_user');
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);

  const signIn = async ({ email, password }: any) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      const userData = data.user;
      
      // Normalize user data from DB to match frontend expectations
      const userObj = {
        id: userData.id,
        email: userData.email,
        // Use DB first/last name if available, fallback to metadata, fallback to empty
        displayName: (userData.first_name && userData.last_name) 
            ? `${userData.first_name} ${userData.last_name}`
            : (userData.metadata?.displayName || ''),
        clientMetadata: {
            ...userData.metadata,
            firstName: userData.first_name || userData.metadata?.firstName,
            lastName: userData.last_name || userData.metadata?.lastName
        },
        // Helper methods that need to be re-attached on load usually, 
        // but here we define them in context so we just store data in state
        signOut: async () => {
            setUser(null);
            localStorage.removeItem('mock_user');
        },
        update: async (updateData: any) => {
            await updateUser(updateData);
        }
      };

      setUser(userObj);
      localStorage.setItem('mock_user', JSON.stringify(userObj));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const signUp = async ({ email, password, metadata }: any) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, metadata }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error && error.error.includes('exists')) {
           return { status: 'error', error: { message: 'An account with this email already exists' } };
        }
        throw new Error(error.error || 'Registration failed');
      }
      
      return { status: 'success' };
    } catch (err: any) {
      return { status: 'error', error: { message: err.message } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  const updateUser = async (data: any) => {
      if (user) {
          try {
              const response = await fetch(`${API_URL}/user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, data }),
              });

              if (!response.ok) throw new Error('Failed to update user');

              // Update local state
              const updatedUser = { ...user, ...data, clientMetadata: { ...user.clientMetadata, ...data.clientMetadata } };
              setUser(updatedUser);
              localStorage.setItem('mock_user', JSON.stringify(updatedUser));
          } catch (err) {
              console.error('Update user error:', err);
          }
      }
  }

  const changePassword = async ({ currentPassword, newPassword }: any) => {
    if (user) {
        try {
            const response = await fetch(`${API_URL}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, currentPassword, newPassword }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to change password');
            }
        } catch (err) {
            console.error('Change password error:', err);
            throw err;
        }
    }
  };

  const value = {
    user: user ? { ...user, signOut, update: updateUser, changePassword } : null,
    signIn,
    signUp,
    signOut,
    updateUser,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock stackAuth object to satisfy main.tsx import
export const stackAuth = {};
