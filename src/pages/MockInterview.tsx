import { Video, Mic, MessageSquare } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";

const modes = [
  { icon: Video, title: "Video Interview", desc: "Practice with video-based mock interviews", color: "primary" },
  { icon: MessageSquare, title: "Text Interview", desc: "Answer common interview questions in text", color: "secondary" },
  { icon: Mic, title: "Voice Interview", desc: "Practice your verbal communication skills", color: "accent" },
];

const MockInterview = () => {
  return (
    <div>
      <DashboardNavbar title="Mock Interview" />
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Practice Makes Perfect</h2>
            <p className="text-muted-foreground">Choose an interview mode to start practicing</p>
          </GlassCard>
          <div className="grid md:grid-cols-3 gap-5">
            {modes.map((mode, i) => (
              <GlassCard key={mode.title} delay={i * 0.1} className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-${mode.color}/10 flex items-center justify-center mx-auto mb-4`}>
                  <mode.icon className={`w-7 h-7 text-${mode.color}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{mode.desc}</p>
                <Button className="rounded-xl bg-primary text-primary-foreground btn-glow w-full" size="sm">
                  Start
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
