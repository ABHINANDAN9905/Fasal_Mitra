import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { MerchantProvider } from './context/MerchantContext';
import AuthModal from './components/auth/AuthModal';
import Home from './pages/Home';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MerchantProvider>
            <Home />
            <AuthModal />
          </MerchantProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;