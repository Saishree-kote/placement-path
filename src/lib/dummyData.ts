export const skills = [
  { name: "Programming", level: 82, category: "Technical", resources: ["LeetCode", "HackerRank"] },
  { name: "Data Structures", level: 75, category: "Technical", resources: ["GeeksforGeeks", "NeetCode"] },
  { name: "Logical Reasoning", level: 68, category: "Aptitude", resources: ["IndiaBix", "PrepInsta"] },
  { name: "Communication", level: 55, category: "Soft Skills", resources: ["Toastmasters", "Coursera"] },
  { name: "System Design", level: 45, category: "Technical", resources: ["Grokking SD", "System Design Primer"] },
  { name: "DBMS", level: 72, category: "Technical", resources: ["W3Schools", "JavaTPoint"] },
];

export const companies = [
  { name: "Google", logo: "G", cgpa: 8.0, skills: ["DSA", "System Design", "Problem Solving"], pattern: "Online Test → 4 Interviews", eligibility: "almost" as const },
  { name: "Microsoft", logo: "M", cgpa: 7.5, skills: ["DSA", "OOP", "System Design"], pattern: "Online Test → 3 Interviews", eligibility: "eligible" as const },
  { name: "Amazon", logo: "A", cgpa: 7.0, skills: ["DSA", "Leadership Principles"], pattern: "Online Test → 4 Interviews", eligibility: "eligible" as const },
  { name: "Meta", logo: "M", cgpa: 8.5, skills: ["DSA", "System Design", "React"], pattern: "Phone Screen → 3 Onsite", eligibility: "not-eligible" as const },
  { name: "Goldman Sachs", logo: "GS", cgpa: 7.5, skills: ["Aptitude", "DSA", "DBMS"], pattern: "Online Test → 2 Interviews", eligibility: "eligible" as const },
  { name: "Infosys", logo: "I", cgpa: 6.0, skills: ["Aptitude", "Programming"], pattern: "Online Test → Interview → HR", eligibility: "eligible" as const },
];

export const aptitudeQuestions = [
  {
    id: 1,
    question: "If the sum of 5 consecutive integers is 35, what is the largest integer?",
    options: ["9", "7", "8", "10"],
    correct: 0,
    category: "Quantitative",
  },
  {
    id: 2,
    question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/hr?",
    options: ["36", "32", "40", "28"],
    correct: 0,
    category: "Quantitative",
  },
  {
    id: 3,
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "38", "44"],
    correct: 0,
    category: "Logical Reasoning",
  },
];

export const resumeAnalysis = {
  score: 72,
  sections: {
    formatting: 85,
    skills: 70,
    experience: 65,
    education: 90,
    projects: 60,
  },
  missingSkills: ["Docker", "Kubernetes", "CI/CD", "GraphQL", "Redis"],
  suggestions: [
    "Add quantifiable achievements to your experience section",
    "Include relevant certifications (AWS, GCP)",
    "Add a dedicated projects section with GitHub links",
    "Use action verbs to start bullet points",
    "Include keywords from job descriptions",
  ],
};
