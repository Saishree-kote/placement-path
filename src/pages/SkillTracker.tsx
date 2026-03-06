import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Sparkles } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import { skills } from "@/lib/dummyData";

const levelLabel = (v: number) => (v >= 80 ? "Advanced" : v >= 60 ? "Intermediate" : "Beginner");
const levelColor = (v: number) => (v >= 80 ? "text-secondary" : v >= 60 ? "text-primary" : "text-accent");

const SkillTracker = () => {
  return (
    <div className="min-h-screen">
      <DashboardNavbar title="Skill Tracker" showBack />

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
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-foreground">Your Skill Dashboard</h2>
              <p className="text-sm text-primary-foreground/80 mt-0.5">Track progress across {skills.length} skills and discover resources</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
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
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-xs font-medium cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      {r} <ExternalLink className="w-3 h-3" />
                    </span>
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
