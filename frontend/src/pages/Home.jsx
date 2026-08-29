import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from './Dashboard';

export const Home = () => {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

export default Home;