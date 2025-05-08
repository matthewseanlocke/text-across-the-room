import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TextDisplayProvider } from "./context/TextDisplayContext";
import Index from "./pages/Index";
import DisplayText from "./pages/DisplayText";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Wrapper component to ensure proper routing
const AppRoutes = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Ensure the component mounts before rendering routes
    setInitialized(true);
    
    // Clear any cached routes
    window.history.replaceState({}, '', '/');
  }, []);
  
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
