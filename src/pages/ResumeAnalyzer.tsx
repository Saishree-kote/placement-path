import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import { resumeAnalysis } from "@/lib/dummyData";

const ResumeAnalyzer = () => {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div>
      <DashboardNavbar title="Resume Analyzer" />
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload */}
          <GlassCard>
            <h3 className="text-base font-semibold text-foreground mb-4">Upload Resume</h3>
            <motion.div
              onClick={() => setUploaded(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/40 transition-colors"
            >
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
            </motion.div>
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
                    <h3 className="text-base font-semibold text-foreground">Analysis</h3>
                    <span className="text-3xl font-bold gradient-text">{resumeAnalysis.score}%</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(resumeAnalysis.sections).map(([key, val]) => (
                      <ProgressBar
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={val}
                        variant={val >= 80 ? "secondary" : val >= 60 ? "primary" : "accent"}
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
                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-medium">
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
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
