import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import { skills } from "@/lib/dummyData";

const levelLabel = (v: number) => (v >= 80 ? "Advanced" : v >= 60 ? "Intermediate" : "Beginner");
const levelColor = (v: number) => (v >= 80 ? "text-secondary" : v >= 60 ? "text-primary" : "text-accent");

const SkillTracker = () => {
  return (
    <div>
      <DashboardNavbar title="Skill Tracker" />
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
