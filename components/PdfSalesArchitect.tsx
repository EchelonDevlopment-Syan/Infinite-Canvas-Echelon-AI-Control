import React, { useState, useRef } from 'react';
import { processPdfToSlides, generateVideoPromptFromDeck, generateVideoPromptFromSingleSlide, generateMarketingVideo } from '../services/geminiService';
import { Slide, ProcessingState } from '../types';

interface PdfSalesArchitectProps {
  onTakeover: (newSlides: Slide[]) => void;
  onVideoGenerated: (uri: string) => void;
}

type VideoGenerationMode = 'deck' | 'slide';

const PdfSalesArchitect: React.FC<PdfSalesArchitectProps> = ({ onTakeover, onVideoGenerated }) => {
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressText, setProgressText] = useState('');
  const [lastGeneratedSlides, setLastGeneratedSlides] = useState<Slide[] | null>(null);
  
  // New State for Video Mode Selection
  const [videoMode, setVideoMode] = useState<VideoGenerationMode>('deck');
  const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Type
    if (file.type !== 'application/pdf') {
      setStatus(ProcessingState.ERROR);
      setErrorMsg("Unsupported format. Please upload a valid PDF file.");
      return;
    }

    // 2. Validate File Size (Limit to 10MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus(ProcessingState.ERROR);
      setErrorMsg(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a PDF smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    setProgressText("Initializing Neural PDF Ingestion...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setProgressText("Gemini 3 Pro: Synthesizing Narrative...");
        const result = event.target?.result as string;
        
        if (!result) throw new Error("File read error: Empty data.");

        const slides = await processPdfToSlides(result);
        
        setProgressText("Validating Spatial Integrity...");
        
        setLastGeneratedSlides(slides);
        if (slides.length > 0) setSelectedSlideId(slides[0].id);
        
        onTakeover(slides);
        setStatus(ProcessingState.SUCCESS);
      } catch (err: any) {
        console.error("Architect Error:", err);
        setStatus(ProcessingState.ERROR);
        
        // Detailed Error Mapping
        let customMsg = "An unexpected error occurred during synthesis.";
        if (err.message) {
            const msg = err.message.toLowerCase();
            if (msg.includes("password")) {
                customMsg = "PDF is password protected. Please remove protection and try again.";
            } else if (msg.includes("empty response") || msg.includes("no content")) {
                customMsg = "The AI returned no content. The PDF might be empty or scanned images without text.";
            } else if (msg.includes("token") || msg.includes("too large") || msg.includes("payload")) {
                customMsg = "Document complexity exceeded. Try a shorter PDF.";
            } else if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed to fetch")) {
                customMsg = "Network connection failed. Please check your internet.";
            } else if (msg.includes("429") || msg.includes("quota")) {
                customMsg = "AI Usage Limit Exceeded. Please try again in a few moments.";
            } else if (msg.includes("400")) {
                customMsg = "Bad Request. The PDF data might be corrupted.";
            } else {
                customMsg = err.message;
            }
        }
        setErrorMsg(customMsg);
      }
    };
    reader.onerror = () => {
      setStatus(ProcessingState.ERROR);
      setErrorMsg("Browser failed to read the file. Please check file permissions.");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateVideo = async () => {
    if (!lastGeneratedSlides) return;
    setStatus(ProcessingState.PROCESSING);
    
    try {
      let prompt = "";
      
      if (videoMode === 'deck') {
        setProgressText("Synthesizing Video from Full Deck Context...");
        prompt = await generateVideoPromptFromDeck(lastGeneratedSlides);
      } else {
        // Individual Slide Mode
        const slide = lastGeneratedSlides.find(s => s.id === selectedSlideId);
        if (!slide) throw new Error("Selected slide not found.");
        
        setProgressText(`Synthesizing Video from Slide ${slide.id}: "${slide.title.substring(0, 20)}..."`);
        prompt = await generateVideoPromptFromSingleSlide(slide);
      }

      // Default to standard duration (High Res) for automated flow to ensure success
      const videoUri = await generateMarketingVideo(prompt, '16:9', false);
      onVideoGenerated(videoUri);
      setStatus(ProcessingState.SUCCESS);
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      setStatus(ProcessingState.ERROR);
      setErrorMsg(err.message || "Video synthesis encountered a neural block.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border-b-4 border-[#D4A373] overflow-hidden relative">
      <div className="p-8 text-center">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Echelon Sales Architect</h3>
        
        {status === ProcessingState.PROCESSING ? (
          <div className="py-8">
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-[#D4A373] font-medium animate-pulse uppercase text-sm tracking-widest">{progressText}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-500 max-w-sm mx-auto">
              Transform any NotebookLM export or research deck into a spatial Echelon sales experience.
            </p>
            
            {/* Upload Button */}
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={() => {
                  setStatus(ProcessingState.IDLE); // Reset state to hide options if re-uploading
                  setErrorMsg('');
                  setLastGeneratedSlides(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  fileInputRef.current?.click();
                }}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all shadow-md active:scale-95"
              >
                {lastGeneratedSlides ? 'Upload New Deck' : 'Upload PDF Deck'}
              </button>
              
              {/* Post-Processing Options */}
              {status === ProcessingState.SUCCESS && lastGeneratedSlides && (
                <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 animate-in fade-in slide-in-from-top-4">
                  <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest mb-3">Video Synthesis Options</h4>
                  
                  <div className="flex rounded-lg bg-gray-200 p-1 mb-4">
                    <button
                      onClick={() => setVideoMode('deck')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${videoMode === 'deck' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                      Full Deck Summary
                    </button>
                    <button
                      onClick={() => setVideoMode('slide')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${videoMode === 'slide' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                      Single Slide
                    </button>
                  </div>

                  {videoMode === 'slide' && (
                    <div className="mb-4">
                      <select 
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-[#D4A373] focus:ring-[#D4A373]"
                        value={selectedSlideId || ''}
                        onChange={(e) => setSelectedSlideId(Number(e.target.value))}
                      >
                        {lastGeneratedSlides.map(slide => (
                          <option key={slide.id} value={slide.id}>
                            {slide.id}. {slide.title.substring(0, 40)}{slide.title.length > 40 ? '...' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleCreateVideo}
                    className="w-full px-8 py-3 bg-[#D4A373] text-white rounded-full font-bold hover:bg-[#b0855a] transition-all shadow-lg animate-pulse"
                  >
                    Generate {videoMode === 'deck' ? 'Full Experience' : 'Slide'} Video
                  </button>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
          </div>
        )}

        {status === ProcessingState.ERROR && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 text-left">
            <div className="flex items-center mb-1">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">Architectural Fault</span>
            </div>
            {errorMsg}
            <button 
              onClick={() => {
                setStatus(ProcessingState.IDLE);
                setErrorMsg('');
              }} 
              className="mt-2 block text-red-600 font-bold hover:underline"
            >
              Reset and Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSalesArchitect;