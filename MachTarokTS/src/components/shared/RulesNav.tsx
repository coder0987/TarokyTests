import React, { useState } from 'react';

interface RulesNavProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
  dynamicTabs: string[];
}

const RulesNav: React.FC<RulesNavProps> = ({ activeTab, onTabClick, dynamicTabs }) => {
  const handleTabClick = (tabId: string) => {
    onTabClick(tabId);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden shadow-md">
        <ul className="flex justify-between md:flex-row md:space-x-4 space-x-2 p-4">
          {/* Fixed tabs */}
          <li className="nav-item">
            <a
              className={`nav-link tab-link cursor-pointer p-2 rounded-md transition-all ${
                activeTab === 'general' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'
              }`}
              onClick={() => handleTabClick('general')}
            >
              General
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link cursor-pointer p-2 rounded-md transition-all ${
                activeTab === 'order' ? 'bg-red-500 text-white' : 'text-red-500 hover:bg-red-100'
              }`}
              onClick={() => handleTabClick('order')}
            >
              Order
            </a>
          </li>

          {/* Dynamic tabs */}
          {dynamicTabs && dynamicTabs.map((tab) => (
            <li key={tab} className="nav-item">
              <a
                className={`nav-link tab-link cursor-pointer p-2 rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-green-500 text-white'
                    : 'text-green-500 hover:bg-green-100'
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default RulesNav;