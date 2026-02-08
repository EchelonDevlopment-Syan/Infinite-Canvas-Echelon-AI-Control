import React, { useState, useEffect } from 'react';
import { generateMarketingVideo } from '../services/geminiService';
import { ProcessingState } from '../types';

interface VideoGeneratorProps {
  externalVideoUri?: string | null;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ externalVideoUri }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [useExtendedDuration, setUseExtendedDuration] = useState(false);

  useEffect(() => {
    if (externalVideoUri) {
      setVideoUri(externalVideoUri);
      setStatus(ProcessingState.SUCCESS);
    }
  }, [externalVideoUri]);

  useEffect(() => {
    return () => {
      if (videoUri && videoUri.startsWith('blob:')) {
        URL.revokeObjectURL(videoUri);
      }
    };
  }, [videoUri]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    try {
      // Pass the extended duration flag
      const uri = await generateMarketingVideo(prompt, aspectRatio, useExtendedDuration);
      setVideoUri(uri);
      setStatus(ProcessingState.SUCCESS);
    } catch (e: any) {
      setStatus(ProcessingState.ERROR);
      setErrorMsg(e.message || "Generation failed.");
    }
  };

  const handleDownload = () => {
    if (!videoUri) return;
    const a = document.createElement('a');
    a.href = videoUri;
    a.download = `echelon-vision-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Veo Video Studio</h3>
        <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-500">FORMAT</span>
            <button 
                onClick={() => setAspectRatio('16:9')}
                className={`text-xs px-2 py-1 rounded ${aspectRatio === '16:9' ? 'bg-[#D4A373] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
                16:9
            </button>
            <button 
                onClick={() => setAspectRatio('9:16')}
                className={`text-xs px-2 py-1 rounded ${aspectRatio === '9:16' ? 'bg-[#D4A373] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
                9:16
            </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <textarea
          className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-400 mb-4 p-3 border focus:border-[#D4A373] focus:ring-[#D4A373]"
          rows={3}
          placeholder="Concept for Founder-led marketing video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Duration / Quality Toggle */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
           <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">Video Duration</span>
              <span className="text-xs text-gray-500">
                 {useExtendedDuration ? 'Extension Mode (~13s, 720p)' : 'Standard Mode (~6s, 1080p)'}
              </span>
           </div>
           <button
             onClick={() => setUseExtendedDuration(!useExtendedDuration)}
             className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useExtendedDuration ? 'bg-[#D4A373]' : 'bg-gray-300'}`}
           >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useExtendedDuration ? 'translate-x-5' : 'translate-x-0'}`} />
           </button>
        </div>

        <button
          onClick={handleGenerate}
          disabled={status === ProcessingState.PROCESSING}
          className="w-full py-3 bg-[#D4A373] text-white rounded-md font-bold mb-6 hover:bg-[#b0855a] transition-colors disabled:opacity-50"
        >
          {status === ProcessingState.PROCESSING ? 'Proofreading & Rendering...' : 'Generate New Clip'}
        </button>

        <div className="flex-grow bg-black rounded-lg flex items-center justify-center min-h-[300px] relative overflow-hidden group">
          {videoUri ? (
            <>
              <video src={videoUri} controls autoPlay loop className="max-h-full w-full object-contain" />
              <button 
                onClick={handleDownload}
                className="absolute top-4 right-4 bg-black/60 hover:bg-[#D4A373] text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/10 opacity-0 group-hover:opacity-100"
                title="Download Video"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center">
                <p className="text-gray-500 mb-2">Video Output</p>
                <div className="text-xs text-gray-600 px-8">
                    Tip: Extended duration takes 2x longer to generate as it renders in two passes.
                </div>
            </div>
          )}
          {status === ProcessingState.PROCESSING && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-6 text-center z-10">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4A373] mb-4"></div>
               <p className="font-bold text-lg mb-2">Generating Cinematic Media</p>
               <p className="text-sm text-gray-400">
                  {useExtendedDuration 
                    ? "Phase 1: Generating Base Layer... Phase 2: Extending Timeline..." 
                    : "Synthesizing High-Fidelity 1080p Clip..."}
               </p>
            </div>
          )}
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default VideoGenerator;