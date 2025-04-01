import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

// Importação dos componentes de autenticação
import { AuthProvider } from "@/lib/auth-context";
import Login from "./pages/Login";

// Importação do layout e páginas de administração
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PlayerManagement from "./pages/admin/PlayerManagement";
import MatchManagement from "./pages/admin/MatchManagement";
import StatsManagement from "./pages/admin/StatsManagement";
import NewsManagement from "./pages/admin/NewsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rotas de administração */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="players" element={<PlayerManagement />} />
              <Route path="matches" element={<MatchManagement />} />
              <Route path="stats" element={<StatsManagement />} />
              <Route path="noticias" element={<NewsManagement />} />
            </Route>
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
