
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AuthSuccess from "@/pages/AuthSuccess";
import Dashboard from "@/pages/Dashboard";
import LanguageDetailPage from "@/pages/LanguageDetailPage";
import AdminPage from "@/pages/AdminPage";
import AskAI from "@/pages/AskAI";
import AiSnippetDetailPage from "@/pages/AiSnippetDetailPage";
import FeaturesPage from "@/pages/FeaturesPage";

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Toaster richColors position="top-center" />
        <BrowserRouter>
            <ScrollToHash />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/snippets/:langSlug" element={<LanguageDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/ai-snippets/:snippetId" element={<AiSnippetDetailPage />} />
              <Route path="/features" element={<FeaturesPage />} />
            </Routes>
       
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
