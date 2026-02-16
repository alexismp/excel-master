import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askExcelTutor = async (
  question: string,
  context: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!apiKey) return "API Key is missing. Please configure it to use the AI Tutor.";

  try {
    const model = 'gemini-3-flash-preview';
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are an expert Excel Instructor, similar to a LinkedIn Learning instructor.
        You are helpful, encouraging, and concise.
        You are helping a student use a web-based Excel simulator.
        The student might ask about formulas like XLOOKUP.
        Provide clear, step-by-step explanations.
        If they ask for a formula, explain how it works rather than just giving the answer if possible.
        Context about the current sheet is provided: ${context}`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: question });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI tutor right now.";
  }
};

export const generatePracticeScenario = async (): Promise<string> => {
   if (!apiKey) return "";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a JSON object for a simple Excel practice scenario involving XLOOKUP. It should have a 'title', 'description', and 'initialSheet' data structure similar to: { 'A1': { value: 'ID', formula: '' }... }.",
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text || "";
    } catch (e) {
        console.error(e);
        return "";
    }
}
