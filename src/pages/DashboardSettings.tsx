import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    college: "Example Institute of Technology",
    branch: "Computer Science & Engineering",
    cgpa: "8.2",
    gradYear: "2025",
    skills: "React, TypeScript, Node.js, Python, SQL",
    projects: "1. PlacePrep: A full-stack placement tracking system.\n2. E-Commerce API: A robust Node.js backend for digital stores.",
    certifications: "AWS Cloud Practitioner, Meta Front-End Developer",
  });

  const [privacy, setPrivacy] = useState([
    { label: "Make Profile Public", desc: "Allow recruiters to find you via search", checked: true },
    { label: "Show Readiness Score", desc: "Display your AI preparation score on your public profile", checked: true },
    { label: "Anonymize Community Posts", desc: "Hide your name on community discussions", checked: false },
  ]);

  const handleSave = () => {
    toast({ title: "Profile saved!", description: "Your changes have been saved successfully." });
  };

  const handleCancel = () => {
    setProfile({
      name: "John Doe",
      email: "john@example.com",
      college: "Example Institute of Technology",
      branch: "Computer Science & Engineering",
      cgpa: "8.2",
      gradYear: "2025",
      skills: "React, TypeScript, Node.js, Python, SQL",
      projects: "1. PlacePrep: A full-stack placement tracking system.\n2. E-Commerce API: A robust Node.js backend for digital stores.",
      certifications: "AWS Cloud Practitioner, Meta Front-End Developer",
    });
    toast({ title: "Changes discarded." });
  };

  const handleCopyLink = () => {
    const link = "https://placement-path.com/profile/saishree_kote";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      toast({ title: "Link copied!", description: link });
    } else {
      toast({ title: "Link:", description: link });
    }
  };

  const togglePrivacy = (idx: number) => {
    setPrivacy(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div>
      <DashboardNavbar title="Profile Settings" />
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <GlassCard>
            <h3 className="text-lg font-bold text-foreground mb-6">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
                <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
                <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">College Name</label>
                <Input value={profile.college} onChange={e => setProfile(p => ({ ...p, college: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Branch / Department</label>
                <Input value={profile.branch} onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Current CGPA</label>
                <Input value={profile.cgpa} type="number" step="0.1" onChange={e => setProfile(p => ({ ...p, cgpa: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Graduation Year</label>
                <Input value={profile.gradYear} type="number" onChange={e => setProfile(p => ({ ...p, gradYear: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.1}>
            <h3 className="text-lg font-bold text-foreground mb-6">Placement Details</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Technical Skills (Comma separated)</label>
                <Input value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Key Projects</label>
                <textarea
                  className="w-full min-h-[100px] p-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 transition-colors text-sm text-foreground outline-none"
                  value={profile.projects}
                  onChange={e => setProfile(p => ({ ...p, projects: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Certifications</label>
                <Input value={profile.certifications} onChange={e => setProfile(p => ({ ...p, certifications: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors" />
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="rounded-xl border-border/50 px-8" onClick={handleCancel}>Cancel</Button>
            <Button className="rounded-xl bg-primary text-primary-foreground btn-glow px-8 shadow-lg shadow-primary/20" onClick={handleSave}>Save Profile</Button>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Public Profile & Privacy</h3>
                <p className="text-xs text-muted-foreground">Manage how recruiters and peers see your profile</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-secondary" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Your Shareable Link</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-background border border-border/50 rounded-xl px-3 py-2 text-xs text-muted-foreground flex items-center overflow-hidden whitespace-nowrap">
                    https://placement-path.com/profile/saishree_kote
                  </div>
                  <Button variant="secondary" size="sm" className="rounded-xl font-bold" onClick={handleCopyLink}>Copy</Button>
                </div>
              </div>

              <div className="space-y-4">
                {privacy.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => togglePrivacy(i)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${item.checked ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${item.checked ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
