import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { GraduationCap } from "lucide-react";

const queryClient = new QueryClient();

// Shows spinner while Supabase checks existing session
const AuthLoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4"
    style={{ background: "var(--gradient-hero)" }}>
    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
      <GraduationCap className="w-7 h-7 text-primary-foreground" />
    </div>
    <p className="text-sm text-muted-foreground">Loading PlacePrep...</p>
  </div>
);

// Redirects unauthenticated users to /login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirects already-logged-in users away from public pages
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
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
          {/* Public routes */}
          <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

          {/* Protected dashboard routes */}
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

import AIChatbot from "./components/dashboard/AIChatbot";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            <AIChatbot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;