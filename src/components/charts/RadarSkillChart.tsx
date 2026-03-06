import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import GlassCard from "../dashboard/GlassCard";

const data = [
  { skill: "DSA", value: 78, fullMark: 100 },
  { skill: "System Design", value: 65, fullMark: 100 },
  { skill: "DBMS", value: 82, fullMark: 100 },
  { skill: "OS", value: 70, fullMark: 100 },
  { skill: "Networks", value: 60, fullMark: 100 },
  { skill: "OOP", value: 88, fullMark: 100 },
];

const RadarSkillChart = () => {
  return (
    <GlassCard delay={0.2}>
      <h3 className="text-base font-semibold text-foreground mb-4">Skill Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="hsl(234, 89%, 60%)"
            fill="hsl(234, 89%, 60%)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default RadarSkillChart;
