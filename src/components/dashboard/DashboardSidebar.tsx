import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Brain, BarChart3, Building2,
  Users, Settings, GraduationCap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/resume", label: "Resume Analyzer", icon: FileText },
  { path: "/dashboard/aptitude", label: "Aptitude Practice", icon: Brain },
  { path: "/dashboard/skills", label: "Skill Tracker", icon: BarChart3 },
  { path: "/dashboard/companies", label: "Company Eligibility", icon: Building2 },
  { path: "/dashboard/interview", label: "Mock Interview", icon: Users },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-sidebar fixed left-0 top-0 h-screen z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-sm text-foreground whitespace-nowrap overflow-hidden"
            >
              PlacePrep
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 rounded-r-full bg-primary"
                  transition={{ duration: 0.3 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};

export default DashboardSidebar;
