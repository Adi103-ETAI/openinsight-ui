import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/contexts/StoreContext";
import Index from "./pages/Index.tsx";
import Vault from "./pages/Vault.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import Layout from "./components/Layout.tsx";

const queryClient = new QueryClient();

// Apply persisted theme on app load
(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  const root = document.documentElement;
  const body = document.body;
  root.classList.remove("dark", "light");
  body.classList.remove("dark", "light");
  if (saved === "dark" || (!saved)) {
    root.classList.add("dark");
    body.classList.add("dark");
  } else if (saved === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
      body.classList.add("dark");
    }
  }
})();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
