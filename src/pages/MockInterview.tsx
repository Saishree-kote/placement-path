import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MessageSquare, Send, Sparkles, User, Bot, RefreshCw, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const dashboardModes = [
  { id: "video", icon: Video, title: "Video Interview", desc: "Practice with video-based mock interviews", color: "primary" },
  { id: "text", icon: MessageSquare, title: "Text Interview", desc: "Answer common interview questions in text", color: "secondary" },
  { id: "voice", icon: Mic, title: "Voice Interview", desc: "Practice your verbal communication skills", color: "accent" },
];

const mockQuestion = "Tell me about a challenging technical problem you solved recently and how you approached it.";

const AUTO_QUESTIONS = [
  "Explain the difference between synchronous and asynchronous programming.",
  "What is the time complexity of binary search and why?",
  "Describe a project where you worked in a team and faced a conflict. How did you resolve it?",
  "What is the difference between REST and GraphQL APIs?",
  "How would you optimize a slow database query?",
  "Explain the concept of closures in JavaScript.",
  "What are the SOLID principles in software design?",
];

const MockInterview = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Scheduler state
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [scheduledSlots, setScheduledSlots] = useState<{ date: string; time: string; questions: string[] }[]>(() => {
    try { return JSON.parse(localStorage.getItem("mock_slots") || "[]"); } catch { return []; }
  });

  const handleStart = (mode: string) => setActiveMode(mode);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFeedback("Excellent structure! You used the STAR method effectively. Your technical explanation was clear. Suggestion: Mention more specifically the impact (metrics) of your solution.");
    }, 2000);
  };

  const handleReset = () => {
    setActiveMode(null);
    setAnswer("");
    setFeedback(null);
  };

  const handleSchedule = () => {
    if (!selectedDate) return;
    const randomQuestions = AUTO_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 3);
    const slot = {
      date: selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      time: selectedTime,
      questions: randomQuestions,
    };
    const updated = [...scheduledSlots, slot];
    setScheduledSlots(updated);
    localStorage.setItem("mock_slots", JSON.stringify(updated));
    setSelectedDate(undefined);
    setShowScheduler(false);
  };

  const removeSlot = (index: number) => {
    const updated = scheduledSlots.filter((_, i) => i !== index);
    setScheduledSlots(updated);
    localStorage.setItem("mock_slots", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar title="Mock Interview Simulator" />
      <div className="p-6">
        <div id="mock-scheduler" />

        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-6">

              <GlassCard className="text-center mb-6 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
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
                    <Button onClick={() => handleStart(mode.id)} className={`rounded-xl bg-${mode.color} text-white btn-glow w-full font-semibold`}>
                      Start Session
                    </Button>
                  </GlassCard>
                ))}
              </div>

              {/* ✅ Mock Interview Scheduler */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Mock Interview Scheduler</h3>
                      <p className="text-xs text-muted-foreground">Book self-timed practice slots</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowScheduler(!showScheduler)} variant="outline" className="rounded-xl text-xs">
                    {showScheduler ? "Cancel" : "+ Schedule Slot"}
                  </Button>
                </div>

                {/* Calendar picker */}
                <AnimatePresence>
                  {showScheduler && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-6 p-4 bg-muted/20 rounded-xl mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium">Pick a date</p>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-xl border border-border"
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pick a time
                            </p>
                            <input
                              type="time"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground"
                            />
                          </div>
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-xs font-medium text-foreground mb-1">Auto-generated questions:</p>
                            <p className="text-xs text-muted-foreground">3 practice questions will be generated when you schedule</p>
                          </div>
                          <Button onClick={handleSchedule} disabled={!selectedDate} className="rounded-xl mt-auto">
                            <CalendarDays className="w-4 h-4 mr-2" /> Confirm Slot
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scheduled slots */}
                {scheduledSlots.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No slots scheduled yet. Book your first mock interview!</p>
                ) : (
                  <div className="space-y-3">
                    {scheduledSlots.map((slot, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border border-border bg-muted/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-foreground">{slot.date} at {slot.time}</span>
                          </div>
                          <button onClick={() => removeSlot(i)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                            Remove
                          </button>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Practice questions:</p>
                        <ul className="space-y-1">
                          {slot.questions.map((q, qi) => (
                            <li key={qi} className="text-xs text-foreground flex items-start gap-1.5">
                              <span className="text-primary font-bold mt-0.5">{qi + 1}.</span> {q}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}
              </GlassCard>

            </motion.div>
          ) : activeMode === "text" ? (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-2">
                <Button onClick={handleReset} variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-4 h-4 mr-2" /> Change Mode
                </Button>
                <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
                  Live Text Session
                </div>
              </div>

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
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your response here..."
                    className="w-full min-h-[150px] p-6 pr-14 rounded-3xl bg-muted/30 border border-border/50 focus:border-primary/50 transition-all outline-none text-sm resize-none" />
                  <Button onClick={handleSubmit} disabled={analyzing || !answer.trim()}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl p-0 bg-primary text-white btn-glow">
                    {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="placeholder" className="max-w-md mx-auto text-center">
              <GlassCard>
                <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">The {activeMode} interface is under development.</p>
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