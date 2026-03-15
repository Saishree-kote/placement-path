import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, BookOpen, UserCheck, Code, Target } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";

const roadmapData = [
    {
        week: "Week 1",
        title: "Foundations & DSA",
        status: "completed",
        tasks: ["Master Array & String manipulations", "Understand Time & Space Complexity", "Review Link Lists and Stacks"],
        icon: Code,
        color: "secondary"
    },
    {
        week: "Week 2",
        title: "Advanced DSA & Projects",
        status: "current",
        tasks: ["Dynamic Programming basics", "Tree and Graph traversals", "Complete one major Portfolio Project"],
        icon: Target,
        color: "primary"
    },
    {
        week: "Week 3",
        title: "Aptitude & Core CS",
        status: "upcoming",
        tasks: ["Quantitative Aptitude (P&C, Probability)", "DBMS & OS fundamentals", "System Design basics"],
        icon: BookOpen,
        color: "accent"
    },
    {
        week: "Week 4",
        title: "Mocks & Final Polish",
        status: "upcoming",
        tasks: ["Practice 5 Text-based Mock Interviews", "Company-specific previous questions", "Final Resume Review"],
        icon: UserCheck,
        color: "muted-foreground"
    }
];

const Roadmap = () => {
    return (
        <div className="min-h-screen">
            <DashboardNavbar title="4-Week Preparation Roadmap" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-center"
                    >
                        <h2 className="text-2xl font-bold gradient-text mb-2">Your Path to Placement</h2>
                        <p className="text-muted-foreground italic text-sm">Personalized plan based on your current skill level (82%).</p>
                    </motion.div>

                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {roadmapData.map((item, i) => (
                            <motion.div
                                key={item.week}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${item.status === 'upcoming' ? 'opacity-60' : ''}`}
                            >
                                {/* Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-secondary" /> :
                                        item.status === 'current' ? <Clock className="w-5 h-5 text-primary animate-pulse" /> :
                                            <Circle className="w-5 h-5 text-muted-foreground" />}
                                </div>

                                {/* Content */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                                    <GlassCard className={`relative border-l-4 ${item.status === 'current' ? 'border-primary' : item.status === 'completed' ? 'border-secondary' : 'border-border'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <item.icon className={`w-4 h-4 text-${item.color}`} />
                                            <span className={`text-xs font-bold uppercase tracking-wider text-${item.color}`}>{item.week}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-foreground mb-3">{item.title}</h3>
                                        <ul className="space-y-2">
                                            {item.tasks.map((task, idx) => (
                                                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 flex-shrink-0" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </GlassCard>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
