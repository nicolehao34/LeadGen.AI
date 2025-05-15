import React from 'react';
import Header from '@/components/Header';
import APISettings from '@/components/settings/APISettings';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-800">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Settings</h1>
          <p className="text-neutral-600 mt-1">Manage application settings and API keys</p>
        </div>
        
        <APISettings />
      </main>
    </div>
  );
};

export default Settings;