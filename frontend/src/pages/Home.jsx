import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from './Dashboard';
import MerchantPortal from './MerchantPortal';

export const Home = () => {
  const [viewMode, setViewMode] = useState('farmer'); // 'farmer' | 'merchant'

  return (
    <DashboardLayout
      viewMode={viewMode}
      onToggleViewMode={(mode) => setViewMode(mode)}
    >
      {viewMode === 'merchant' ? (
        <MerchantPortal onSwitchToFarmerView={() => setViewMode('farmer')} />
      ) : (
        <Dashboard />
      )}
    </DashboardLayout>
  );
};

export default Home;