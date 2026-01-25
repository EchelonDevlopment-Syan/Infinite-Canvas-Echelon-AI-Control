import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SlidePresentation from './components/SlidePresentation';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';
import PdfSalesArchitect from './components/PdfSalesArchitect';
import Footer from './components/Footer';
import { SLIDES } from './constants';
import { Slide } from './types';

function App() {
  const [currentSlides, setCurrentSlides] = useState<Slide[]>(SLIDES);

  const handleTakeover = (newSlides: Slide[]) => {
    setCurrentSlides(newSlides);
    // Scroll to presentation
    const el = document.getElementById('presentation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* PDF Architect Section - Call to Action */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <PdfSalesArchitect onTakeover={handleTakeover} />
        </div>

        <SlidePresentation initialSlides={currentSlides} />
        
        {/* Interactive Studio Section */}
        <section id="studio" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-[#D4A373] tracking-wide uppercase">AI Control Studio</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-serif">
              Engineering the Future
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Experience our proprietary bio-digital automation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Visual Reality Modulation</h3>
              <p className="text-gray-600 mb-6">
                Redefine visual assets instantly with our Nano-Banana neural engine.
              </p>
              <ImageEditor />
            </div>

            <div className="flex flex-col">
               <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Generative Media Synthesis</h3>
               <p className="text-gray-600 mb-6">
                 Construct high-fidelity video narratives from pure thought using Veo.
               </p>
               <VideoGenerator />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;