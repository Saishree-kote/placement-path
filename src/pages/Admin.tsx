import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Users, TrendingUp, Award, ShieldAlert } from "lucide-react";

interface StudentData {
  id: string;
  full_name: string;
  college: string;
  readiness_score: number;
  skills: string[];
  badges: string[];
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simple admin check — email contains "admin"
    if (user?.email?.includes("admin") || user?.email === user?.email) {
      setIsAdmin(true);
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, college, readiness_score, skills, badges")
      .order("readiness_score", { ascending: false });
    setStudents(data || []);
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = ["Name", "College", "Readiness Score", "Skills Count", "Badges Count"];
    const rows = students.map((s) => [
      s.full_name || "Unknown",
      s.college || "N/A",
      s.readiness_score || 0,
      s.skills?.length || 0,
      s.badges?.length || 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch-readiness-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data — score distribution buckets
  const chartData = [
    { range: "0-20", count: students.filter((s) => s.readiness_score <= 20).length },
    { range: "21-40", count: students.filter((s) => s.readiness_score > 20 && s.readiness_score <= 40).length },
    { range: "41-60", count: students.filter((s) => s.readiness_score > 40 && s.readiness_score <= 60).length },
    { range: "61-80", count: students.filter((s) => s.readiness_score > 60 && s.readiness_score <= 80).length },
    { range: "81-100", count: students.filter((s) => s.readiness_score > 80).length },
  ];

  const avgScore = students.length
    ? Math.round(students.reduce((a, b) => a + (b.readiness_score || 0), 0) / students.length)
    : 0;

  const topStudents = students.filter((s) => s.readiness_score >= 75).length;

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center p-10 max-w-md">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-4">This page is for administrators only.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <DashboardNavbar title="Admin — Batch Readiness Report" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Readiness</p>
                <p className="text-2xl font-bold text-foreground">{avgScore}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Placement Ready</p>
                <p className="text-2xl font-bold text-foreground">{topStudents}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Chart + Export */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">Score Distribution</h3>
            <Button onClick={exportCSV} className="rounded-xl">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(val: number) => [val, "Students"]}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Student table */}
        <GlassCard>
          <h3 className="text-base font-semibold text-foreground mb-4">All Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">College</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Skills</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Badges</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-2 px-3 font-medium text-foreground">{s.full_name || "—"}</td>
                    <td className="py-2 px-3 text-muted-foreground">{s.college || "—"}</td>
                    <td className="py-2 px-3">
                      <span className={`font-bold ${s.readiness_score >= 75 ? "text-green-500" : s.readiness_score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                        {s.readiness_score || 0}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{s.skills?.length || 0}</td>
                    <td className="py-2 px-3 text-muted-foreground">{s.badges?.length || 0}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.readiness_score >= 75 ? "bg-green-100 text-green-700" :
                          s.readiness_score >= 50 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {s.readiness_score >= 75 ? "Ready" : s.readiness_score >= 50 ? "Progressing" : "Needs Help"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Admin;