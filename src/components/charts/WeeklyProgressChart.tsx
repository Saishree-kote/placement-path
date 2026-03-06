import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import GlassCard from "../dashboard/GlassCard";

const data = [
  { week: "W1", score: 45, aptitude: 50, resume: 30 },
  { week: "W2", score: 52, aptitude: 55, resume: 45 },
  { week: "W3", score: 58, aptitude: 62, resume: 55 },
  { week: "W4", score: 65, aptitude: 68, resume: 60 },
  { week: "W5", score: 70, aptitude: 72, resume: 70 },
  { week: "W6", score: 74, aptitude: 78, resume: 75 },
  { week: "W7", score: 78, aptitude: 82, resume: 78 },
  { week: "W8", score: 82, aptitude: 85, resume: 82 },
];

const WeeklyProgressChart = () => {
  return (
    <GlassCard delay={0.3}>
      <h3 className="text-base font-semibold text-foreground mb-4">Weekly Progress</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(234, 89%, 60%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(234, 89%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAptitude" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: "hsla(0, 0%, 100%, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 4px 24px hsla(234, 50%, 40%, 0.1)",
            }}
          />
          <Area type="monotone" dataKey="score" stroke="hsl(234, 89%, 60%)" fill="url(#colorScore)" strokeWidth={2.5} dot={false} />
          <Area type="monotone" dataKey="aptitude" stroke="hsl(160, 84%, 39%)" fill="url(#colorAptitude)" strokeWidth={2.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-0.5 rounded bg-primary" /> Overall Score
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-0.5 rounded bg-secondary" /> Aptitude
        </div>
      </div>
    </GlassCard>
  );
};

export default WeeklyProgressChart;
