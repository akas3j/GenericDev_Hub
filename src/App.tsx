import { useState } from 'react';
import { Header } from './components/Header';
import { DevelopmentProcesses } from './components/DevelopmentProcesses';
import { TroubleshootingGuides } from './components/TroubleshootingGuides';
import { RegulatoryResources } from './components/RegulatoryResources';

function App() {
  const [activeTab, setActiveTab] = useState('processes');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'processes' && <DevelopmentProcesses />}
        {activeTab === 'troubleshooting' && <TroubleshootingGuides />}
        {activeTab === 'regulatory' && <RegulatoryResources />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            GenericDev Hub - Your comprehensive resource for generic drug development Made By :- Akash Joshi
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
