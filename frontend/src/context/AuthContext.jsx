import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fasal_mitra_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('fasal_mitra_token') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('fasal_mitra_user', JSON.stringify(user));
      localStorage.setItem('fasal_mitra_token', token);
    } else {
      localStorage.removeItem('fasal_mitra_user');
      localStorage.removeItem('fasal_mitra_token');
    }
  }, [user, token]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      let res;
      try {
        res = await authService.login(identifier, password);
      } catch (apiErr) {
        if (apiErr.response?.data?.message) {
          throw new Error(apiErr.response.data.message);
        }
        // Client-side fallback if backend is offline
        const mockUser = {
          id: `farmer-${Date.now()}`,
          name: identifier.includes('@') ? identifier.split('@')[0] : 'Kisan Farmer',
          phone: identifier,
          state: 'Maharashtra',
          district: 'Nashik',
          village: 'Niphad',
          preferredCrop: 'onion',
          role: 'Farmer',
          avatar: '👨‍🌾',
          createdAt: new Date().toISOString()
        };
        const mockToken = `local-token-${Date.now()}`;
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthModalOpen(false);
        return { success: true, user: mockUser };
      }

      if (res && res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      let res;
      try {
        res = await authService.signup(userData);
      } catch (apiErr) {
        if (apiErr.response?.data?.message) {
          throw new Error(apiErr.response.data.message);
        }
        // Resilient client-side fallback if backend server is not running
        const mockUser = {
          id: `farmer-${Date.now()}`,
          name: userData.name,
          phone: userData.phone,
          email: userData.email || `${userData.phone}@fasalmitra.in`,
          state: userData.state || 'Maharashtra',
          district: userData.district || 'Nashik',
          village: userData.village || '',
          preferredCrop: userData.preferredCrop || 'onion',
          role: 'Farmer',
          avatar: '👨‍🌾',
          createdAt: new Date().toISOString()
        };
        const mockToken = `local-token-${Date.now()}`;
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthModalOpen(false);
        return { success: true, user: mockUser };
      }

      if (res && res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (farmerId = 'farmer-1') => {
    setLoading(true);
    try {
      let res;
      try {
        res = await authService.demoLogin(farmerId);
      } catch (apiErr) {
        // Fallback demo profile
        const mockUser = {
          id: farmerId,
          name: farmerId === 'farmer-2' ? 'Sardar Balwinder Singh' : farmerId === 'farmer-3' ? 'Venkatesh Rao' : farmerId === 'farmer-4' ? 'Virender Yadav' : 'Ramesh Patil',
          phone: farmerId === 'farmer-2' ? '9123456780' : farmerId === 'farmer-3' ? '9988776655' : farmerId === 'farmer-4' ? '9811223344' : '9876543210',
          state: farmerId === 'farmer-2' ? 'Punjab' : farmerId === 'farmer-3' ? 'Karnataka' : farmerId === 'farmer-4' ? 'Haryana' : 'Maharashtra',
          district: farmerId === 'farmer-2' ? 'Khanna' : farmerId === 'farmer-3' ? 'Kolar' : farmerId === 'farmer-4' ? 'Gurugram' : 'Nashik',
          preferredCrop: farmerId === 'farmer-2' ? 'wheat' : farmerId === 'farmer-3' ? 'tomato' : farmerId === 'farmer-4' ? 'wheat' : 'onion',
          role: 'Farmer',
          avatar: farmerId === 'farmer-2' ? '🌾' : farmerId === 'farmer-3' ? '🍅' : farmerId === 'farmer-4' ? '🚜' : '👨‍🌾',
          createdAt: new Date().toISOString()
        };
        const mockToken = `demo-token-${Date.now()}`;
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthModalOpen(false);
        return { success: true, user: mockUser };
      }

      if (res && res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      await authService.logout(token);
    }
    setUser(null);
    setToken(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        signup,
        demoLogin,
        logout,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
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

export default AuthContext;
