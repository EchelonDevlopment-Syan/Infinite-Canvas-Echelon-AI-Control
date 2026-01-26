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
      const uri = await generateMarketingVideo(prompt, aspectRatio);
      setVideoUri(uri);
      setStatus(ProcessingState.SUCCESS);
    } catch (e: any) {
      setStatus(ProcessingState.ERROR);
      setErrorMsg(e.message || "Generation failed.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Veo Video Studio</h3>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <textarea
          className="w-full rounded-md border-gray-300 mb-4 p-3 border"
          rows={3}
          placeholder="Concept for Founder-led marketing video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={status === ProcessingState.PROCESSING}
          className="w-full py-3 bg-[#D4A373] text-white rounded-md font-bold mb-6"
        >
          {status === ProcessingState.PROCESSING ? 'Rendering...' : 'Generate New Clip'}
        </button>

        <div className="flex-grow bg-black rounded-lg flex items-center justify-center min-h-[300px] relative">
          {videoUri ? (
            <video src={videoUri} controls autoPlay loop className="max-h-full" />
          ) : (
            <p className="text-gray-500">Video Output</p>
          )}
          {status === ProcessingState.PROCESSING && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
               Synthesizing...
            </div>
          )}
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default VideoGenerator;