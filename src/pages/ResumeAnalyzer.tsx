import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Lightbulb, Loader, Download } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import AIInsights from "@/components/dashboard/AIInsights";
import { resumeAnalysis } from "@/lib/dummyData";
import { analyzeResumeWithAI } from "@/services/aiResumeAnalyzer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

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

const ResumeAnalyzer = () => {
  const [uploaded, setUploaded] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { supabaseUser } = useAuth();

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setResumeText(text);
      setUploaded(true);
      // Mark resume as analyzed for badge system
      if (supabaseUser) {
        localStorage.setItem("resume_analyzed_" + supabaseUser.id, "true");
      }
      await performAIAnalysis(text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const performAIAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeResumeWithAI(text);
      setAiAnalysis(analysis);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed with AI insights!",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to analyze resume. Please ensure you have set up the Google AI API key.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      handleFileUpload(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
    }
  };

  // ── PDF Export (Task 2) ──────────────────────────────────────────
  const handleExportPDF = async () => {
    if (!uploaded) {
      toast({
        title: "No resume to export",
        description: "Please analyze your resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Dynamically import to keep bundle small
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = resumePreviewRef.current;
      if (!element) throw new Error("Preview not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume-analysis.pdf");

      toast({
        title: "PDF exported!",
        description: "Your resume analysis has been downloaded.",
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: "Could not export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  // ────────────────────────────────────────────────────────────────

  return (
    <div>
      <DashboardNavbar title="Resume Analyzer" />
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload */}
          <GlassCard>
            <h3 className="text-base font-semibold text-foreground mb-4">Upload Resume</h3>
            <motion.div
              onDragOver={handleDragDrop}
              onDragEnter={handleDragDrop}
              onDrop={handleDragDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/40 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              {isAnalyzing ? (
                <>
                  <Loader className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
                  <p className="text-sm font-medium text-foreground">Analyzing your resume with AI...</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    {uploaded ? "Resume uploaded!" : "Drag & drop your resume here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 5MB</p>
                  {uploaded && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3">
                      <CheckCircle className="w-8 h-8 text-secondary mx-auto" />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>

            {/* ✅ PDF Export Button */}
            {uploaded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {isExporting ? (
                    <><Loader className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" /> Export Resume Analysis PDF</>
                  )}
                </Button>
              </motion.div>
            )}
          </GlassCard>

          {/* Analysis */}
          <AnimatePresence>
            {uploaded && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-foreground">Quick Analysis</h3>
                    <span className="text-3xl font-bold gradient-text">{resumeAnalysis.score}%</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(resumeAnalysis.sections).map(([key, val]) => (
                      <ProgressBar
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={val as number}
                        variant={(val as number) >= 80 ? "secondary" : (val as number) >= 60 ? "primary" : "accent"}
                        size="sm"
                      />
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {uploaded && (
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <GlassCard delay={0.2}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeAnalysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard delay={0.3}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-secondary" />
                <h3 className="text-base font-semibold text-foreground">Suggestions</h3>
              </div>
              <ul className="space-y-2.5">
                {resumeAnalysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        )}

        {/* ✅ Resume preview div — this gets captured for PDF export */}
        {uploaded && (
          <div ref={resumePreviewRef} className="mt-6 p-6 bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Resume Analysis Summary</h2>
              <span className="text-3xl font-bold text-indigo-600">{resumeAnalysis.score}%</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  Missing Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {resumeAnalysis.missingSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  Suggestions
                </h3>
                <ul className="space-y-1">
                  {resumeAnalysis.suggestions.slice(0, 4).map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {aiAnalysis && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-2">AI Career Advice</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{aiAnalysis.careerAdvice}</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400 text-center">
              Generated by PlacePrep — Student Placement Preparation Tracker
            </div>
          </div>
        )}

        {/* AI Insights Section */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">AI-Powered Deep Analysis</h2>
            <AIInsights analysis={aiAnalysis} isLoading={isAnalyzing} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;