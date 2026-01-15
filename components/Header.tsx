import React from 'react';
import { COMPANY_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FDFBF7]/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#D4A373] transform rotate-45"></div>
            </div>
            <h1 className="text-xl font-serif font-bold text-gray-900 tracking-tight">
              {COMPANY_NAME}
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#vision" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Vision</a>
            <a href="#presentation" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Infinite Canvas</a>
            <a href="#studio" className="text-[#D4A373] hover:text-[#b0855a] px-3 py-2 text-sm font-bold">AI Studio</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;