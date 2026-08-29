import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';

export function App() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
}

export default App;