import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, CheckCircle } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { aptitudeQuestions } from "@/lib/dummyData";

const AptitudeTest = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(aptitudeQuestions.length).fill(null));
  const [timer, setTimer] = useState(300);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  const question = aptitudeQuestions[currentQ];
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progress = ((currentQ + 1) / aptitudeQuestions.length) * 100;

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    if (currentQ < aptitudeQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setCompleted(true);
    }
  };

  const score = answers.filter((a, i) => a === aptitudeQuestions[i].correct).length;

  return (
    <div>
      <DashboardNavbar title="Aptitude Practice" />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Timer & Progress */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQ + 1} of {aptitudeQuestions.length}
            </span>
            <div className="flex items-center gap-2 text-sm font-mono">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={`font-semibold ${timer < 60 ? "text-destructive" : "text-foreground"}`}>
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full progress-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </GlassCard>

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  {question.category}
                </span>
                <h2 className="text-lg font-semibold text-foreground mb-6">{question.question}</h2>
                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        selected === i
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{opt}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={selected === null}
                    className="rounded-xl bg-primary text-primary-foreground btn-glow"
                  >
                    {currentQ < aptitudeQuestions.length - 1 ? (
                      <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard className="text-center">
                <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Test Complete!</h2>
                <p className="text-4xl font-bold gradient-text mb-2">
                  {score}/{aptitudeQuestions.length}
                </p>
                <p className="text-muted-foreground">
                  {score === aptitudeQuestions.length ? "Perfect score!" : "Keep practicing to improve."}
                </p>
                <Button
                  onClick={() => { setCurrentQ(0); setSelected(null); setAnswers(new Array(aptitudeQuestions.length).fill(null)); setCompleted(false); setTimer(300); }}
                  className="mt-6 rounded-xl bg-primary text-primary-foreground btn-glow"
                >
                  Try Again
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AptitudeTest;
