import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, MoreVertical, Briefcase, Calendar, MapPin, CheckCircle2, Clock, XCircle, AlertCircle, X } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["All", "Interviewing", "Applied", "Online Test", "Offered"];

const initialApps = [
    { id: 1, company: "Google", role: "Software Engineering Intern", location: "Bangalore (Remote)", date: "Mar 10, 2026", status: "Interviewing", statusColor: "text-primary bg-primary/10", icon: Clock },
    { id: 2, company: "Microsoft", role: "Full Stack Developer", location: "Hyderabad", date: "Mar 05, 2026", status: "Applied", statusColor: "text-muted-foreground bg-muted/30", icon: AlertCircle },
    { id: 3, company: "Amazon", role: "SDE-1", location: "Chennai", date: "Feb 28, 2026", status: "Online Test", statusColor: "text-accent bg-accent/10", icon: Calendar },
    { id: 4, company: "Atlassian", role: "Product Engineer", location: "Bangalore", date: "Feb 20, 2026", status: "Offered", statusColor: "text-secondary bg-secondary/10", icon: CheckCircle2 },
];

const Applications = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [apps, setApps] = useState(initialApps);
    const [search, setSearch] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [showFilter, setShowFilter] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [newApp, setNewApp] = useState({ company: "", role: "", location: "" });

    const filtered = apps.filter(a => {
        const matchesSearch = a.company.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = activeStatus === "All" || a.status === activeStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAdd = () => {
        if (!newApp.company || !newApp.role) return;
        setApps(prev => [...prev, {
            id: Date.now(),
            company: newApp.company,
            role: newApp.role,
            location: newApp.location || "Remote",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
            status: "Applied",
            statusColor: "text-muted-foreground bg-muted/30",
            icon: AlertCircle,
        }]);
        setNewApp({ company: "", role: "", location: "" });
        setShowAdd(false);
        toast({ title: "Application added!", description: `${newApp.company} - ${newApp.role}` });
    };

    const handleDelete = (id: number) => {
        setApps(prev => prev.filter(a => a.id !== id));
        setOpenMenuId(null);
        toast({ title: "Application removed." });
    };

    const handleViewDetails = (app: typeof initialApps[0]) => {
        toast({ title: `${app.company} — ${app.role}`, description: `Status: ${app.status} | ${app.location} | Applied: ${app.date}` });
    };

    return (
        <div className="min-h-screen">
            <DashboardNavbar title="Job Applications" />
            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search your applications..."
                                className="pl-10 rounded-2xl bg-muted/20 border-border/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className={`rounded-xl border-border/50 px-4 ${showFilter ? "bg-primary/10 border-primary/30" : ""}`}
                                onClick={() => setShowFilter(v => !v)}
                            >
                                <Filter className="w-4 h-4 mr-2" /> Filter
                            </Button>
                            <Button
                                className="rounded-xl bg-primary text-primary-foreground btn-glow px-4"
                                onClick={() => setShowAdd(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Application
                            </Button>
                        </div>
                    </div>

                    {/* Status Filter Pills */}
                    {showFilter && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveStatus(s)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeStatus === s ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Add Application Form */}
                    {showAdd && (
                        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                            <GlassCard className="border-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-foreground">Add New Application</h4>
                                    <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Input placeholder="Company name *" value={newApp.company} onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50" />
                                    <Input placeholder="Role *" value={newApp.role} onChange={e => setNewApp(p => ({ ...p, role: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50" />
                                    <Input placeholder="Location" value={newApp.location} onChange={e => setNewApp(p => ({ ...p, location: e.target.value }))} className="rounded-xl bg-muted/30 border-border/50" />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="outline" className="rounded-xl" onClick={() => setShowAdd(false)}>Cancel</Button>
                                    <Button className="rounded-xl bg-primary text-primary-foreground" onClick={handleAdd}>Add</Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Applications Grid */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {filtered.map((app, i) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard className="group hover:border-primary/20 transition-all relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center border border-border/50">
                                                <Briefcase className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{app.company}</h3>
                                                <p className="text-sm text-muted-foreground">{app.role}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <button
                                                className="p-1 hover:bg-muted rounded-md transition-colors"
                                                onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                                            >
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            {openMenuId === app.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-0 top-8 bg-background border border-border/50 rounded-xl shadow-xl z-20 w-36 overflow-hidden"
                                                >
                                                    <button onClick={() => { handleViewDetails(app); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs hover:bg-muted/50 transition-colors">View Details</button>
                                                    <button onClick={() => handleDelete(app.id)} className="w-full text-left px-4 py-2.5 text-xs text-destructive hover:bg-destructive/5 transition-colors">Remove</button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                                {app.location}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Applied Date</p>
                                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                {app.date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${app.statusColor}`}>
                                            <app.icon className="w-3 h-3" />
                                            {app.status}
                                        </div>
                                        <Button variant="link" size="sm" className="text-xs text-primary font-bold p-0" onClick={() => handleViewDetails(app)}>
                                            View Details
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <p className="col-span-2 text-center text-muted-foreground py-12">No applications found. Add one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applications;
