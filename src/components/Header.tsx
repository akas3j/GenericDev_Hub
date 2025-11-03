import { FlaskConical } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'processes', label: 'Development Processes' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'regulatory', label: 'Regulatory Resources' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Made by section */}
      <div className="bg-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">Made by - Akash Joshi</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">GenericDev Hub</h1>
              <p className="text-xs text-gray-500">Generic Drug Development Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
