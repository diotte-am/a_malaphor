import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
// import { ThemeProvider } from './context/ThemeContext'; // Optional context provider

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [appData, setAppData] = useState({});

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation framing */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <MainContent 
          currentView={currentView} 
          data={appData} 
          onDataUpdate={setAppData} 
        />
      </main>

      {/* Persistent footer */}
      <Footer />
    </div>
  );
}