import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, ExternalLink, PlayCircle, FileText, BookOpen, GraduationCap } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "DSA", "System Design", "Aptitude", "Soft Skills", "Projects"];

const resources = [
    { title: "100+ DSA Sheet for Product Companies", type: "PDF", size: "2.4 MB", category: "DSA", icon: FileText, color: "primary", url: "https://github.com/striver79/SDESheet" },
    { title: "System Design for Beginners: A Guided Path", type: "Video", duration: "45 mins", category: "System Design", icon: PlayCircle, color: "secondary", url: "https://www.youtube.com/watch?v=FSR1s2b-l_I" },
    { title: "Cracking the HR Interview: Best Practices", type: "Article", readTime: "10 mins", category: "Soft Skills", icon: GraduationCap, color: "accent", url: "https://www.indiabix.com/hr-interview/questions-and-answers/" },
    { title: "Quantitative Aptitude Formulas Mega-Sheet", type: "PDF", size: "1.2 MB", category: "Aptitude", icon: FileText, color: "primary", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
    { title: "Building Portfolio-Ready Projects", type: "Module", progress: "4/10", category: "Projects", icon: BookOpen, color: "secondary", url: "https://www.freecodecamp.org/learn/" },
];

const Resources = () => {
    const { toast } = useToast();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || r.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpen = (res: typeof resources[0]) => {
        window.open(res.url, "_blank", "noopener,noreferrer");
    };

    const handleDownload = (res: typeof resources[0]) => {
        toast({ title: "Opening resource...", description: res.title });
        window.open(res.url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen">
            <DashboardNavbar title="Prep Resources Library" />
            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Hero */}
                    <GlassCard className="bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Master Your Preparation</h2>
                        <p className="text-muted-foreground text-sm max-w-xl">Access highly curated resources designed by placement experts to help you crack your dream company.</p>
                    </GlassCard>

                    {/* Search & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search resources..."
                                className="pl-10 rounded-2xl bg-muted/20 border-border/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resources Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.length === 0 && (
                            <p className="col-span-3 text-center text-muted-foreground py-12">No resources match your search.</p>
                        )}
                        {filtered.map((res, i) => (
                            <motion.div
                                key={res.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard className="h-full flex flex-col group hover:border-primary/20 transition-all">
                                    <div className={`w-12 h-12 rounded-2xl bg-${res.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <res.icon className={`w-6 h-6 text-${res.color}`} />
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2">{res.title}</h3>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-0.5 bg-muted/20 rounded-md">{res.type}</span>
                                        <span className="text-xs text-muted-foreground">{res.size || res.duration || res.readTime || res.progress}</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
                                        <span className="text-xs font-medium text-primary">{res.category}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 group-hover:bg-primary/10 text-primary transition-all"
                                            onClick={() => res.type === 'PDF' ? handleDownload(res) : handleOpen(res)}
                                        >
                                            {res.type === 'PDF' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
