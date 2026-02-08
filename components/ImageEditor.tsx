import React, { useState, useRef } from 'react';
import { generateEditedImage, analyzeImageText } from '../services/geminiService';
import { ProcessingState } from '../types';

type EditorMode = 'visual' | 'text';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [outputText, setOutputText] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<EditorMode>('visual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setOutputImage(null);
        setOutputText(null);
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

  const handleTextAnalysis = async (action: 'extract' | 'summarize' | 'rewrite' | 'expand') => {
    if (!selectedImage) return;

    setStatus(ProcessingState.PROCESSING);
    setErrorMsg('');
    setOutputText(null);

    try {
      const result = await analyzeImageText(selectedImage, action);
      setOutputText(result);
      setStatus(ProcessingState.SUCCESS);
    } catch (e: any) {
      setStatus(ProcessingState.ERROR);
      setErrorMsg(e.message || "Failed to analyze text");
    }
  };

  const handleDownload = () => {
    if (!outputImage) return;
    const a = document.createElement('a');
    a.href = outputImage;
    a.download = `echelon-edit-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Nano Banana Editor
          </h3>
          <p className="text-sm text-gray-500 mt-1">Multimodal AI Engineering</p>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setMode('visual')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'visual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Visual Mod
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Text Neural Link
          </button>
        </div>
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

            {mode === 'visual' ? (
              // VISUAL MODE UI
              <>
                <div className="relative">
                  <label htmlFor="image-prompt" className="sr-only">Edit Instruction</label>
                  <textarea
                    id="image-prompt"
                    className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:border-[#D4A373] focus:ring-[#D4A373] sm:text-sm p-3 border"
                    rows={3}
                    placeholder="Visual Edit: 'Add a vintage filter', 'Turn background to galaxy'..."
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
                  {status === ProcessingState.PROCESSING ? 'Processing Visuals...' : 'Apply Magic Edit'}
                </button>
              </>
            ) : (
              // TEXT NEURAL LINK UI
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Neural Text Operations</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTextAnalysis('extract')}
                    disabled={status === ProcessingState.PROCESSING || !selectedImage}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50"
                  >
                    Scan & Extract
                  </button>
                  <button
                    onClick={() => handleTextAnalysis('summarize')}
                    disabled={status === ProcessingState.PROCESSING || !selectedImage}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50"
                  >
                    Summarize
                  </button>
                  <button
                    onClick={() => handleTextAnalysis('rewrite')}
                    disabled={status === ProcessingState.PROCESSING || !selectedImage}
                    className="px-4 py-2 bg-[#D4A373] border border-[#D4A373] rounded hover:bg-[#b0855a] text-sm font-medium text-white disabled:opacity-50"
                  >
                    Rewrite Professional
                  </button>
                  <button
                    onClick={() => handleTextAnalysis('expand')}
                    disabled={status === ProcessingState.PROCESSING || !selectedImage}
                    className="px-4 py-2 bg-gray-900 border border-gray-900 rounded hover:bg-black text-sm font-medium text-white disabled:opacity-50"
                  >
                    Expand Concept
                  </button>
                </div>
                {status === ProcessingState.PROCESSING && (
                  <p className="text-center text-xs text-[#D4A373] animate-pulse pt-2">Neural Engine Analyzing...</p>
                )}
              </div>
            )}
            
            {status === ProcessingState.ERROR && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 aspect-square flex items-center justify-center overflow-hidden relative group">
             {mode === 'visual' ? (
                // VISUAL OUTPUT
                outputImage ? (
                  <>
                    <img src={outputImage} alt="Edited" className="w-full h-full object-contain" />
                    <button 
                      onClick={handleDownload}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-[#D4A373] hover:text-white text-gray-700 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Download Image"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm text-center px-4">AI generated result will appear here</p>
                )
             ) : (
                // TEXT OUTPUT
                outputText ? (
                  <div className="absolute inset-0 p-6 overflow-y-auto bg-white w-full h-full">
                    <h4 className="text-xs font-bold text-[#D4A373] uppercase mb-4 tracking-widest sticky top-0 bg-white pb-2 border-b border-gray-100">
                      Neural Text Output
                    </h4>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-mono">
                      {outputText}
                    </p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(outputText)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-[#D4A373]"
                      title="Copy to Clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center px-4">
                     <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                     </svg>
                     <p className="text-gray-400 text-sm">Scan text from the image to analyze</p>
                  </div>
                )
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;