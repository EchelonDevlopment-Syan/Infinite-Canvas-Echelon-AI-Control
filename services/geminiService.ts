import { GoogleGenAI } from "@google/genai";

// Helper to get the AI client, ensuring we have the key if needed for Veo
export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEditedImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  const ai = getAiClient();
  
  // Clean base64 string if it contains the data url prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType, 
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated.");
};

export const generateMarketingVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // Check for paid API key selection (required for Veo)
  // Casting window to any to avoid type conflict with existing AIStudio definition
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       // Just trigger it, let the UI handle the wait or retry
       await win.aistudio.openSelectKey(); 
    }
  }

  // Re-instantiate client to ensure it picks up the possibly newly selected key context
  const ai = getAiClient();

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or returned no URI.");
  }

  // Return the URI directly; the frontend will need to append the key if fetching, 
  // but for a src attribute, we might need to proxy or use the key. 
  // The guide says: "You must append an API key when fetching from the download link."
  return `${videoUri}&key=${process.env.API_KEY}`;
};
