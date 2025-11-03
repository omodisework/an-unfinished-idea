
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface GenerateDescriptionParams {
  projectTitle: string;
  technologies: string;
  initialDescription?: string;
}

export const generateProjectDescription = async (
  params: GenerateDescriptionParams,
): Promise<string> => {
  const { projectTitle, technologies, initialDescription } = params;

  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set. Please ensure it's configured in your environment.");
  }

  // Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate a compelling and concise project description for a portfolio.
  The project is titled '${projectTitle}'.
  It uses the following technologies: '${technologies}'.
  ${initialDescription ? `Here's a starting point: '${initialDescription}'.` : ''}
  Emphasize the problem it solves, its key features, and what makes it interesting.
  Keep the description under 150 words. Focus on a professional tone.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using pro model for complex text tasks
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 200, // Slightly more than 150 words to allow flexibility
        thinkingConfig: { thinkingBudget: 50 }, // Allocate a small thinking budget for concise responses
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating project description with Gemini:", error);
    // Attempt to handle the "Requested entity was not found." error
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      console.warn("API key might be invalid or not selected. Prompting user to select key.");
      // This part would typically interact with a global UI for key selection.
      // For this specific environment, we can't directly call window.aistudio.openSelectKey()
      // from a service file or assume the UI will handle it.
      // The error should propagate to the component to trigger UI feedback.
    }
    throw new Error(`Failed to generate description: ${error instanceof Error ? error.message : String(error)}`);
  }
};
