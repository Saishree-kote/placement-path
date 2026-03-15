import { Award, FileText, Brain, BarChart3 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatCard from "@/components/dashboard/StatCard";
import RadarSkillChart from "@/components/charts/RadarSkillChart";
import WeeklyProgressChart from "@/components/charts/WeeklyProgressChart";
import ProgressBar from "@/components/dashboard/ProgressBar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBoostScore = () => {
    navigate("/dashboard/skills");
  };

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">Active Application Timeline</h3>
                  <p className="text-xs text-muted-foreground">Real-time status of your top applications</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 font-bold"
                  onClick={() => navigate("/dashboard/applications")}
                >
                  Manage All
                </Button>
              </div>
              <div className="space-y-6">
                {[
                  { company: "Google", milestone: "Interview Round 2", time: "Tomorrow, 10:00 AM", status: "upcoming" },
                  { company: "Microsoft", milestone: "Online Assessment", time: "Expired", status: "expired" },
                  { company: "Amazon", milestone: "Resume Shortlisted", time: "2 days ago", status: "completed" }
                ].map((event, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== 2 && <div className="absolute left-2.5 top-7 w-0.5 h-10 bg-border/50" />}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${event.status === 'upcoming' ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' :
                      event.status === 'expired' ? 'bg-accent' : 'bg-secondary'
                      }`}>
                      <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground">{event.company} • {event.milestone}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-secondary/5 via-transparent to-transparent border-secondary/10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-foreground">Smart Company Match</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-lg">AI Predicted</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Google", role: "Software Engineer", match: 92, tags: ["React", "Algorithms"] },
                  { name: "Adobe", role: "Frontend Engineer", match: 95, tags: ["React", "CSS"] },
                ].map((comp) => (
                  <button
                    key={comp.name}
                    onClick={() => navigate("/dashboard/companies")}
                    className="p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group text-left w-full"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{comp.name}</h4>
                        <p className="text-xs text-muted-foreground">{comp.role}</p>
                      </div>
                      <span className="text-xs font-bold text-secondary">{comp.match}% Match</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {comp.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-background border border-border/50 text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">Readiness Score</h3>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-foreground leading-none">82</span>
                <span className="text-sm text-muted-foreground mb-1">/ 100</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">You are in the top 15% of candidates for Engineering roles this month.</p>
              <Button
                className="w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                onClick={handleBoostScore}
              >
                Boost Score
              </Button>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-bold text-foreground mb-5">Skill Breakdown</h3>
              <div className="space-y-4">
                <ProgressBar value={82} label="Programming" variant="primary" />
                <ProgressBar value={75} label="Data Structures" variant="secondary" />
                <ProgressBar value={68} label="Logical Reasoning" variant="accent" />
                <ProgressBar value={55} label="System Design" variant="primary" />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
