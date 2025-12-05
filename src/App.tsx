import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NewsDetail from "./pages/NewsDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Usuarios  from "./pages/Users";
import Category  from "./pages/Categorys";

import Publicaciones  from "./pages/Publicaciones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/noticia/:id" element={<NewsDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<Usuarios/>} />
            <Route path="/category" element={<Category/>} />
             <Route path="/publicaciones" element={<Publicaciones/>} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
