import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AptitudeQuestion {
    id: number | string;
    question: string;
    options: string[];
    correct: number;
    category: string;
    company: {
        name: string;
        logo?: string;
        color?: string;
    };
    explanation: string;
}

const getAIClient = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY || "";
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

export const generateAptitudeQuestions = async (
    count: number,
    category?: string
): Promise<AptitudeQuestion[]> => {
    const genAI = getAIClient();

    if (!genAI) {
        console.warn("Google AI API key not found, falling back to mock questions.");
        return generateMockQuestions(count, category);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate ${count} aptitude questions for placement preparation. 
    Category: ${category || "General (Mixed Quant, Logical, Verbal)"}.
    
    Each question should be typical of what top companies (like Google, Amazon, TCS, Microsoft, Infosys, etc.) ask.
    
    Return ONLY a JSON array of objects with the following structure:
    {
      "question": "The question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 0, // index of the correct option (0-3)
      "category": "The specific category",
      "company": {
        "name": "Company Name (e.g., Google)",
        "color": "A hex color code or Tailwind color class representing the company"
      },
      "explanation": "A step-by-step detailed explanation of how to solve the problem"
    }
    
    Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("Could not parse AI response as JSON array");

        const questions = JSON.parse(jsonMatch[0]) as any[];
        return questions.map((q, i) => ({
            ...q,
            id: `ai-${Date.now()}-${i}`
        }));
    } catch (error) {
        console.error("AI Question generation failed:", error);
        return generateMockQuestions(count, category);
    }
};

export const generateMockQuestions = async (
    count: number,
    category?: string
): Promise<AptitudeQuestion[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockLibrary = [
        {
            question: "If 5 workers can build a wall in 12 days, how many workers are needed to build the same wall in 4 days?",
            options: ["10", "15", "20", "25"],
            correct: 1,
            category: "Quantitative",
            company: { name: "TCS", color: "#1b365d" },
            explanation: "This is an inverse proportion problem. Workers x Days = Constant. 5 * 12 = 60 worker-days. For 4 days: 60 / 4 = 15 workers."
        },
        {
            question: "Choose the odd one out: 64, 125, 216, 343, 512, 729",
            options: ["125", "343", "512", "None"],
            correct: 3,
            category: "Logical Reasoning",
            company: { name: "Amazon", color: "#ff9900" },
            explanation: "64=4³, 125=5³, 216=6³, 343=7³, 512=8³, 729=9³. All are perfect cubes. So 'None' is the correct odd one out if we assume one must be odd."
        },
        {
            question: "Complete the series: 7, 10, 16, 28, 52, ?",
            options: ["88", "96", "100", "104"],
            correct: 2,
            category: "Logical Reasoning",
            company: { name: "Google", color: "#4285f4" },
            explanation: "The differences are: 3, 6, 12, 24. Each difference is double the previous. Next difference is 48. 52 + 48 = 100."
        },
        {
            question: "The ratio of ages of A and B is 3:4. After 5 years, the ratio becomes 4:5. What is the current age of A?",
            options: ["15", "18", "20", "25"],
            correct: 0,
            category: "Quantitative",
            company: { name: "Infosys", color: "#007cc3" },
            explanation: "Let ages be 3x and 4x. (3x+5)/(4x+5) = 4/5. 5(3x+5) = 4(4x+5) => 15x + 25 = 16x + 20 => x = 5. Age of A = 3 * 5 = 15."
        }
    ];

    const results: AptitudeQuestion[] = [];
    for (let i = 0; i < count; i++) {
        const q = mockLibrary[i % mockLibrary.length];
        results.push({
            ...q,
            id: `mock-${Date.now()}-${i}`
        });
    }
    return results;
};
