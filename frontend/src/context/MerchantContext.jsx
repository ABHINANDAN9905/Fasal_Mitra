import React, { createContext, useContext, useState, useEffect } from 'react';
import * as merchantApi from '../services/merchantService';

const MerchantContext = createContext(null);
const STORAGE_KEY = 'fasal_mitra_merchant_user';

export const MerchantProvider = ({ children }) => {
  const [merchant, setMerchant] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, region = 'Gurugram, Haryana', pin = '123456') => {
    setLoading(true);
    try {
      const res = await merchantApi.loginMerchant(email, region, pin);
      if (res && res.success && res.merchant) {
        setMerchant(res.merchant);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.merchant));
        return res.merchant;
      }
      throw new Error(res?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setMerchant(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MerchantContext.Provider
      value={{
        merchant,
        isMerchantAuthenticated: !!merchant,
        login,
        logout,
        loading
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
};

export default MerchantContext;
