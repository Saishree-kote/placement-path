import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="aptitude" element={<AptitudeTest />} />
            <Route path="skills" element={<SkillTracker />} />
            <Route path="companies" element={<CompanyEligibility />} />
            <Route path="interview" element={<MockInterview />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
