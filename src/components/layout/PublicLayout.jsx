import React from 'react';
import { Outlet } from 'react-router-dom';
import { LandingNavbar } from '../landing/LandingNavbar';
import { LandingFooter } from '../landing/LandingFooter';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children || <Outlet />}
      </main>
      <LandingFooter />
    </div>
  );
};

export default PublicLayout;
