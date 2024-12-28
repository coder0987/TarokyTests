import React, { useState } from 'react';

interface RulesNavProps {
    activeTab: string;
    onTabClick: (tabId: string) => void;
}
  
const RulesNav: React.FC<RulesNavProps> = ({ activeTab, onTabClick }) => {
    const handleTabClick = (tabId: string) => {
        onTabClick(tabId);
    };

    return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden shadow-md">
        <ul className="flex justify-between md:flex-row md:space-x-4 space-x-2 p-4">
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'general' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('general')}
            >
              General
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'order' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('order')}
            >
              Order
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'pre-bid' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('pre-bid')}
            >
              Pre-Bid
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'bid' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('bid')}
            >
              Bid
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'play' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('play')}
            >
              Play
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link tab-link ${activeTab === 'end' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleTabClick('end')}
            >
              End
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default RulesNav;
