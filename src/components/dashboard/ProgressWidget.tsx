import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
    RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Flame, TrendingUp, Calendar, Target } from "lucide-react";

interface WeeklyData {
    day: string;
    score: number;
    tests: number;
}

interface ProgressData {
    readinessScore: number;
    weeklyData: WeeklyData[];
    streakDays: number;
    totalTests: number;
    avgScore: number;
    threshold: number;
}

const THRESHOLD = 70;

const StatMini = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) => (
    <div className="bg-muted/30 rounded-xl p-2">
        <div className="flex items-center gap-1 mb-1">
            {icon}
            <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
        <p className="text-sm font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
);

const ProgressWidget = () => {
    const { supabaseUser } = useAuth();
    const [data, setData] = useState<ProgressData>({
        readinessScore: 0,
        weeklyData: [],
        streakDays: 0,
        totalTests: 0,
        avgScore: 0,
        threshold: THRESHOLD,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabaseUser) return;
        fetchData();
    }, [supabaseUser]);

    const fetchData = async () => {
        if (!supabaseUser) return;
        setLoading(true);

        const { data: profile } = await supabase
            .from("profiles")
            .select("readiness_score")
            .eq("id", supabaseUser.id)
            .single();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const { data: attempts } = await supabase
            .from("aptitude_attempts")
            .select("score, total, attempted_at")
            .eq("user_id", supabaseUser.id)
            .gte("attempted_at", sevenDaysAgo.toISOString())
            .order("attempted_at", { ascending: true });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyMap: Record<string, { scores: number[]; tests: number }> = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = days[d.getDay()];
            weeklyMap[key] = { scores: [], tests: 0 };
        }

        (attempts || []).forEach((a) => {
            const day = days[new Date(a.attempted_at).getDay()];
            if (weeklyMap[day]) {
                const pct = Math.round(((a.score || 0) / (a.total || 1)) * 100);
                weeklyMap[day].scores.push(pct);
                weeklyMap[day].tests += 1;
            }
        });

        const weeklyData: WeeklyData[] = Object.entries(weeklyMap).map(([day, val]) => ({
            day,
            score: val.scores.length ? Math.round(val.scores.reduce((a, b) => a + b, 0) / val.scores.length) : 0,
            tests: val.tests,
        }));

        const calculateStreak = (att: { attempted_at: string }[]) => {
            if (!att.length) return 0;
            const uniqueDays = new Set(att.map((a) => new Date(a.attempted_at).toDateString()));
            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 30; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                if (uniqueDays.has(d.toDateString())) streak++;
                else break;
            }
            return streak;
        };

        const streak = calculateStreak(attempts || []);
        localStorage.setItem("aptitude_streak", String(streak));

        const allScores = (attempts || []).map((a) => Math.round(((a.score || 0) / (a.total || 1)) * 100));
        const avg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

        setData({
            readinessScore: profile?.readiness_score || 0,
            weeklyData,
            streakDays: streak,
            totalTests: attempts?.length || 0,
            avgScore: avg,
            threshold: THRESHOLD,
        });
        setLoading(false);
    };

    const radialData = [
        { name: "Score", value: data.readinessScore, fill: "#6366f1" },
        { name: "Target", value: THRESHOLD, fill: "#e2e8f0" },
    ];

    const scoreColor = data.readinessScore >= 75 ? "#22c55e" : data.readinessScore >= 50 ? "#f59e0b" : "#ef4444";

    if (loading) {
        return (
            <div className="glass-card p-5 rounded-2xl animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-32 bg-muted rounded" />
            </div>
        );
    }

    return (
        <div className="glass-card p-5 rounded-2xl space-y-5 flex flex-col xl:flex-row gap-6">
            <div className="flex-1 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-foreground">Progress Tracker</h3>
                            <p className="text-xs text-muted-foreground">This week's performance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600">{data.streakDays}d</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" data={radialData} startAngle={90} endAngle={-270}>
                                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#e2e8f0" }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span className="text-2xl font-bold" style={{ color: scoreColor }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                {data.readinessScore}
                            </motion.span>
                            <span className="text-[10px] text-muted-foreground">/ 100</span>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <StatMini icon={<Target className="w-3.5 h-3.5 text-indigo-500" />} label="Target" value={`${THRESHOLD}`} sub="readiness" />
                        <StatMini icon={<TrendingUp className="w-3.5 h-3.5 text-green-500" />} label="Avg Score" value={`${data.avgScore}%`} sub="this week" />
                        <StatMini icon={<Calendar className="w-3.5 h-3.5 text-blue-500" />} label="Tests Done" value={String(data.totalTests)} sub="this week" />
                        <StatMini icon={<Flame className="w-3.5 h-3.5 text-orange-500" />} label="Streak" value={`${data.streakDays}d`} sub="in a row" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Readiness threshold: {THRESHOLD}</span>
                    <span className={`font-semibold ${data.readinessScore >= THRESHOLD ? "text-green-500" : "text-orange-500"}`}>
                        {data.readinessScore >= THRESHOLD ? "✓ Target reached!" : `${THRESHOLD - data.readinessScore} pts to go`}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-h-[160px] flex flex-col justify-end">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Weekly aptitude scores
                </p>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.weeklyData} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(val: number) => [`${val}%`, "Score"]} />
                            <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressWidget;