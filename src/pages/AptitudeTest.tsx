import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, CheckCircle, Brain, Sparkles, Loader2, Play, Building, Bell, BellOff } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { generateAptitudeQuestions, AptitudeQuestion } from "@/services/aiAptitudeService";
import { useToast } from "@/hooks/use-toast";

const AptitudeTest = () => {
  const [phase, setPhase] = useState<"setup" | "loading" | "test" | "result" | "review">("setup");
  const [sessionType, setSessionType] = useState<"fixed" | "unlimited">("fixed");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  const [warnings, setWarnings] = useState(0);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderSet, setReminderSet] = useState(() => !!localStorage.getItem("aptitude_reminder"));
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: any;
    if (phase === "test") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Anti-cheat: Listen for tab changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && phase === "test") {
        setWarnings(w => {
          const newWarnings = w + 1;
          if (newWarnings > 3) {
            toast({
              title: "Test Terminated",
              description: "You left the tab too many times. Test has been cancelled.",
              variant: "destructive"
            });
            setPhase("setup");
            if (document.fullscreenElement) document.exitFullscreen().catch(console.error);
            return 0;
          } else {
            toast({
              title: "Warning!",
              description: `Please do not switch tabs. Warning ${newWarnings}/3`,
              variant: "destructive"
            });
            return newWarnings;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [phase, toast]);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.error("Fullscreen blocked", e);
      toast({
         title: "Fullscreen Required",
         description: "Please allow fullscreen to start the proctored test.",
         variant: "destructive"
      });
      // Continue anyway or block? Let's continue but they might be prompted
    }
    
    setPhase("loading");
    setWarnings(0);
    const count = sessionType === "unlimited" ? 5 : questionCount;
    const initialQuestions = await generateAptitudeQuestions(count);
    setQuestions(initialQuestions);
    setAnswers(new Array(initialQuestions.length).fill(null));
    setPhase("test");
    setTimer(0);
    setScore(0);
    setCurrentQ(0);
    setSelected(null);
  };

  const handleNext = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    if (selected === questions[currentQ].correct) setScore(s => s + 1);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else if (sessionType === "unlimited") {
      setPhase("loading");
      const moreQuestions = await generateAptitudeQuestions(5);
      setQuestions([...questions, ...moreQuestions]);
      setAnswers([...newAnswers, ...new Array(moreQuestions.length).fill(null)]);
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setPhase("test");
    } else {
      if (document.fullscreenElement) document.exitFullscreen().catch(console.error);
      setPhase("result");
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ Reminder logic
  const handleSetReminder = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast({ title: "Notifications blocked", description: "Please allow notifications in your browser settings.", variant: "destructive" });
      return;
    }

    localStorage.setItem("aptitude_reminder", reminderTime);
    setReminderSet(true);
    setShowReminderPanel(false);

    // Calculate ms until next occurrence of reminderTime
    const [hours, mins] = reminderTime.split(":").map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(hours, mins, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const msUntil = next.getTime() - now.getTime();

    setTimeout(() => {
      new Notification("PlacePrep — Daily Aptitude Reminder", {
        body: "Time for your daily aptitude practice! Keep your streak going.",
        icon: "/favicon.ico",
      });
    }, msUntil);

    toast({ title: "Reminder set!", description: "You'll be reminded daily at " + reminderTime });
  };

  const handleCancelReminder = () => {
    localStorage.removeItem("aptitude_reminder");
    setReminderSet(false);
    toast({ title: "Reminder cancelled", description: "Daily reminder has been removed." });
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar title="AI Aptitude Practice" />
      <div className="p-6 max-w-4xl mx-auto">

        <AnimatePresence mode="wait">
          {phase === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassCard className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Practice with Intelligence</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Choose your session type and let our AI generate questions matching top company patterns.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <button onClick={() => setSessionType("fixed")}
                    className={`p-6 rounded-2xl border transition-all text-left ${sessionType === "fixed" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/50 hover:border-primary/20"}`}>
                    <h3 className="font-bold text-foreground mb-1">Fixed Session</h3>
                    <p className="text-xs text-muted-foreground">Solve a specific number of questions.</p>
                  </button>
                  <button onClick={() => setSessionType("unlimited")}
                    className={`p-6 rounded-2xl border transition-all text-left ${sessionType === "unlimited" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/50 hover:border-primary/20"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-foreground">Unlimited Mode</h3>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Keep solving until you decide to stop.</p>
                  </button>
                </div>

                {sessionType === "fixed" && (
                  <div className="mb-8">
                    <p className="text-sm font-medium text-muted-foreground mb-4">How many questions?</p>
                    <div className="flex justify-center gap-3">
                      {[5, 10, 20, 30].map(count => (
                        <button key={count} onClick={() => setQuestionCount(count)}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${questionCount === count ? "bg-primary text-white border-primary" : "text-muted-foreground border-border/50 hover:border-primary/30"}`}>
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={startTest} className="rounded-xl bg-primary text-primary-foreground btn-glow px-10 h-12">
                  <Play className="w-4 h-4 mr-2" /> Start Practice
                </Button>
              </GlassCard>

              {/* ✅ Daily Reminder Card */}
              <GlassCard className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${reminderSet ? "bg-green-500/10" : "bg-muted"}`}>
                      {reminderSet ? <Bell className="w-4 h-4 text-green-500" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Daily Practice Reminder</h3>
                      <p className="text-xs text-muted-foreground">
                        {reminderSet ? "Reminder set at " + localStorage.getItem("aptitude_reminder") : "Never miss a practice session"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminderSet && (
                      <Button variant="ghost" onClick={handleCancelReminder} className="text-xs text-destructive hover:text-destructive rounded-xl h-8">
                        Cancel
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setShowReminderPanel(!showReminderPanel)} className="rounded-xl text-xs h-8">
                      {reminderSet ? "Change" : "Set Reminder"}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {showReminderPanel && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <label className="text-sm text-foreground">Remind me daily at:</label>
                        </div>
                        <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
                          className="h-9 px-3 rounded-xl border border-border bg-background text-sm text-foreground" />
                        <Button onClick={handleSetReminder} className="rounded-xl h-9 text-sm">
                          <Bell className="w-3.5 h-3.5 mr-1.5" /> Confirm
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium text-foreground">AI is generating questions...</p>
              <p className="text-sm text-muted-foreground italic mt-2">Fetching patterns from top companies</p>
            </motion.div>
          )}

          {phase === "test" && questions[currentQ] && (
            <motion.div key="test" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <GlassCard className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {questions[currentQ].category}
                        </span>
                        {questions[currentQ].company && (
                          <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {questions[currentQ].company.name} Pattern
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatTime(timer)}
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground leading-relaxed mb-8">
                      {questions[currentQ].question}
                    </h2>
                    <div className="space-y-3">
                      {questions[currentQ].options.map((opt, i) => (
                        <button key={i} onClick={() => setSelected(i)}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${selected === i ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/50 hover:border-primary/20"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${selected === i ? "bg-primary text-white border-primary" : "text-muted-foreground border-border/50"}`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className="text-sm text-foreground font-medium">{opt}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Question {currentQ + 1} {sessionType === "fixed" ? `of ${questions.length}` : "(Unlimited Mode)"}
                      </div>
                      <div className="flex gap-3">
                        {sessionType === "unlimited" && (
                          <Button variant="outline" onClick={() => {
                            if (document.fullscreenElement) document.exitFullscreen().catch(console.error);
                            setPhase("result");
                          }} className="rounded-xl border-border/50">Finish Now</Button>
                        )}
                        <Button onClick={handleNext} disabled={selected === null} className="rounded-xl bg-primary text-primary-foreground btn-glow px-8">
                          {currentQ < questions.length - 1 || sessionType === "unlimited" ? "Next" : "Submit"}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
                <div className="w-full md:w-64 space-y-4">
                  <GlassCard className="py-4 px-6 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Current Score</p>
                    <p className="text-3xl font-bold gradient-text">{score}</p>
                  </GlassCard>
                  {sessionType === "fixed" && (
                    <div className="px-4">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full bg-primary" animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
              <GlassCard className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Practice Summary</h2>
                <div className="flex justify-center gap-10 my-8">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Score</p>
                    <p className="text-4xl font-bold text-foreground">{score}</p>
                  </div>
                  {sessionType === "fixed" && questions.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Accuracy</p>
                      <p className="text-4xl font-bold text-foreground">{Math.round((score / questions.length) * 100)}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Time</p>
                    <p className="text-4xl font-bold text-foreground">{formatTime(timer)}</p>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setPhase("setup")} className="rounded-xl bg-primary text-primary-foreground btn-glow px-10 h-10">Try Again</Button>
                  <Button onClick={() => { setPhase("review"); setCurrentQ(0); }} variant="outline" className="rounded-xl border-border/50 px-10">Review Answers</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {phase === "review" && questions[currentQ] && (
            <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground">Review Answers</h3>
                <Button onClick={() => setPhase("result")} variant="ghost" className="text-muted-foreground">Back to Summary</Button>
              </div>
              <div className="flex justify-center flex-wrap gap-2 mb-8 p-4 rounded-2xl bg-muted/10 border border-border/50">
                {questions.map((_, i) => {
                  const isCorrect = answers[i] === questions[i].correct;
                  const isCurrent = currentQ === i;
                  return (
                    <motion.button key={i} onClick={() => setCurrentQ(i)} initial={false}
                      animate={{ scale: isCurrent ? 1.2 : 1, opacity: isCurrent ? 1 : 0.6 }}
                      whileHover={{ scale: 1.3, opacity: 1 }}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCurrent ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""} ${isCorrect ? "bg-secondary/10 border-secondary text-secondary" : "bg-destructive/10 border-destructive text-destructive"}`}>
                      {i + 1}
                    </motion.button>
                  );
                })}
              </div>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">{questions[currentQ].category}</span>
                    {questions[currentQ].company && (
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20">{questions[currentQ].company.name}</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">Question {currentQ + 1} of {questions.length}</div>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-6">{questions[currentQ].question}</h2>
                <div className="space-y-3 mb-8">
                  {questions[currentQ].options.map((opt, i) => {
                    const isCorrect = i === questions[currentQ].correct;
                    const isUserSelected = i === answers[currentQ];
                    const isWrongSelection = isUserSelected && !isCorrect;
                    return (
                      <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${isCorrect ? "border-secondary/50 bg-secondary/5 ring-1 ring-secondary/20" : isWrongSelection ? "border-destructive/50 bg-destructive/5 ring-1 ring-destructive/20" : "border-border/20 opacity-70"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${isCorrect ? "bg-secondary text-white border-secondary" : isWrongSelection ? "bg-destructive text-white border-destructive" : "text-muted-foreground border-border/50"}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                        {isCorrect && <CheckCircle className="w-4 h-4 text-secondary" />}
                        {isWrongSelection && <div className="text-[10px] font-bold text-destructive uppercase">Your Choice</div>}
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                    <Brain className="w-4 h-4 text-primary" /> AI Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{questions[currentQ].explanation}</p>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)} className="rounded-xl border-border/50">Previous</Button>
                  <Button disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ(currentQ + 1)} className="rounded-xl border-border/50">Next</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AptitudeTest;