/**
 * File upload and text extraction utilities for resume analysis
 */

export interface FileUploadResult {
  text: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * Extract text from a plain text or Word document file
 * For production, consider using libraries like:
 * - pdfjs-dist for PDF extraction
 * - docx for Word document parsing
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "text/plain") {
    return await file.text();
  }

  if (
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // For production, use docx library
    // For now, attempt basic text extraction
    return await file.text();
  }

  if (file.type === "application/pdf") {
    // Note: PDF text extraction requires additional library
    // Consider using pdfjs-dist: npm install pdfjs-dist
    throw new Error(
      "PDF extraction requires additional setup. Please convert to text or use online PDF converter first."
    );
  }

  throw new Error(
    `Unsupported file type: ${file.type}. Please upload PDF, DOC, or DOCX files.`
  );
};

/**
 * Validate resume file before processing
 */
export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_TYPES = [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File size exceeds 5MB limit" };
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload PDF, DOC, or DOCX files.",
    };
  }

  return { valid: true };
};

/**
 * Format resume text for AI analysis
 * Cleans up extra whitespace and normalizes formatting
 */
export const formatResumeForAnalysis = (text: string): string => {
  return (
    text
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove special characters but keep formatting
      .replace(/[^\w\s\-@.#/]/g, "")
      // Trim
      .trim()
  );
};

/**
 * Extract key sections from resume text
 * Useful for targeted analysis
 */
export const extractResumeSections = (text: string) => {
  const sections = {
    contact: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    certifications: "",
  };

  // Simple regex-based extraction (can be improved)
  const sectionPatterns = {
    contact: /(?:contact|phone|email|linkedin|github)/i,
    experience: /(?:experience|employment|work|professional)/i,
    education: /(?:education|degree|university|school|college)/i,
    skills: /(?:skills|expertise|technical|competencies)/i,
    projects: /(?:projects?|portfolio|work samples)/i,
    certifications: /(?:certifications?|licenses|awards)/i,
    summary: /(?:summary|objective|profile|about)/i,
  };

  // Split text by common section headers
  const lines = text.split("\n");
  let currentSection = "summary";

  for (const line of lines) {
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line)) {
        currentSection = section;
        break;
      }
    }
    sections[currentSection as keyof typeof sections] +=
      line + "\n";
  }

  return sections;
};

/**
 * Calculate resume completeness score (0-100)
 * Based on presence of key sections and content depth
 */
export const calculateCompletenessScore = (text: string): number => {
  const sections = extractResumeSections(text);
  let score = 0;

  // Check for each section (0-20 points each)
  if (sections.contact.length > 50) score += 15; // Contact info
  if (sections.summary.length > 100) score += 15; // Professional summary
  if (sections.experience.length > 200) score += 20; // Work experience (most important)
  if (sections.education.length > 50) score += 15; // Education
  if (sections.skills.length > 100) score += 20; // Skills section
  if (sections.projects.length > 100) score += 10; // Projects/portfolio
  if (sections.certifications.length > 50) score += 5; // Certifications

  // Check for quantifiable achievements
  const hasQuantifiableAchievements = /\d+%|\d+x|increased|improved|reduced/i.test(
    sections.experience
  );
  if (hasQuantifiableAchievements) score += 5;

  return Math.min(score, 100);
};

/**
 * Suggest resume improvements based on basic analysis
 */
export const suggestImprovements = (text: string): string[] => {
  const suggestions: string[] = [];
  const sections = extractResumeSections(text);

  if (!sections.summary || sections.summary.length < 100) {
    suggestions.push("Add a professional summary at the top of your resume");
  }

  if (!sections.skills || sections.skills.length < 100) {
    suggestions.push("Create a dedicated skills section with relevant keywords");
  }

  if (!/\d+%|\d+x|increased|improved|reduced/i.test(sections.experience)) {
    suggestions.push("Add quantifiable achievements (percentages, metrics) to your experience");
  }

  if (!sections.projects || sections.projects.length < 50) {
    suggestions.push("Include a projects section with links to GitHub or portfolio");
  }

  if (sections.experience.length < 200) {
    suggestions.push("Add more detail to your experience descriptions");
  }

  if (!/action verbs/i.test(text)) {
    suggestions.push("Use strong action verbs to start bullet points");
  }

  return suggestions;
};
