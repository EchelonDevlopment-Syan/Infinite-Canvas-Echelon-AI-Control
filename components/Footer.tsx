import React from 'react';
import { COPYRIGHT_TEXT } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-[#D4A373] transform rotate-45"></div>
                <span className="font-serif font-bold tracking-wider">ECHELON AI</span>
             </div>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              {COPYRIGHT_TEXT}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;