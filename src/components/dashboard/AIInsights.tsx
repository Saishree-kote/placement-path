import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Zap, Target } from "lucide-react";
import GlassCard from "./GlassCard";
import ProgressBar from "./ProgressBar";

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

interface AIInsightsProps {
  analysis: ResumeAnalysisResult;
  isLoading?: boolean;
}

const AIInsights = ({ analysis, isLoading = false }: AIInsightsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg" />
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6"
      >
        {/* Overall Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI-Powered Score</p>
                  <p className="text-lg font-semibold text-foreground">Resume Quality Assessment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold gradient-text">{analysis.overallScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.overallScore >= 80
                    ? "Excellent"
                    : analysis.overallScore >= 60
                      ? "Good"
                      : "Needs Work"}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <h3 className="text-base font-semibold text-foreground">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {weakness}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        {/* Detailed Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                AI-Generated Improvement Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.detailedSuggestions.map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{suggestion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Improvement Priorities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-secondary" />
              <h3 className="text-base font-semibold text-foreground">Priority Improvement Plan</h3>
            </div>
            <div className="space-y-4">
              {analysis.improvementPriorities.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-l-4 border-secondary/30 pl-4 py-2"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        Priority {item.priority}: {item.area}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{item.action}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-secondary/10 text-xs font-semibold text-secondary whitespace-nowrap">
                      {item.impact}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h3 className="text-base font-semibold text-foreground">Recommended Skills to Add</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.skillGaps.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Industry Insights & Career Advice */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="h-full border-primary/10">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <TrendingUp className="w-4 h-4" />
                <h3 className="text-base font-semibold">Industry Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.industryInsights}
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="h-full border-secondary/10">
              <div className="flex items-center gap-2 mb-4 text-secondary">
                <Target className="w-4 h-4" />
                <h3 className="text-base font-semibold">Career Roadmap</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.careerAdvice}
              </p>
            </GlassCard>
          </motion.div>
        </div>

        <div className="flex justify-center pt-4 opacity-50">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-[10px] font-medium tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-secondary" />
            Analysis Powered by Gemini 1.5 Pro
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIInsights;
