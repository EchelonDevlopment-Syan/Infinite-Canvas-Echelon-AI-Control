import React, { useState, useRef } from 'react';
import { generateEditedImage } from '../services/geminiService';
import { ProcessingState } from '../types';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setOutputImage(null); // Clear previous output
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    
    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    
    try {
      const result = await generateEditedImage(selectedImage, prompt);
      setOutputImage(result);
      setStatus(ProcessingState.SUCCESS);
    } catch (e: any) {
      setStatus(ProcessingState.ERROR);
      setErrorMsg(e.message || "Failed to edit image");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Nano Banana Editor
        </h3>
        <p className="text-sm text-gray-500 mt-1">Powered by Gemini 2.5 Flash Image. Upload a photo and describe how to change it.</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4A373] transition-colors overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#D4A373]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">Click to upload image</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="relative">
              <label htmlFor="image-prompt" className="sr-only">Edit Instruction</label>
              <textarea
                id="image-prompt"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#D4A373] focus:ring-[#D4A373] sm:text-sm p-3 border"
                rows={3}
                placeholder="E.g., 'Add a vintage filter', 'Turn the background into a galaxy'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === ProcessingState.PROCESSING || !selectedImage || !prompt}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${status === ProcessingState.PROCESSING ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2F3E46] hover:bg-gray-800'}`}
            >
              {status === ProcessingState.PROCESSING ? 'Processing...' : 'Apply Magic Edit'}
            </button>
            
            {status === ProcessingState.ERROR && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 aspect-square flex items-center justify-center overflow-hidden">
             {outputImage ? (
               <img src={outputImage} alt="Edited" className="w-full h-full object-contain" />
             ) : (
               <p className="text-gray-400 text-sm text-center px-4">AI generated result will appear here</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;