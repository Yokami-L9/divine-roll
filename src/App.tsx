import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import World from "./pages/World";
import Characters from "./pages/Characters";
import Community from "./pages/Community";
import NPC from "./pages/NPC";
import Monsters from "./pages/Monsters";
import Quests from "./pages/Quests";
import Tools from "./pages/Tools";
import Maps from "./pages/Maps";
import Homebrew from "./pages/Homebrew";
import GM from "./pages/GM";
import Encyclopedia from "./pages/Encyclopedia";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/world" element={<World />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/community" element={<Community />} />
            <Route path="/npc" element={<NPC />} />
            <Route path="/monsters" element={<Monsters />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/homebrew" element={<Homebrew />} />
            <Route path="/gm" element={<GM />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
