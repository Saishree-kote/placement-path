import { Bell, Search, ChevronLeft, ChevronRight, Moon, Sun, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavbarProps {
  title: string;
}

const DashboardNavbar = ({ title }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleSignOut = () => {
    logout();
    toast({ title: "Signed out", description: "See you next time! 👋" });
    navigate("/", { replace: true });
  };

  return (
    <header className="glass-navbar sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted/80 transition-all hover:scale-105 active:scale-95 group"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-xl hover:bg-muted/80 transition-all hover:scale-105 active:scale-95 group"
            aria-label="Go forward"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
        <h1 className="text-xl font-bold text-foreground ml-2">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 bg-muted/50 border-none rounded-xl h-9 text-sm"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40">
              <span className="text-sm font-semibold text-primary">
                {user?.initials ?? "JD"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-border/50">
            <DropdownMenuLabel className="pb-1">
              <p className="text-sm font-bold text-foreground">{user?.name ?? "John Doe"}</p>
              <p className="text-xs text-muted-foreground font-normal truncate">{user?.email ?? "john@example.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-xl"
              onClick={() => navigate("/dashboard/settings")}
            >
              <User className="w-4 h-4 mr-2" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNavbar;
