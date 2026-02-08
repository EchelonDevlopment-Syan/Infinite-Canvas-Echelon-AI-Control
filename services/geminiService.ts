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
    
    IMPORTANT TEXT INSTRUCTIONS: 
    1. MINIMIZE TEXT on screen to avoid rendering errors.
    2. ONLY display the company name "${COMPANY_NAME}" or simple, large headlines.
    3. Do NOT include small body text, bullet points, or paragraphs as they will be unreadable.
    4. Any text shown MUST be perfectly spelled and crystal clear 8K resolution.

    Visual Style: Cinematic, Ethereal, Gold & Black, Future Tech.
    Keep it under 100 words.`
  });
  
  return response.text || "A cinematic journey through an infinite digital canvas with perfect holographic typography.";
};

export const generateVideoPromptFromSingleSlide = async (slide: Slide): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a cinematic video generation prompt for Veo based on this specific slide concept:
    
    Title: ${slide.title}
    Subtitle: ${slide.subtitle || ''}
    Key Points: ${slide.content.join(', ')}
    Visual Style: ${slide.visualType}

    Instructions:
    1. Visualize the abstract concepts in this slide as physical 3D holographic objects.
    2. Style: High-end tech, Echelon AI branding (Black, Gold, Cream), Spatial Computing.
    3. TEXT RULE: Only render the Title "${slide.title}" if necessary. Do NOT render the bullet points as text. Visualize them as objects instead.
    4. Keep it concise (max 80 words) and visually descriptive.`
  });

  return response.text || `A high-fidelity spatial computing visualization of ${slide.title} with holographic elements.`;
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

export const analyzeImageText = async (base64Image: string, mode: 'extract' | 'summarize' | 'rewrite' | 'expand'): Promise<string> => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  
  let prompt = "";
  switch (mode) {
    case 'extract':
      prompt = "Extract all visible text from this image exactly as it appears. Return only the text.";
      break;
    case 'summarize':
      prompt = "Analyze the text in this image and provide a concise, high-level summary of the key concepts.";
      break;
    case 'rewrite':
      prompt = "Read the text in this image and rewrite it to sound more executive, persuasive, and professional. Improve the grammar and flow.";
      break;
    case 'expand':
      prompt = "Analyze the core ideas in this image's text and expand upon them. Add 2-3 innovative bullet points that logically follow from this content.";
      break;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64, mimeType: 'image/png' } }, 
        { text: prompt }
      ]
    }
  });

  return response.text || "Unable to analyze text from this image.";
};

const proofreadVideoPrompt = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a meticulous proofreader for a high-end video production studio. 
      Review the following video prompt.
      
      CRITICAL INSTRUCTIONS:
      1. Ensure "${COMPANY_NAME}" is spelled correctly.
      2. Ensure "${FOUNDER_NAME}" is spelled correctly.
      3. REMOVE any requests for small text, bullet points, or detailed paragraphs. The video generator cannot render them clearly.
      4. Suggest visualizing concepts as 3D objects instead of text where possible.
      
      Return ONLY the corrected prompt text with no additional commentary.
      
      INPUT PROMPT:
      ${prompt}`
    });
    return response.text?.trim() || prompt;
  } catch (error) {
    console.warn("Prompt proofreading failed, proceeding with original:", error);
    return prompt;
  }
};

export const generateMarketingVideo = async (
  prompt: string, 
  aspectRatio: '16:9' | '9:16' = '16:9',
  useExtendedDuration: boolean = false
): Promise<string> => {
  
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await win.aistudio.openSelectKey(); 
    }
  }

  // Auto-correct the prompt before generation
  const cleanPrompt = await proofreadVideoPrompt(prompt);
  const ai = getAiClient();

  // Step 1: Generate Base Video
  // Note: Extension REQUIRES 720p. If we are extending, we must start with 720p.
  // If not extending, we use 1080p for max quality.
  const resolution = useExtendedDuration ? '720p' : '1080p';

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: cleanPrompt,
    config: { 
      numberOfVideos: 1, 
      resolution: resolution,
      aspectRatio,
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (operation.error) {
    throw new Error(`Veo error (Phase 1): ${operation.error.message}`);
  }

  let videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  const previousVideo = operation.response?.generatedVideos?.[0]?.video;

  // Step 2: Extend Video (if requested)
  // This adds ~7 seconds to the existing clip.
  if (useExtendedDuration && previousVideo) {
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: cleanPrompt, // Continue the visual theme
      video: previousVideo,
      config: { 
        numberOfVideos: 1, 
        resolution: '720p', // Extension must be 720p
        aspectRatio,
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (operation.error) {
      // If extension fails, we fallback to the original video URI rather than crashing
      console.error("Extension failed, returning base video", operation.error);
    } else {
      videoUri = operation.response?.generatedVideos?.[0]?.video?.uri || videoUri;
    }
  }

  if (!videoUri) throw new Error("No video URI returned.");
  
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Video download failed.");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};