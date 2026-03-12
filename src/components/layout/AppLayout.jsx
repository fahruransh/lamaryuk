import React from 'react';
import BottomNavigation from './BottomNavigation';
import SyncStatusBanner from '../common/SyncStatusBanner';
import InstallPwaPrompt from '../common/InstallPwaPrompt';

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-cute">
      {/* Top banners */}
      <div className="space-y-2 pt-2">
        <SyncStatusBanner />
        <InstallPwaPrompt />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom nav */}
      <BottomNavigation />
    </div>
  );
}
