import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  variant?: "primary" | "secondary" | "accent";
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

const variantClass = {
  primary: "progress-bar-fill",
  secondary: "progress-bar-fill progress-bar-secondary",
  accent: "progress-bar-fill progress-bar-accent",
};

const ProgressBar = ({ value, max = 100, label, variant = "primary", showValue = true, size = "md" }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full space-y-1.5">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showValue && <span className="text-sm font-medium text-muted-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-muted ${sizeMap[size]}`}>
        <motion.div
          className={`${variantClass[variant]} ${sizeMap[size]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
