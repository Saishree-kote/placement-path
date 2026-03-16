import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ExternalLink, BookOpen, Code2, Brain, Database, Globe, MessageSquare, Layers, Search } from "lucide-react";
import { motion } from "framer-motion";

interface Resource {
    title: string;
    description: string;
    link: string;
    skill: string;
    tag: string;
    tagColor: string;
    icon: React.ReactNode;
}

const ALL_RESOURCES: Resource[] = [
    // DSA
    { title: "LeetCode", description: "Practice 2000+ coding problems for interviews", link: "https://leetcode.com", skill: "DSA", tag: "DSA", tagColor: "bg-orange-100 text-orange-700", icon: <Code2 className="w-4 h-4" /> },
    { title: "GeeksforGeeks DSA", description: "Complete DSA course with examples", link: "https://geeksforgeeks.org/data-structures", skill: "DSA", tag: "DSA", tagColor: "bg-orange-100 text-orange-700", icon: <Code2 className="w-4 h-4" /> },
    // System Design
    { title: "Grokking System Design", description: "Learn to design scalable systems", link: "https://designgurus.io/course/grokking-the-system-design-interview", skill: "System Design", tag: "System Design", tagColor: "bg-blue-100 text-blue-700", icon: <Layers className="w-4 h-4" /> },
    { title: "System Design Primer", description: "GitHub repo with system design concepts", link: "https://github.com/donnemartin/system-design-primer", skill: "System Design", tag: "System Design", tagColor: "bg-blue-100 text-blue-700", icon: <Layers className="w-4 h-4" /> },
    // React
    { title: "React Official Docs", description: "Official React documentation and tutorials", link: "https://react.dev", skill: "React", tag: "React", tagColor: "bg-cyan-100 text-cyan-700", icon: <Globe className="w-4 h-4" /> },
    { title: "Full Stack Open", description: "Free React + Node.js full course by Helsinki", link: "https://fullstackopen.com", skill: "React", tag: "React", tagColor: "bg-cyan-100 text-cyan-700", icon: <Globe className="w-4 h-4" /> },
    // Python
    { title: "freeCodeCamp Python", description: "Complete Python course for beginners", link: "https://freecodecamp.org/learn/scientific-computing-with-python", skill: "Python", tag: "Python", tagColor: "bg-yellow-100 text-yellow-700", icon: <Code2 className="w-4 h-4" /> },
    { title: "Python.org Tutorial", description: "Official Python documentation and guide", link: "https://docs.python.org/3/tutorial", skill: "Python", tag: "Python", tagColor: "bg-yellow-100 text-yellow-700", icon: <Code2 className="w-4 h-4" /> },
    // SQL
    { title: "SQLZoo", description: "Interactive SQL exercises and tutorials", link: "https://sqlzoo.net", skill: "SQL", tag: "SQL", tagColor: "bg-green-100 text-green-700", icon: <Database className="w-4 h-4" /> },
    { title: "Mode SQL Tutorial", description: "SQL for data analysis — free course", link: "https://mode.com/sql-tutorial", skill: "SQL", tag: "SQL", tagColor: "bg-green-100 text-green-700", icon: <Database className="w-4 h-4" /> },
    // JavaScript
    { title: "JavaScript.info", description: "Modern JavaScript from basics to advanced", link: "https://javascript.info", skill: "JavaScript", tag: "JS", tagColor: "bg-yellow-100 text-yellow-800", icon: <Code2 className="w-4 h-4" /> },
    { title: "Eloquent JavaScript", description: "Free book — deep dive into JS", link: "https://eloquentjavascript.net", skill: "JavaScript", tag: "JS", tagColor: "bg-yellow-100 text-yellow-800", icon: <Code2 className="w-4 h-4" /> },
    // Machine Learning
    { title: "fast.ai", description: "Practical deep learning for coders — free", link: "https://fast.ai", skill: "Machine Learning", tag: "ML", tagColor: "bg-purple-100 text-purple-700", icon: <Brain className="w-4 h-4" /> },
    { title: "ML Coursera (Andrew Ng)", description: "World's most popular ML course", link: "https://coursera.org/specializations/machine-learning-introduction", skill: "Machine Learning", tag: "ML", tagColor: "bg-purple-100 text-purple-700", icon: <Brain className="w-4 h-4" /> },
    // Communication
    { title: "Toastmasters Resources", description: "Improve public speaking and communication", link: "https://toastmasters.org/resources", skill: "Communication", tag: "Soft Skills", tagColor: "bg-pink-100 text-pink-700", icon: <MessageSquare className="w-4 h-4" /> },
    { title: "Coursera Communication", description: "Business communication skills course", link: "https://coursera.org/courses?query=communication+skills", skill: "Communication", tag: "Soft Skills", tagColor: "bg-pink-100 text-pink-700", icon: <MessageSquare className="w-4 h-4" /> },
    // TypeScript
    { title: "TypeScript Handbook", description: "Official TypeScript documentation", link: "https://typescriptlang.org/docs/handbook", skill: "TypeScript", tag: "TypeScript", tagColor: "bg-blue-100 text-blue-800", icon: <Code2 className="w-4 h-4" /> },
    // Node.js
    { title: "Node.js Official Docs", description: "Complete Node.js API documentation", link: "https://nodejs.org/docs", skill: "Node.js", tag: "Node.js", tagColor: "bg-green-100 text-green-800", icon: <Globe className="w-4 h-4" /> },
    // Docker
    { title: "Docker Getting Started", description: "Official Docker tutorial for beginners", link: "https://docs.docker.com/get-started", skill: "Docker", tag: "DevOps", tagColor: "bg-sky-100 text-sky-700", icon: <Layers className="w-4 h-4" /> },
    // AWS
    { title: "AWS Free Tier + Training", description: "Free AWS cloud practitioner training", link: "https://aws.training", skill: "AWS", tag: "Cloud", tagColor: "bg-orange-100 text-orange-800", icon: <Globe className="w-4 h-4" /> },
    // General aptitude
    { title: "IndiaBix Aptitude", description: "1000s of aptitude questions with solutions", link: "https://indiabix.com", skill: "Aptitude", tag: "Aptitude", tagColor: "bg-indigo-100 text-indigo-700", icon: <Brain className="w-4 h-4" /> },
    { title: "HackerRank Practice", description: "Coding + aptitude challenges for placements", link: "https://hackerrank.com/dashboard", skill: "Aptitude", tag: "Aptitude", tagColor: "bg-indigo-100 text-indigo-700", icon: <Brain className="w-4 h-4" /> },
];

