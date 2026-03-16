import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Trophy, Star, Lock, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BADGES = [
  { id: "first_step", name: "First Step", description: "Complete your profile setup", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30", condition: (s: any) => s.profileComplete },
  { id: "resume_ready", name: "Resume Ready", description: "Analyze your resume with AI", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30", condition: (s: any) => s.resumeAnalyzed },
  { id: "first_test", name: "Test Taker", description: "Complete your first aptitude test", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30", condition: (s: any) => s.aptitudeAttempts >= 1 },
  { id: "five_tests", name: "Practice Pro", description: "Complete 5 aptitude tests", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30", condition: (s: any) => s.aptitudeAttempts >= 5 },
  { id: "streak_7", name: "7-Day Streak", description: "Practice 7 days in a row", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30", condition: (s: any) => s.streakDays >= 7 },
  { id: "score_50", name: "Halfway There", description: "Reach readiness score of 50", color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-900/30", condition: (s: any) => s.readinessScore >= 50 },
  { id: "score_75", name: "Almost Ready", description: "Reach readiness score of 75", color: "text-pink-600", bgColor: "bg-pink-100 dark:bg-pink-900/30", condition: (s: any) => s.readinessScore >= 75 },
  { id: "top_scorer", name: "Top Scorer", description: "Reach readiness score of 90+", color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", condition: (s: any) => s.readinessScore >= 90 },
];

const BadgeSystem = () => {
  const { supabaseUser } = useAuth();
  const { toast } = useToast();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (supabaseUser) fetchStatsAndBadges();
  }, [supabaseUser]);

  const fetchStatsAndBadges = async () => {
    if (!supabaseUser) return;
    const { data: profile } = await supabase.from("profiles").select("readiness_score, badges, full_name, skills, college").eq("id", supabaseUser.id).single();
    const { count } = await supabase.from("aptitude_attempts").select("*", { count: "exact", head: true }).eq("user_id", supabaseUser.id);
    const streak = parseInt(localStorage.getItem("aptitude_streak") || "0");
    const currentStats = {
      aptitudeAttempts: count || 0,
      readinessScore: profile?.readiness_score || 0,
      streakDays: streak,
      profileComplete: !!(profile?.full_name && profile?.skills?.length > 0 && profile?.college),
      resumeAnalyzed: localStorage.getItem("resume_analyzed_" + supabaseUser.id) === "true",
    };
    const alreadyEarned: string[] = profile?.badges || [];
    const newlyEarned = BADGES.filter((b) => b.condition(currentStats) && !alreadyEarned.includes(b.id)).map((b) => b.id);
    const allEarned = [...new Set([...alreadyEarned, ...newlyEarned])];
    setEarnedBadges(allEarned);
    if (newlyEarned.length > 0) {
      await supabase.from("profiles").update({ badges: allEarned }).eq("id", supabaseUser.id);
      newlyEarned.forEach((id) => {
        const b = BADGES.find((b) => b.id === id);
        if (b) toast({ title: "Badge Unlocked: " + b.name, description: b.description });
      });
    }
  };

  const handleShare = (badge: typeof BADGES[0]) => {
    const text = "I earned the " + badge.name + " badge on PlacePrep!";
    if (navigator.share) navigator.share({ title: "PlacePrep Badge", text });
    else { navigator.clipboard.writeText(text); toast({ title: "Copied!", description: "Share your achievement!" }); }
  };

  const displayBadges = showAll ? BADGES : BADGES.slice(0, 4);
  const earnedCount = earnedBadges.length;

  return (
    <div className="glass-card p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Achievements</h3>
            <p className="text-xs text-muted-foreground">{earnedCount}/{BADGES.length} unlocked</p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: BADGES.length }).map((_, i) => (
            <div key={i} className={"w-1.5 h-1.5 rounded-full transition-colors " + (i < earnedCount ? "bg-yellow-500" : "bg-muted")} />
          ))}
        </div>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" initial={{ width: 0 }} animate={{ width: (earnedCount / BADGES.length * 100) + "%" }} transition={{ duration: 1, ease: "easeOut" }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence>
          {displayBadges.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className={"relative p-3 rounded-xl border transition-all group " + (isEarned ? badge.bgColor + " border-transparent" : "bg-muted/20 border-border/30 opacity-50")}>
                <div className="flex items-start gap-2">
                  <div className={"mt-0.5 " + (isEarned ? badge.color : "text-muted-foreground")}>
                    {isEarned ? <Star className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={"text-xs font-semibold leading-tight " + (isEarned ? "text-foreground" : "text-muted-foreground")}>{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.description}</p>
                  </div>
                </div>
                {isEarned && (
                  <button onClick={() => handleShare(badge)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Share2 className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {BADGES.length > 4 && (
        <button onClick={() => setShowAll(!showAll)} className="w-full mt-3 text-xs text-primary hover:underline text-center">
          {showAll ? "Show less" : "Show all " + BADGES.length + " badges"}
        </button>
      )}
    </div>
  );
};

export default BadgeSystem;