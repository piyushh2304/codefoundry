
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
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


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
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
