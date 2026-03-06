import { Award, FileText, Brain, BarChart3 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatCard from "@/components/dashboard/StatCard";
import RadarSkillChart from "@/components/charts/RadarSkillChart";
import WeeklyProgressChart from "@/components/charts/WeeklyProgressChart";
import ProgressBar from "@/components/dashboard/ProgressBar";
import GlassCard from "@/components/dashboard/GlassCard";

const Dashboard = () => {
  return (
    <div>
      <DashboardNavbar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Placement Readiness" value="82%" icon={Award} trend={{ value: 5, positive: true }} variant="primary" delay={0} />
          <StatCard title="Resume Score" value="72%" icon={FileText} trend={{ value: 8, positive: true }} variant="secondary" delay={0.1} />
          <StatCard title="Aptitude Score" value="78%" icon={Brain} trend={{ value: 3, positive: true }} variant="accent" delay={0.15} />
          <StatCard title="Skill Score" value="75%" icon={BarChart3} trend={{ value: 2, positive: false }} variant="primary" delay={0.2} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RadarSkillChart />
          <WeeklyProgressChart />
        </div>

        {/* Quick Progress */}
        <GlassCard delay={0.4}>
          <h3 className="text-base font-semibold text-foreground mb-5">Skill Progress</h3>
          <div className="space-y-4">
            <ProgressBar value={82} label="Programming" variant="primary" />
            <ProgressBar value={75} label="Data Structures" variant="secondary" />
            <ProgressBar value={68} label="Logical Reasoning" variant="accent" />
            <ProgressBar value={55} label="Communication" variant="primary" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
