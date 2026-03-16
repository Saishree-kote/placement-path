import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
    User, GraduationCap, Code, FolderGit2,
    CheckCircle, ChevronRight, ChevronLeft, Sparkles
} from "lucide-react";

const SKILLS_LIST = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++",
    "SQL", "MongoDB", "AWS", "Docker", "Git", "System Design", "DSA",
    "Machine Learning", "CSS", "HTML", "REST APIs", "GraphQL", "Redis"
];

const STEPS = [
    { id: 1, title: "Basic Info", icon: User, desc: "Tell us about yourself" },
    { id: 2, title: "Academic", icon: GraduationCap, desc: "Your education details" },
    { id: 3, title: "Skills", icon: Code, desc: "What can you do?" },
    { id: 4, title: "Projects", icon: FolderGit2, desc: "Show your work" },
];

interface FormData {
    full_name: string;
    email: string;
    phone: string;
    college: string;
    branch: string;
    year: string;
    cgpa: string;
    skills: string[];
    linkedin_url: string;
    portfolio_url: string;
    project1_name: string;
    project1_desc: string;
    project2_name: string;
    project2_desc: string;
}

const OnboardingWizard = ({ onComplete }: { onComplete?: () => void }) => {
    const { supabaseUser, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormData>({
        full_name: user?.name || "",
        email: user?.email || "",
        phone: "",
        college: "",
        branch: "",
        year: "",
        cgpa: "",
        skills: [],
        linkedin_url: "",
        portfolio_url: "",
        project1_name: "",
        project1_desc: "",
        project2_name: "",
        project2_desc: "",
    });

    const update = (key: keyof FormData, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const toggleSkill = (skill: string) => {
        setForm((f) => ({
            ...f,
            skills: f.skills.includes(skill)
                ? f.skills.filter((s) => s !== skill)
                : [...f.skills, skill],
        }));
    };

    // Readiness score preview
    const previewScore = () => {
        let score = 0;
        if (form.full_name) score += 10;
        if (form.college) score += 10;
        if (form.branch) score += 5;
        if (form.cgpa) score += 10;
        if (form.skills.length >= 3) score += 20;
        if (form.skills.length >= 7) score += 10;
        if (form.linkedin_url) score += 10;
        if (form.portfolio_url) score += 10;
        if (form.project1_name) score += 10;
        if (form.project2_name) score += 5;
        return Math.min(score, 100);
    };

    const handleSave = async () => {
        if (!supabaseUser) return;
        setSaving(true);
        try {
            const score = previewScore();
            const { error } = await supabase.from("profiles").upsert({
                id: supabaseUser.id,
                full_name: form.full_name,
                college: form.college,
                skills: form.skills,
                readiness_score: score,
                linkedin_url: form.linkedin_url,
                portfolio_url: form.portfolio_url,
            });

            if (error) throw error;

            toast({
                title: "Profile saved!",
                description: `Your readiness score is ${score}/100`,
            });

            if (onComplete) onComplete();
            else navigate("/dashboard");
        } catch (err) {
            toast({
                title: "Save failed",
                description: "Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const score = previewScore();
    const scoreColor = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ background: "var(--gradient-hero)" }}>
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Takes 2 minutes — unlocks your Placement Readiness Score
                    </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${step === s.id
                                    ? "bg-primary text-primary-foreground"
                                    : step > s.id
                                        ? "bg-green-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                }`}>
                                {step > s.id
                                    ? <CheckCircle className="w-3.5 h-3.5" />
                                    : <s.icon className="w-3.5 h-3.5" />
                                }
                                <span className="hidden sm:inline">{s.title}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-6 h-0.5 rounded ${step > s.id ? "bg-green-500" : "bg-muted"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Score preview */}
                <div className="glass-card p-4 rounded-2xl mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Readiness Score Preview</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">
                            Fill more fields to increase your score
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: scoreColor }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-2xl font-bold" style={{ color: scoreColor }}>
                            {score}
                        </span>
                    </div>
                </div>

                {/* Step content */}
                <div className="glass-card p-6 rounded-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Basic Information
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                                        <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)}
                                            placeholder="Saishree Kote" className="rounded-xl h-10" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                                        <Input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                                            placeholder="+91 9876543210" className="rounded-xl h-10" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">LinkedIn URL</label>
                                    <Input value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)}
                                        placeholder="https://linkedin.com/in/yourname" className="rounded-xl h-10" />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Portfolio / GitHub URL</label>
                                    <Input value={form.portfolio_url} onChange={(e) => update("portfolio_url", e.target.value)}
                                        placeholder="https://github.com/yourname" className="rounded-xl h-10" />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-primary" /> Academic Details
                                </h2>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">College / University *</label>
                                    <Input value={form.college} onChange={(e) => update("college", e.target.value)}
                                        placeholder="MIT College of Engineering" className="rounded-xl h-10" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Branch *</label>
                                        <Input value={form.branch} onChange={(e) => update("branch", e.target.value)}
                                            placeholder="Computer Engineering" className="rounded-xl h-10" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Year</label>
                                        <select value={form.year} onChange={(e) => update("year", e.target.value)}
                                            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground">
                                            <option value="">Select year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">CGPA</label>
                                    <Input value={form.cgpa} onChange={(e) => update("cgpa", e.target.value)}
                                        placeholder="8.5" type="number" min="0" max="10" step="0.1" className="rounded-xl h-10" />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-primary" /> Your Skills
                                </h2>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Select all that apply — {form.skills.length} selected
                                </p>
                                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                    {SKILLS_LIST.map((skill) => (
                                        <button
                                            key={skill}
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${form.skills.includes(skill)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <FolderGit2 className="w-4 h-4 text-primary" /> Your Projects
                                </h2>
                                <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-3">
                                    <p className="text-xs font-medium text-foreground">Project 1</p>
                                    <Input value={form.project1_name} onChange={(e) => update("project1_name", e.target.value)}
                                        placeholder="Project name" className="rounded-xl h-10" />
                                    <Input value={form.project1_desc} onChange={(e) => update("project1_desc", e.target.value)}
                                        placeholder="Brief description (tech stack, what it does)" className="rounded-xl h-10" />
                                </div>
                                <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-3">
                                    <p className="text-xs font-medium text-foreground">Project 2 (optional)</p>
                                    <Input value={form.project2_name} onChange={(e) => update("project2_name", e.target.value)}
                                        placeholder="Project name" className="rounded-xl h-10" />
                                    <Input value={form.project2_desc} onChange={(e) => update("project2_desc", e.target.value)}
                                        placeholder="Brief description" className="rounded-xl h-10" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className="rounded-xl"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>

                        <span className="text-xs text-muted-foreground">
                            Step {step} of {STEPS.length}
                        </span>

                        {step < STEPS.length ? (
                            <Button onClick={() => setStep((s) => s + 1)} className="rounded-xl">
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-xl bg-primary text-primary-foreground"
                            >
                                {saving ? "Saving..." : "Complete Profile"}
                                <CheckCircle className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;