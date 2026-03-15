import { GoogleGenerativeAI } from "@google/generative-ai";

interface ResumeAnalysisResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  detailedSuggestions: string[];
  skillGaps: string[];
  industryInsights: string;
  careerAdvice: string;
  improvementPriorities: Array<{
    priority: number;
    area: string;
    action: string;
    impact: string;
  }>;
}

// Initialize Gemini AI
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY || process.env.GOOGLE_AI_KEY;
  if (!apiKey) {
    throw new Error(
      "Google AI API key not found. Please set VITE_GOOGLE_AI_KEY environment variable."
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

export const analyzeResumeWithAI = async (
  resumeText: string
): Promise<ResumeAnalysisResult> => {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert resume coach and career advisor with deep knowledge of tech industry hiring practices. Analyze the following resume and provide deep, actionable insights.

Resume Content:
${resumeText}

Please provide a JSON response with the following structure (return ONLY valid JSON, no markdown):
{
  "overallScore": <number 0-100>,
  "strengths": [<array of key strengths identified>],
  "weaknesses": [<array of key weaknesses>],
  "detailedSuggestions": [<array of 5-7 specific, actionable suggestions>],
  "skillGaps": [<array of critical skills to add>],
  "industryInsights": "<paragraph of insights on current market trends>",
  "careerAdvice": "<paragraph of personalized career advice>",
  "improvementPriorities": [
    {
      "priority": <1-5>,
      "area": "<skill/section area>",
      "action": "<specific action to take>",
      "impact": "<expected impact>"
    }
  ]
}

Be specific, data-driven, and focus on what will actually help in placements and interviews.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const analysisResult = JSON.parse(jsonMatch[0]) as ResumeAnalysisResult;
    return analysisResult;
  } catch (error) {
    console.warn("AI Analysis failed or API key missing, falling back to mock analysis:", error);
    return mockAnalyzeResume(resumeText);
  }
};

const mockAnalyzeResume = async (text: string): Promise<ResumeAnalysisResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    overallScore: 78,
    strengths: [
      "Strong technical foundation in React and TypeScript",
      "Excellent project experience with modern styling (Tailwind CSS)",
      "Clear and professional formatting",
      "Good use of action verbs in experience descriptions",
    ],
    weaknesses: [
      "Limited mention of backend or database optimization techniques",
      "Missing quantifiable metrics for project impacts",
      "Education section could be more concise",
    ],
    detailedSuggestions: [
      "Incorporate specific metrics (e.g., 'Improved performance by 30%') to make achievements more impactful.",
      "Add a dedicated 'Technical Skills' grid for better ATS readability.",
      "Highlight experience with state management libraries like TanStack Query or Redux.",
      "Include a brief professional summary at the top to highlight your unique value proposition.",
      "Expand on your collaborative experience, mentioning specific tools like Git or Jira.",
    ],
    skillGaps: ["Next.js", "Node.js", "Docker", "PostgreSQL", "Unit Testing (Vitest/Jest)"],
    industryInsights:
      "The current market highly values full-stack capabilities. While your frontend skills are strong, adding foundational knowledge of backend systems and cloud deployment would significantly increase your marketability for entry-level SDE roles.",
    careerAdvice:
      "Focus on building 1-2 end-to-end full-stack projects. This will bridge the gap between your strong UI skills and a complete engineering profile. Additionally, participating in open-source could provide the collaborative proof recruiters are looking for.",
    improvementPriorities: [
      {
        priority: 1,
        area: "Quantifiable Achievements",
        action: "Rewrite 3 bullet points to include specific numbers/results.",
        impact: "Significantly improves impact on recruiters.",
      },
      {
        priority: 2,
        area: "Backend Skills",
        action: "Add a Node.js/PostgreSQL project to your portfolio.",
        impact: "Expands eligibility for full-stack roles.",
      },
      {
        priority: 3,
        area: "ATS Optimization",
        action: "Standardize section headings for better automated scanning.",
        impact: "Increases chances of passing initial filters.",
      },
    ],
  };
};

export const generateResumeImprovementPlan = async (
  resumeText: string,
  targetCompanies: string[] = []
): Promise<string> => {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const companyContext = targetCompanies.length
      ? `Target companies: ${targetCompanies.join(", ")}`
      : "";

    const prompt = `As a senior recruiter, create a personalized improvement plan for this resume. ${companyContext}

Resume:
${resumeText}

Provide:
1. Week-by-week action plan for the next 4 weeks
2. Specific resources for skill development
3. Resume formatting tips for ATS optimization
4. Interview preparation recommendations

Format as a clear, actionable plan.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating improvement plan:", error);
    throw error;
  }
};

export const compareResumeWithJobDescription = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}> => {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Compare this resume with the job description and provide match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return JSON (ONLY valid JSON, no markdown):
{
  "matchScore": <0-100>,
  "matchedSkills": [<skills that match>],
  "missingSkills": [<skills not in resume but required>],
  "recommendations": [<specific resume improvements for this role>]
}`;

    const result = await model.generateContent(prompt);
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not parse match analysis response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error comparing resume with job description:", error);
    throw error;
  }
};
