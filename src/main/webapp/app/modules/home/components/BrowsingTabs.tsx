import { Laptop, Home } from 'lucide-react';
import React from 'react';

const tabs = [
  { id: 'electronics', label: 'Đồ điện tử', subtitle: null, icon: Laptop },
  { id: 'home', label: 'Đồ gia dụng', subtitle: null, icon: Home },
];

interface BrowsingTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BrowsingTabs({ activeTab, onTabChange }: BrowsingTabsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
      <div className="flex items-center gap-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
