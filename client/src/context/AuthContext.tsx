import React, { createContext, useContext, useState, useEffect } from 'react';
import { createApiClient, ENDPOINTS } from '../config/api.js';


interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'farmer';
  token: string | null;
  phoneNumber?: string;
  isPhoneVerified?: boolean;  // Add this line
  phoneVerifiedAt?: Date;     // Add this line
  location?: {
    latitude: number;
    longitude: number;
  };
  kyc?: {
    status: 'pending' | 'verified' | 'rejected';
    phoneVerified?: boolean;  // Add this line
    documents?: {
      aadhar?: string;
      pan?: string;
      selfie?: string;
    };
    verifiedAt?: Date;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void; // Add this line
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.phoneNumber) {
      localStorage.setItem('userPhoneNumber', userData.phoneNumber);
    }

    setToken(authToken);
    setUser(userData);
  };

 

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPhoneNumber');
    setUser(null);
    setToken(null);
 
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const apiClient = createApiClient(token);
        const response = await apiClient.get(ENDPOINTS.VERIFY_TOKEN);

        if (response.data.success) {
          setUser(response.data.user);

          if (response.data.user.phoneNumber) {
            localStorage.setItem('userPhoneNumber', response.data.user.phoneNumber);
          }
        } else {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const value = {
    user,
    token,
    login,
    logout,
    updateUser, // Add this line
    isAuthenticated: !!user && !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
