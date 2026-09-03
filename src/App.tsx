import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { TextDisplayProvider } from "./context/TextDisplayContext";
import Index from "./pages/Index";
import DisplayText from "./pages/DisplayText";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import { useEffect, useRef, useState } from "react";

const queryClient = new QueryClient();

// Wrapper component to ensure proper routing
const AppRoutes = () => {
  const [initialized, setInitialized] = useState(false);
  const hasSetInitialRoute = useRef(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (hasSetInitialRoute.current) return;
    hasSetInitialRoute.current = true;

    // Every full page load starts at the splash screen. Client-side navigation
    // continues normally after initialization.
    navigate('/', { replace: true });
    setInitialized(true);
  }, [navigate]);
  
  if (!initialized) {
    return <div className="min-h-screen bg-background dark:bg-gray-900"></div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/options" element={<Index />} />
      <Route path="/display" element={<DisplayText />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TextDisplayProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TextDisplayProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
