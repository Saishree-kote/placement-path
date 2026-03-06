import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, FileText, Shield, Sparkles, Target, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BarChart3, title: "Skill Analytics", desc: "Track your technical and soft skills with intelligent scoring" },
  { icon: FileText, title: "Resume Analyzer", desc: "AI-powered resume analysis with actionable improvement tips" },
  { icon: Brain, title: "Aptitude Practice", desc: "Timed practice tests with detailed performance analytics" },
  { icon: Target, title: "Company Matching", desc: "See which companies match your profile and eligibility" },
  { icon: Shield, title: "Mock Interviews", desc: "Practice with realistic interview simulations" },
  { icon: Sparkles, title: "Smart Insights", desc: "Personalized recommendations to boost your readiness" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-navbar fixed top-0 w-full z-50 px-6 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">PlacePrep</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate("/login")} className="btn-glow rounded-xl bg-primary text-primary-foreground">
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Smart Placement Preparation
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Track Your Placement{" "}
              <span className="gradient-text">Readiness</span> with Intelligence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Analyze your skills, practice aptitude, optimize your resume, and discover which companies match your profile — all in one platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="btn-glow rounded-xl bg-primary text-primary-foreground px-8 h-12 text-base font-semibold"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl px-8 h-12 text-base font-semibold border-border/50"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 glass-card p-2 max-w-4xl mx-auto"
          >
            <div className="rounded-xl bg-muted/50 h-80 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 w-full">
                {[82, 72, 78].map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    className="glass-card p-5 text-center"
                  >
                    <div className="text-3xl font-bold gradient-text">{val}%</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {["Readiness", "Resume", "Aptitude"][i]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Get Placed</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A comprehensive toolkit designed to maximize your placement success
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Preparing?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of students who are tracking their placement readiness.</p>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="btn-glow rounded-xl bg-primary text-primary-foreground px-8 h-12 text-base font-semibold"
            >
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 PlacePrep. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
