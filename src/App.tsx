import { supabase } from "./lib/supabase";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RefreshCw, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AptitudeTest from "./pages/AptitudeTest";
import SkillTracker from "./pages/SkillTracker";
import CompanyEligibility from "./pages/CompanyEligibility";
import MockInterview from "./pages/MockInterview";
import DashboardSettings from "./pages/DashboardSettings";
import Roadmap from "./pages/Roadmap";
import Community from "./pages/Community";
import Applications from "./pages/Applications";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import BootingAnimation from "./components/BootingAnimation";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Guard: redirects unauthenticated users to /login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Guard: redirects already-logged-in users away from /login and /
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes = () => {
  const [isBooting, setIsBooting] = useState(() => {
    const seen = sessionStorage.getItem("pp_booted");
    return !seen;
  });

  const handleBootDone = () => {
    sessionStorage.setItem("pp_booted", "true");
    setIsBooting(false);
  };

  return (
    <>
      <AnimatePresence>
        {isBooting && <BootingAnimation key="booting" onComplete={handleBootDone} />}
      </AnimatePresence>

      {!isBooting && (
        <Routes>
          <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
          >
            <Route index element={<Dashboard />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="aptitude" element={<AptitudeTest />} />
            <Route path="skills" element={<SkillTracker />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="community" element={<Community />} />
            <Route path="applications" element={<Applications />} />
            <Route path="resources" element={<Resources />} />
            <Route path="companies" element={<CompanyEligibility />} />
            <Route path="interview" element={<MockInterview />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

const GlobalControls = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <Button
        variant="outline"
        className="rounded-full shadow-lg bg-background/80 backdrop-blur-md border-border/50 hover:bg-muted font-medium transition-all"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="w-4 h-4 mr-2 text-muted-foreground" />
        Refresh Page
      </Button>
      <Button
        className="rounded-full shadow-xl shadow-primary/20 bg-primary text-primary-foreground btn-glow font-medium transition-all"
        onClick={() => {
          sessionStorage.clear();
          window.location.href = "/";
        }}
      >
        <Power className="w-4 h-4 mr-2" />
        Reboot Webapp
      </Button>
    </div>
  );
};

const App = () => {

  // 🔹 SUPABASE CONNECTION TEST
  useEffect(() => {
    async function testSupabase() {

      // Insert test row
      const { data: insertData, error: insertError } = await supabase
        .from("students")
        .insert([
          { name: "Test Student" }
        ]);

      console.log("Insert result:", insertData, insertError);

      // Fetch rows
      const { data, error } = await supabase
        .from("students")
        .select("*");

      console.log("Supabase connection:", data, error);
    }

    testSupabase();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GlobalControls />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;