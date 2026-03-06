import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const GlassCard = ({ children, className = "", hover = true, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`${hover ? "glass-card-hover" : "glass-card"} p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
