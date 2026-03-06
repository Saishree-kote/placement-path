import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { companies } from "@/lib/dummyData";

const CompanyEligibility = () => {
  const [search, setSearch] = useState("");
  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <DashboardNavbar title="Company Eligibility" />
      <div className="p-6">
        <GlassCard className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border/50 h-11"
            />
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((company, i) => (
            <GlassCard key={company.name} delay={i * 0.08}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{company.logo}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{company.name}</h3>
                </div>
                <StatusBadge status={company.eligibility} />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min CGPA</span>
                  <span className="font-medium text-foreground">{company.cgpa}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {company.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pattern</span>
                  <span className="text-xs font-medium text-foreground">{company.pattern}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyEligibility;
