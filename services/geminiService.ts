import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Schema for Question Generation
const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "نص السؤال" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "4 خيارات للإجابة" 
      },
      correctAnswer: { type: Type.NUMBER, description: "index of correct option (0-3)" },
      explanation: { type: Type.STRING, description: "شرح سبب الإجابة الصحيحة" },
      difficulty: { type: Type.STRING, description: "EASY, MEDIUM, or HARD" }
    },
    required: ["text", "options", "correctAnswer", "explanation", "difficulty"]
  }
};

export const generateQuestionsAI = async (
  topic: string, 
  count: number, 
  stage: string, 
  difficulty: string
): Promise<Question[]> => {
  
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning mock data for demo.");
    return mockQuestions(count);
  }

  try {
    const prompt = `
      قم بإنشاء ${count} أسئلة اختيار من متعدد (MCQ) حول موضوع "${topic}"
      للمرحلة الدراسية: ${stage}.
      مستوى الصعوبة: ${difficulty}.
      اللغة: العربية.
      يجب أن يكون لكل سؤال 4 خيارات.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster generation
      }
    });

    const rawData = response.text;
    if (!rawData) throw new Error("No data returned from AI");
    
    const parsedData = JSON.parse(rawData);
    
    // Add IDs to questions
    return parsedData.map((q: any, idx: number) => ({
      ...q,
      id: `gen_${Date.now()}_${idx}`
    }));

  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback to mock data on error or no key
    return mockQuestions(count);
  }
};

const mockQuestions = (count: number): Question[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock_${i}`,
    text: `سؤال تجريبي ${i + 1} عن الموضوع المحدد؟`,
    options: ['إجابة أ', 'إجابة ب', 'إجابة ج', 'إجابة د'],
    correctAnswer: 0,
    explanation: 'هذا شرح تجريبي للإجابة الصحيحة.',
    difficulty: 'MEDIUM'
  }));
};

export const analyzeCertificateAI = async (base64Image: string): Promise<any> => {
  // Simulate certificate analysis
  // In a real implementation, we would send the image to Gemini 2.5 Flash
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        studentName: "طالب تجريبي",
        totalScore: 95,
        grade: "امتياز",
        status: "ناجح"
      });
    }, 1500);
  });
}
