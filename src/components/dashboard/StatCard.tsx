import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import GlassCard from "./GlassCard";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "primary" | "secondary" | "accent";
  delay?: number;
}

const variantStyles = {
  primary: "from-primary/10 to-primary/5 text-primary",
  secondary: "from-secondary/10 to-secondary/5 text-secondary",
  accent: "from-accent/10 to-accent/5 text-accent",
};

const iconBg = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  accent: "bg-accent/10",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "primary", delay = 0 }: StatCardProps) => {
  return (
    <GlassCard delay={delay} className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} opacity-30 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            className="text-3xl font-bold tracking-tight text-foreground"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <span className={`text-xs font-medium ${trend.positive ? "text-secondary" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
            </span>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${iconBg[variant]}`}>
          <Icon className={`w-6 h-6 ${variantStyles[variant].split(" ").pop()}`} />
        </div>
      </div>
    </GlassCard>
  );
};

export default StatCard;
