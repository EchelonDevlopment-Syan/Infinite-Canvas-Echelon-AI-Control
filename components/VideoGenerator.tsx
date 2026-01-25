import React, { useState, useEffect } from 'react';
import { generateMarketingVideo } from '../services/geminiService';
import { ProcessingState } from '../types';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Cleanup blob URLs when they are no longer needed
  useEffect(() => {
    return () => {
      if (videoUri) {
        URL.revokeObjectURL(videoUri);
      }
    };
  }, [videoUri]);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    setVideoUri(null);

    try {
      const uri = await generateMarketingVideo(prompt, aspectRatio);
      setVideoUri(uri);
      setStatus(ProcessingState.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setStatus(ProcessingState.ERROR);
      // Friendly error if it's the 404 entity not found usually associated with cancelling the key dialog
      if (e.message?.includes("Requested entity was not found")) {
        setErrorMsg("Key selection was cancelled or failed. Please try again.");
      } else {
        setErrorMsg(e.message || "Video generation failed.");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Veo Video Studio
        </h3>
        <p className="text-sm text-gray-500 mt-1">Powered by Veo 3.1. Create marketing clips from text.</p>
      </div>

      <div className="p-6 flex flex-col h-full">
        <div className="space-y-4 mb-6">
           <div>
              <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-700 mb-1">Concept</label>
              <textarea
                id="video-prompt"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#D4A373] focus:ring-[#D4A373] sm:text-sm p-3 border"
                rows={4}
                placeholder="A cinematic drone shot of a futuristic data center..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
           </div>

           <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Aspect Ratio:</span>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-[#D4A373]" name="ar" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} />
                <span className="ml-2 text-sm text-gray-600">Landscape (16:9)</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-[#D4A373]" name="ar" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} />
                <span className="ml-2 text-sm text-gray-600">Portrait (9:16)</span>
              </label>
           </div>

           <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              Note: Requires a paid Google Cloud Project API Key. You will be prompted to select one.
           </div>

           <button
              onClick={handleGenerate}
              disabled={status === ProcessingState.PROCESSING || !prompt}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${status === ProcessingState.PROCESSING ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D4A373] hover:bg-[#b0855a]'}`}
            >
              {status === ProcessingState.PROCESSING ? 'Generating Video (This takes time)...' : 'Generate Video'}
            </button>

            {status === ProcessingState.ERROR && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}
        </div>

        <div className="flex-grow bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[200px] relative">
            {videoUri ? (
              <video 
                src={videoUri} 
                controls 
                autoPlay 
                loop 
                className="max-h-full max-w-full"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p>Video Output</p>
              </div>
            )}
            
             {status === ProcessingState.PROCESSING && (
               <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                  <div className="w-8 h-8 border-4 border-[#D4A373] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="animate-pulse">Rendering pixels...</p>
               </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;