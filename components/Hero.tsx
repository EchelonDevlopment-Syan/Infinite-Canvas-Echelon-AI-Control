import React from 'react';
import { FOUNDER_NAME, FOUNDER_TITLE, FOUNDER_IMAGE_URL } from '../constants';

const Hero: React.FC = () => {
  return (
    <div id="vision" className="relative overflow-hidden pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#D4A373]/30 bg-[#D4A373]/10 text-[#D4A373] text-xs font-semibold tracking-wide uppercase mb-6">
            Architecting the Future
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl font-serif mb-6">
            <span className="block">Human In Control</span>
            <span className="block text-[#D4A373]">Business Automations</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            From everyday life to saving the world. We build proprietary AI systems that amplify human potential, not replace it.
          </p>
          
          <div className="mt-12 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-[#D4A373]/20 rounded-full blur-xl opacity-50"></div>
              <img 
                src={FOUNDER_IMAGE_URL} 
                alt={FOUNDER_NAME} 
                className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover mb-4"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{FOUNDER_NAME}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">{FOUNDER_TITLE}</p>
            <p className="text-sm text-gray-400 mt-1 italic">"Every Handshake Bridges the Gap between you, AI and new reality"</p>
          </div>
        </div>
      </div>
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
    </div>
  );
};

export default Hero;