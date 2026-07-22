import React from 'react';
import HomeView from './views/HomeView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import NotFoundView from './views/NotFoundView';

export default function MainContent({ currentView, data, onDataUpdate }) {
  // Map view keys to their corresponding view components
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView data={data} onDataUpdate={onDataUpdate} />;
      case 'dashboard':
        return <DashboardView data={data} onDataUpdate={onDataUpdate} />;
      case 'settings':
        return <SettingsView data={data} onDataUpdate={onDataUpdate} />;
      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="w-full h-full transition-opacity duration-200 ease-in-out">
      {renderView()}
    </div>
  );
}