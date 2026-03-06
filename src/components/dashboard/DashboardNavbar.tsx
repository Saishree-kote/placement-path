import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardNavbarProps {
  title: string;
}

const DashboardNavbar = ({ title }: DashboardNavbarProps) => {
  return (
    <header className="glass-navbar sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 bg-muted/50 border-none rounded-xl h-9 text-sm"
          />
        </div>
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">JD</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
