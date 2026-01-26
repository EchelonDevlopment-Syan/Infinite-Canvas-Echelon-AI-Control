import React, { useState, useRef } from 'react';
import { processPdfToSlides, generateVideoPromptFromDeck, generateMarketingVideo } from '../services/geminiService';
import { Slide, ProcessingState } from '../types';

interface PdfSalesArchitectProps {
  onTakeover: (newSlides: Slide[]) => void;
  onVideoGenerated: (uri: string) => void;
}

const PdfSalesArchitect: React.FC<PdfSalesArchitectProps> = ({ onTakeover, onVideoGenerated }) => {
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressText, setProgressText] = useState('');
  const [lastGeneratedSlides, setLastGeneratedSlides] = useState<Slide[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg("Please upload a PDF file.");
      return;
    }

    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    setProgressText("Initializing Neural PDF Ingestion...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setProgressText("Gemini 3 Pro: Synthesizing Narrative...");
        const slides = await processPdfToSlides(event.target?.result as string);
        
        setProgressText("Validating Spatial Integrity...");
        
        setLastGeneratedSlides(slides);
        onTakeover(slides);
        setStatus(ProcessingState.SUCCESS);
      } catch (err: any) {
        console.error("Architect Error:", err);
        setStatus(ProcessingState.ERROR);
        setErrorMsg(err.message || "An unexpected error occurred during synthesis.");
      }
    };
    reader.onerror = () => {
      setStatus(ProcessingState.ERROR);
      setErrorMsg("File reading failed.");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateVideo = async () => {
    if (!lastGeneratedSlides) return;
    setStatus(ProcessingState.PROCESSING);
    setProgressText("Encoding Founder Video Context...");
    try {
      const prompt = await generateVideoPromptFromDeck(lastGeneratedSlides);
      setProgressText("Synthesizing Veo High-Fidelity Media...");
      const videoUri = await generateMarketingVideo(prompt);
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setErrorMsg('');
                  fileInputRef.current?.click();
                }}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all shadow-md active:scale-95"
              >
                Upload PDF Deck
              </button>
              
              {status === ProcessingState.SUCCESS && lastGeneratedSlides && (
                <button
                  onClick={handleCreateVideo}
                  className="px-8 py-3 bg-[#D4A373] text-white rounded-full font-bold hover:bg-[#b0855a] transition-all shadow-lg animate-pulse"
                >
                  Create Founder Video
                </button>
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
              onClick={() => setStatus(ProcessingState.IDLE)} 
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