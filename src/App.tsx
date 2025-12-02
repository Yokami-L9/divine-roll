import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import World from "./pages/World";
import Characters from "./pages/Characters";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/world" element={<World />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/community" element={<Community />} />
          {/* Placeholder routes */}
          <Route path="/npc" element={<World />} />
          <Route path="/monsters" element={<World />} />
          <Route path="/quests" element={<World />} />
          <Route path="/tools" element={<Characters />} />
          <Route path="/maps" element={<World />} />
          <Route path="/homebrew" element={<World />} />
          <Route path="/gm" element={<World />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
