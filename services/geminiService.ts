import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from "../types";
import { FOUNDER_NAME, FOUNDER_TITLE, COMPANY_NAME } from "../constants";

// Helper to get the AI client
export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Robustly extracts JSON from a potentially messy string response.
 */
const cleanJsonResponse = (text: string): string => {
  // Try to find the first '[' and last ']' for an array or '{' and '}' for an object
  const startIdx = text.indexOf('[');
  const endIdx = text.lastIndexOf(']');
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return text.substring(startIdx, endIdx + 1);
  }
  
  // Fallback to simpler cleaning
  return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
};

/**
 * A dedicated proofreading agent to ensure zero spelling errors in sales content.
 * Designed to be resilient: returns original slides if cleaning fails.
 */
const proofreadSlides = async (slides: Slide[]): Promise<Slide[]> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a world-class copy editor. Review the following JSON array of slides for a company called ${COMPANY_NAME}.
      
      TASKS:
      1. Correct any and all spelling or grammatical errors.
      2. Ensure the Founder's name "${FOUNDER_NAME}" and title "${FOUNDER_TITLE}" are spelled perfectly.
      3. Ensure brand-specific terms like "Infinite Canvas", "Spatial Computing", and "Bio-Digital" are capitalized correctly.
      4. DO NOT change the structure of the JSON. Only edit the text values.
      5. Return ONLY the corrected JSON array inside markdown code blocks.
      
      JSON TO PROOFREAD:
      ${JSON.stringify(slides)}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text;
    if (!rawText) return slides;

    const cleanedJson = cleanJsonResponse(rawText);
    return JSON.parse(cleanedJson);
  } catch (e) {
    console.warn("Proofreading failed, falling back to raw slides:", e);
    return slides;
  }
};

export const processPdfToSlides = async (pdfBase64: string): Promise<Slide[]> => {
  const ai = getAiClient();
  const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

  // Using a larger token budget to ensure thinking doesn't starve the output
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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
            text: `Act as a senior sales engineer at ${COMPANY_NAME}. 
            Transform the attached PDF into a compelling 8-10 slide sales presentation.
            
            CORE REQUIREMENT: The deck MUST highlight that the company is owned and operated by ${FOUNDER_NAME}, ${FOUNDER_TITLE}.
            
            Rules:
            1. Synthesize the PDF content into a "Spatial Computing" narrative.
            2. For each slide, choose a visualType: 'grid', 'network', 'comparison', 'quote', 'apps'.
            3. Return ONLY a valid JSON array matching the Slide interface.`,
          },
        ],
      },
    ],
    config: {
      // Increased budget: 8000 total, 4000 for thinking. Leaves 4000 for the JSON response.
      maxOutputTokens: 8000,
      thinkingConfig: { thinkingBudget: 4000 },
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
            visualType: { type: Type.STRING },
          },
          required: ["id", "title", "content", "visualType"],
        },
      },
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Echelon AI Architect returned an empty response. Ensure the PDF is not password protected.");
  }

  try {
    const rawSlides = JSON.parse(cleanJsonResponse(rawText));
    // Pass through the proofreader before delivery for professional quality
    return await proofreadSlides(rawSlides);
  } catch (e) {
    console.error("Critical parsing error:", rawText, e);
    throw new Error("The AI generated the content but failed to format the response correctly. Please try again.");
  }
};

export const generateVideoPromptFromDeck = async (slides: Slide[]): Promise<string> => {
  const ai = getAiClient();
  const summary = slides.map(s => s.title).join(", ");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a single cinematic video prompt for Veo based on these themes: ${summary}. 
    The video must feel like a high-end luxury brand commercial for a company owned by ${FOUNDER_NAME}. 
    Focus on holographic interfaces and "Infinite Canvas" visuals. 
    
    IMPORTANT: Describe any text as 'perfectly typeset and flawless'. 
    Example: 'The ${COMPANY_NAME} logo glows in sharp, pixel-perfect 8K resolution.'
    Keep it under 100 words.`
  });
  
  return response.text || "A cinematic journey through an infinite digital canvas with perfect holographic typography.";
};

export const generateEditedImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { 
      parts: [
        { inlineData: { data: cleanBase64, mimeType: 'image/png' } }, 
        { text: `Edit this image based on: ${prompt}. Ensure any text is spelled perfectly.` }
      ] 
    },
  });
  
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("No image generated.");
  return `data:image/png;base64,${part.inlineData.data}`;
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
    prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (operation.error) {
    throw new Error(`Veo error: ${operation.error.message}`);
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video URI returned.");
  
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Video download failed.");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};