const ResourceSidebar = () => {
    const { supabaseUser } = useAuth();
    const [userSkills, setUserSkills] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (supabaseUser) fetchUserSkills();
        else setLoading(false);
    }, [supabaseUser]);

    const fetchUserSkills = async () => {
        if (!supabaseUser) return;
        setLoading(false);
        const { data } = await supabase
            .from("profiles")
            .select("skills")
            .eq("id", supabaseUser.id)
            .single();

        // Skills the user DOESN'T have = gaps = show those resources first
        const allSkills = ["DSA", "System Design", "React", "Python", "SQL", "JavaScript",
            "Machine Learning", "TypeScript", "Node.js", "Docker", "AWS"];
        const userHas = data?.skills || [];
        const gaps = allSkills.filter((s) => !userHas.includes(s));
        setUserSkills(gaps.length > 0 ? gaps : allSkills);
        setLoading(false);
    };

    // Get unique tags for filter pills
    const allTags = ["All", ...Array.from(new Set(ALL_RESOURCES.map((r) => r.tag)))];

    // Filter resources
    const filtered = ALL_RESOURCES.filter((r) => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.skill.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "All" || r.tag === activeFilter;
        return matchesSearch && matchesFilter;
    });

    // Sort: skill gap resources first
    const sorted = [...filtered].sort((a, b) => {
        const aGap = userSkills.includes(a.skill) ? -1 : 1;
        const bGap = userSkills.includes(b.skill) ? -1 : 1;
        return aGap - bGap;
    });

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Learning Resources</h3>
                        <p className="text-xs text-muted-foreground">Curated for your skill gaps</p>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground">{sorted.length} resources</span>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full h-9 pl-8 pr-3 rounded-xl border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 flex-wrap">
                {allTags.slice(0, 8).map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${activeFilter === tag
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/30 text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Skill gap notice */}
            {userSkills.length > 0 && activeFilter === "All" && !search && (
                <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        Showing resources for your skill gaps first
                    </p>
                </div>
            )}

            {/* Resource cards */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {sorted.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No resources found</p>
                    </div>
                ) : (
                    sorted.map((resource, i) => (
                        <motion.div
                            key={resource.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="p-3 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                                        {resource.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold text-foreground">{resource.title}</span>
                                            <span className={"text-[10px] px-1.5 py-0.5 rounded-md font-medium " + resource.tagColor}>
                                                {resource.tag}
                                            </span>
                                            {userSkills.includes(resource.skill) && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-600 font-medium">
                                                    Gap
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                            {resource.description}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResourceSidebar;