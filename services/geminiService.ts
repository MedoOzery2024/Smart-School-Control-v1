import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

// Initialize the client strictly according to the guidelines
// The API key is obtained exclusively from process.env.API_KEY
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
  
  // Check if API key is present (client-side check strictly for fallback logic)
  if (!process.env.API_KEY) {
    console.warn("API Key is missing in environment variables. Using Mock Data.");
    alert("تنبيه: مفتاح الذكاء الاصطناعي غير مضبوط في إعدادات Vercel. يتم عرض بيانات تجريبية.");
    return mockQuestions(count);
  }

  try {
    const prompt = `
      قم بإنشاء ${count} أسئلة اختيار من متعدد (MCQ) حول موضوع "${topic}"
      للمرحلة الدراسية: ${stage}.
      مستوى الصعوبة: ${difficulty}.
      اللغة: العربية.
      يجب أن يكون لكل سؤال 4 خيارات.
      تأكد أن الأسئلة متنوعة وشاملة للموضوع.
    `;

    // Using 'gemini-3-flash-preview' as recommended for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        // thinkingBudget is set to 0 to disable thinking for faster generation on Flash model
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const rawData = response.text;
    
    if (!rawData) {
      throw new Error("No data returned from AI");
    }
    
    const parsedData = JSON.parse(rawData);
    
    // Add IDs to questions
    return parsedData.map((q: any, idx: number) => ({
      ...q,
      id: `gen_${Date.now()}_${idx}`
    }));

  } catch (error) {
    console.error("AI Generation Error:", error);
    alert("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. سيتم عرض بيانات تجريبية.");
    // Fallback to mock data on error
    return mockQuestions(count);
  }
};

const mockQuestions = (count: number): Question[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock_${i}`,
    text: `سؤال تجريبي ${i + 1} (الخدمة غير متصلة): ما هي عاصمة مصر؟`,
    options: ['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان'],
    correctAnswer: 0,
    explanation: 'هذا سؤال تجريبي يظهر لأن مفتاح API غير موجود أو حدث خطأ.',
    difficulty: 'EASY'
  }));
};

export const analyzeCertificateAI = async (base64Image: string): Promise<any> => {
  // Simulate certificate analysis
  // Future upgrade: Use 'gemini-2.5-flash-image' for image analysis
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