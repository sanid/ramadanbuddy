import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden crescent-bg pb-24">
      <main className="flex-1">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};
