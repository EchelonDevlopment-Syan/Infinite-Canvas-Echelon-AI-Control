import React, { useState, useRef } from 'react';
import { processPdfToSlides } from '../services/geminiService';
import { Slide, ProcessingState } from '../types';

interface PdfSalesArchitectProps {
  onTakeover: (newSlides: Slide[]) => void;
}

const PdfSalesArchitect: React.FC<PdfSalesArchitectProps> = ({ onTakeover }) => {
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressText, setProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }

    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    setProgressText("Reading NotebookLM deck data...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        setProgressText("Gemini Architect is analyzing the spatial logic...");
        const newSlides = await processPdfToSlides(base64);
        
        setProgressText("Synthesizing Echelon Sales Narrative...");
        setTimeout(() => {
          onTakeover(newSlides);
          setStatus(ProcessingState.SUCCESS);
        }, 1500);
      } catch (err: any) {
        setStatus(ProcessingState.ERROR);
        setErrorMsg(err.message || "Failed to architect your slides.");
      }
    };
    reader.onerror = () => {
      setStatus(ProcessingState.ERROR);
      setErrorMsg("Error reading file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#D4A373]/30 overflow-hidden relative group">
      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-[#D4A373]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
           <svg className="w-10 h-10 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">AI Sales Architect</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Upload a NotebookLM PDF or research deck. Gemini will automatically "take over" the canvas and construct a spatial sales narrative.
        </p>

        {status === ProcessingState.PROCESSING ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <p className="text-[#D4A373] font-medium text-sm tracking-wide uppercase animate-pulse">{progressText}</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-[#D4A373] transition-all transform hover:-translate-y-1 shadow-md"
            >
              Upload PDF Deck
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileUpload}
            />
          </>
        )}

        {status === ProcessingState.ERROR && (
          <p className="text-red-500 text-sm mt-4">{errorMsg}</p>
        )}
        
        {status === ProcessingState.SUCCESS && (
          <div className="mt-4 flex items-center justify-center text-green-600 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Canvas Synchronized
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4A373]/20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4A373]/20"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4A373]/20"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4A373]/20"></div>
    </div>
  );
};

export default PdfSalesArchitect;