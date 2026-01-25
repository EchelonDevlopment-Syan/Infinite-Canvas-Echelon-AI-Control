import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from "../types";
import { FOUNDER_NAME, FOUNDER_TITLE } from "../constants";

// Helper to get the AI client
export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Helper to strip markdown code blocks from a string if present.
 */
const cleanJsonResponse = (text: string): string => {
  return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
};

export const processPdfToSlides = async (pdfBase64: string): Promise<Slide[]> => {
  const ai = getAiClient();
  const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Upgraded for better reasoning over PDF content
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "application/pdf",
            },
          },
          {
            text: `Act as a senior sales engineer at Echelon AI Control. 
            Transform the attached PDF deck into a compelling, 10-slide sales presentation focused on "The Infinite Canvas" and "Spatial Computing". 
            
            IMPORTANT: Highlight that Echelon AI Control is owned and operated by ${FOUNDER_NAME}, ${FOUNDER_TITLE}. 
            Integrate this ownership as a mark of quality and vision throughout the narrative.
            
            Rules:
            1. Extract the core value proposition from the PDF.
            2. Rephrase it using Echelon's tone: Visionary, precise, and authoritative.
            3. For each slide, choose a visualType from: 'grid', 'network', 'comparison', 'quote', 'apps'.
            4. Ensure slide 1 is a powerful title slide featuring the owner's name.
            5. Return ONLY a JSON array matching the Slide interface.
            
            JSON Schema:
            type Slide = {
              id: number;
              title: string;
              subtitle?: string;
              content: string[];
              visualType: 'grid' | 'network' | 'comparison' | 'quote' | 'apps';
            }`,
          },
        ],
      },
    ],
    config: {
      thinkingConfig: { thinkingBudget: 16384 }, // Reserve tokens for high-quality reasoning
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            content: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualType: { type: Type.STRING, description: "One of: grid, network, comparison, quote, apps" },
          },
          required: ["id", "title", "content", "visualType"],
        },
      },
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("The AI Architect returned an empty response. Please check your PDF content.");
  }

  try {
    const cleanedJson = cleanJsonResponse(rawText);
    const slides = JSON.parse(cleanedJson);
    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error("The AI failed to generate any valid slides from this PDF.");
    }
    return slides;
  } catch (e) {
    console.error("Failed to parse AI response as slides", e, rawText);
    throw new Error("The Sales Architect couldn't structure the content properly. Please try a different PDF.");
  }
};

export const generateEditedImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  const ai = getAiClient();
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
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await win.aistudio.openSelectKey(); 
    }
  }

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
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or returned no URI.");
  }

  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};