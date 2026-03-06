import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DashboardSettings = () => {
  return (
    <div>
      <DashboardNavbar title="Settings" />
      <div className="p-6 max-w-2xl">
        <GlassCard>
          <h3 className="text-base font-semibold text-foreground mb-5">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
              <Input defaultValue="John Doe" className="rounded-xl bg-muted/30 border-border/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input defaultValue="john@example.com" className="rounded-xl bg-muted/30 border-border/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">CGPA</label>
              <Input defaultValue="8.2" className="rounded-xl bg-muted/30 border-border/50" />
            </div>
            <Button className="rounded-xl bg-primary text-primary-foreground btn-glow">Save Changes</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardSettings;
