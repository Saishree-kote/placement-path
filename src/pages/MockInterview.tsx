import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MessageSquare, Send, Sparkles, User, Bot, RefreshCw } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";

const dashboardModes = [
  { id: 'video', icon: Video, title: "Video Interview", desc: "Practice with video-based mock interviews", color: "primary" },
  { id: 'text', icon: MessageSquare, title: "Text Interview", desc: "Answer common interview questions in text", color: "secondary" },
  { id: 'voice', icon: Mic, title: "Voice Interview", desc: "Practice your verbal communication skills", color: "accent" },
];

const mockQuestion = "Tell me about a challenging technical problem you solved recently and how you approached it.";

const MockInterview = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStart = (mode: string) => {
    setActiveMode(mode);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFeedback("Excellent structure! You used the STAR method effectively. Your technical explanation of the 'Caching Layer' was clear. Suggestion: Mention more specifically the 'Impact' (metrics) of your solution.");
    }, 2000);
  };

  const handleReset = () => {
    setActiveMode(null);
    setAnswer("");
    setFeedback(null);
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar title="Mock Interview Simulator" />
      <div className="p-6">
        <div id="mock-scheduler" />
        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <GlassCard className="text-center mb-10 p-10 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                <h2 className="text-3xl font-bold text-foreground mb-3">Master Your Interview Skills</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Select a mode to begin your personalized practice session. Our AI will evaluate your performance and provide actionable feedback.</p>
              </GlassCard>

              <div className="grid md:grid-cols-3 gap-6">
                {dashboardModes.map((mode, i) => (
                  <GlassCard key={mode.id} delay={i * 0.1} className="text-center group hover:border-primary/30 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-${mode.color}/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                      <mode.icon className={`w-8 h-8 text-${mode.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{mode.desc}</p>
                    <Button
                      onClick={() => handleStart(mode.id)}
                      className={`rounded-xl bg-${mode.color} text-white btn-glow w-full font-semibold shadow-lg shadow-${mode.color}/20`}
                    >
                      Start Session
                    </Button>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          ) : activeMode === 'text' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Button onClick={handleReset} variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-4 h-4 mr-2" /> Change Mode
                </Button>
                <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
                  Live Text Session
                </div>
              </div>

              {/* Chat-like Interface */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <GlassCard className="p-4 bg-muted/20 border-none rounded-tl-none max-w-[85%]">
                    <p className="text-sm font-semibold text-primary mb-1">AI Interviewer</p>
                    <p className="text-sm text-foreground leading-relaxed">{mockQuestion}</p>
                  </GlassCard>
                </div>

                {feedback && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    <GlassCard className="p-4 bg-secondary/5 border-secondary/20 rounded-tl-none max-w-[85%]">
                      <p className="text-sm font-semibold text-secondary mb-1">AI Feedback</p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">{feedback}</p>
                    </GlassCard>
                  </motion.div>
                )}

                {answer && (
                  <div className="flex gap-3 justify-end">
                    <GlassCard className="p-4 bg-primary text-primary-foreground border-none rounded-tr-none max-w-[85%]">
                      <p className="text-xs font-bold opacity-70 mb-1 text-right">You</p>
                      <p className="text-sm leading-relaxed">{answer}</p>
                    </GlassCard>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {!feedback && (
                <div className="relative mt-8">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full min-h-[150px] p-6 pr-14 rounded-3xl bg-muted/30 border border-border/50 focus:border-primary/50 transition-all outline-none text-sm resize-none shadow-inner"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={analyzing || !answer.trim()}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl p-0 bg-primary text-white btn-glow shadow-xl"
                  >
                    {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="max-w-md mx-auto text-center"
            >
              <GlassCard>
                <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">The {activeMode} interface is currently under development.</p>
                <Button onClick={handleReset}>Go Back</Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MockInterview;
