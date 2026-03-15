import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import { skills } from "@/lib/dummyData";
import { useToast } from "@/hooks/use-toast";

// Map skill resource names to real URLs
const RESOURCE_URLS: Record<string, string> = {
  "LeetCode": "https://leetcode.com",
  "CSES": "https://cses.fi/problemset/",
  "GeeksforGeeks": "https://www.geeksforgeeks.org",
  "Coursera": "https://www.coursera.org",
  "freeCodeCamp": "https://www.freecodecamp.org",
  "MDN Docs": "https://developer.mozilla.org",
  "JavaScript.info": "https://javascript.info",
  "TypeScript Docs": "https://www.typescriptlang.org/docs/",
  "React Docs": "https://react.dev",
  "Node Docs": "https://nodejs.org/en/docs/",
  "PostgreSQL": "https://www.postgresql.org/docs/",
  "W3Schools SQL": "https://www.w3schools.com/sql/",
  "MongoDB Docs": "https://www.mongodb.com/docs/",
  "Git Book": "https://git-scm.com/book/en/v2",
  "GitHub Docs": "https://docs.github.com",
  "Docker Docs": "https://docs.docker.com",
  "AWS Training": "https://aws.amazon.com/training/",
};

const getUrl = (resource: string) => RESOURCE_URLS[resource] ?? `https://www.google.com/search?q=${encodeURIComponent(resource + " learning")}`;

const levelLabel = (v: number) => (v >= 80 ? "Advanced" : v >= 60 ? "Intermediate" : "Beginner");
const levelColor = (v: number) => (v >= 80 ? "text-secondary" : v >= 60 ? "text-primary" : "text-accent");

const SkillTracker = () => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  const handleResourceClick = (resourceName: string, skillName: string) => {
    const url = getUrl(resourceName);
    toast({ title: `Opening: ${resourceName}`, description: `Great resource for: ${skillName}` });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const targetRoleSkills = ["System Design", "Docker", "Node.js", "Cloud Computing", "Testing"];
  const missingSkills = targetRoleSkills.filter(s => !skills.find(sk => sk.name === s && sk.level > 50));

  return (
    <div className="min-h-screen">
      <DashboardNavbar title="Skill Tracker" />

      {/* Hero banner */}
      <div className="px-6 pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(260 80% 70% / 0.4) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsl(200 80% 60% / 0.3) 0%, transparent 50%)" }} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-foreground">Your Skill Dashboard</h2>
                <p className="text-sm text-primary-foreground/80 mt-0.5">Track progress across {skills.length} skills and discover resources</p>
              </div>
            </div>
            <Button
              onClick={handleAnalysis}
              disabled={analyzing}
              className="hidden md:flex rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-6 shadow-xl shadow-black/10"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run AI Gap Analysis
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GlassCard className="border-secondary/20 bg-secondary/5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-bold text-foreground">AI Skill Gap Analysis: <span className="text-secondary">Software Engineer (L3)</span></h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">Identified Gaps</p>
                    <div className="flex flex-wrap gap-3">
                      {missingSkills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">Personalized Suggestions</p>
                    <ul className="space-y-3">
                      <li className="flex gap-2 text-sm text-muted-foreground italic">"You are strong in React, but Software Engineer roles at top firms require System Design fundamentals. Start with 'Grokking System Design'."</li>
                      <li className="flex gap-2 text-sm text-muted-foreground italic">"Docker is becoming a standard. We recommend spending 2 weeks on Containerization basics."</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-5">
          {skills.map((skill, i) => (
            <GlassCard key={skill.name} delay={i * 0.08}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{skill.name}</h3>
                  <span className={`text-xs font-medium ${levelColor(skill.level)}`}>{levelLabel(skill.level)}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg bg-muted text-xs text-muted-foreground">{skill.category}</span>
              </div>
              <ProgressBar
                value={skill.level}
                variant={skill.level >= 80 ? "secondary" : skill.level >= 60 ? "primary" : "accent"}
              />
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <BookOpen className="w-3.5 h-3.5" /> Recommended Resources
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.resources.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleResourceClick(r, skill.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-xs font-medium cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      {r} <ExternalLink className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTracker;
