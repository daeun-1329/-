import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a creative architectural description for a project.
 */
export const generateProjectDescription = async (title: string, category: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning placeholder.");
    return "API Key missing. Unable to generate description.";
  }

  try {
    const prompt = `
      Write a sophisticated, professional, and artistic 2-sentence description for an architectural or design project.
      
      Project Title: ${title}
      Category: ${category}
      
      The tone should be elegant, minimalist, and visionary. Do not use hashtags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service.";
  }
};
