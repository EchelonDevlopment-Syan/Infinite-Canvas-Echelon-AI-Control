import React, { useState, useRef, useEffect } from 'react';
import { Slide } from '../types';

interface SlideContentProps {
  slide: Slide;
  onImageUpload?: (base64: string) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, onImageUpload }) => {
  const uploadContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (slide.visualType === 'upload' && uploadContainerRef.current) {
      uploadContainerRef.current.focus();
    }
  }, [slide.visualType]);

  const handlePaste = (e: React.ClipboardEvent | ClipboardEvent) => {
    // Determine if we should handle this paste event
    const isUploadSlide = slide.visualType === 'upload';
    if (!isUploadSlide || !onImageUpload) return;
    
    const clipboardData = (e as React.ClipboardEvent).clipboardData || (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              onImageUpload(event.target.result as string);
            }
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onImageUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (slide.visualType === 'image' && slide.imageUrl) {
    return (
      <div className="h-full w-full bg-black rounded-lg overflow-hidden flex items-center justify-center relative shadow-xl border border-gray-200">
         <img 
           src={slide.imageUrl} 
           alt={slide.title} 
           className="max-w-full max-h-full object-contain" 
         />
         <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 backdrop-blur-sm">
           <h2 className="text-xl font-serif font-bold">{slide.title}</h2>
         </div>
      </div>
    );
  }

  if (slide.visualType === 'upload') {
    return (
      <div 
        ref={uploadContainerRef}
        className="h-full w-full bg-white/80 backdrop-blur-md rounded-lg border-4 border-dashed border-[#D4A373]/40 flex flex-col items-center justify-center p-8 outline-none focus:border-[#D4A373] transition-all cursor-pointer group hover:bg-white"
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
      >
        <div className="w-20 h-20 bg-[#D4A373]/10 rounded-full flex items-center justify-center mb-6 text-[#D4A373] group-hover:scale-110 transition-transform">
           <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
           </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Sync Copied Deck Page</h3>
        <p className="text-gray-500 text-center max-w-sm mb-8">
          Copy a slide from any tool and press <span className="font-mono bg-gray-900 text-white px-2 py-0.5 rounded text-sm">Ctrl+V</span> here to integrate it into the Infinite Canvas.
        </p>
        <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium shadow-sm hover:bg-[#D4A373] transition-colors">
          Browse Files
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center p-8 md:p-16 border border-gray-200 bg-white shadow-xl rounded-lg relative overflow-hidden transition-all duration-500">
       {slide.visualType === 'network' && (
         <svg className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="80" cy="20" r="2" fill="#2F3E46"/>
            <circle cx="60" cy="50" r="2" fill="#2F3E46"/>
            <circle cx="90" cy="60" r="2" fill="#2F3E46"/>
            <path d="M80 20 L60 50 L90 60 L80 20" stroke="#2F3E46" strokeWidth="0.5" fill="none"/>
         </svg>
       )}
       {(slide.visualType === 'grid' || slide.visualType === 'comparison') && (
         <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
       )}

      <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
        {slide.title}
      </h2>
      
      {slide.subtitle && (
        <p className="text-lg text-gray-600 mb-8 italic border-l-4 border-[#D4A373] pl-4">
          {slide.subtitle}
        </p>
      )}

      <div className="space-y-4">
        {slide.content.map((point, idx) => (
          <div key={idx} className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373] mr-3 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-lg text-gray-700">{point}</p>
          </div>
        ))}
      </div>

      {slide.visualType === 'apps' && (
        <div className="mt-8 grid grid-cols-2 gap-4">
           {['Figma', 'Miro', 'Milanote', 'Obsidian'].map(app => (
             <div key={app} className="bg-gray-50 p-3 rounded text-center text-sm font-semibold text-gray-600 border border-gray-200">
               {app}
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

interface SlidePresentationProps {
  initialSlides: Slide[];
}

const SlidePresentation: React.FC<SlidePresentationProps> = ({ initialSlides }) => {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setSlides(initialSlides);
    setCurrentIndex(0);
  }, [initialSlides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAddSlide = () => {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
    const newSlide: Slide = {
      id: newId,
      title: 'New Spatial Node',
      content: [],
      visualType: 'upload'
    };
    setSlides([...slides, newSlide]);
    setCurrentIndex(slides.length);
  };

  const handleImageUpdate = (base64: string) => {
    setSlides(prevSlides => prevSlides.map((s, idx) => {
      if (idx === currentIndex) {
        return {
          ...s,
          visualType: 'image',
          imageUrl: base64,
          title: 'Integrated Canvas Object'
        };
      }
      return s;
    }));
  };

  return (
    <div id="presentation" className="py-24 bg-[#E5E5E5]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-[#D4A373] tracking-wide uppercase">The Vision</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-serif">
            The Infinite Canvas
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Explore the shift from static pages to spatial environments.
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto group/pres">
          <SlideContent 
            slide={slides[currentIndex]} 
            onImageUpload={handleImageUpdate}
          />
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#D4A373] hover:scale-110 transition-all z-10 opacity-0 group-hover/pres:opacity-100"
            aria-label="Previous Slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#D4A373] hover:scale-110 transition-all z-10 opacity-0 group-hover/pres:opacity-100"
            aria-label="Next Slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center space-x-2 mb-6 flex-wrap gap-y-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#D4A373]' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
                title={s.title}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={handleAddSlide}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-black transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Paste New Slide Page</span>
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest font-bold">Spatial Navigation Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default SlidePresentation;