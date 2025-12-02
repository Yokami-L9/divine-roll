import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Scroll,
  Users,
  Skull,
  Swords,
  Map,
  Wand2,
  MessageSquare,
  Shield,
  Dices,
  BookOpen,
} from "lucide-react";

const Navigation = () => {
  const navItems = [
    { icon: BookOpen, label: "Мир", path: "/world" },
    { icon: Users, label: "Персонажи", path: "/characters" },
    { icon: Skull, label: "NPC", path: "/npc" },
    { icon: Swords, label: "Монстры", path: "/monsters" },
    { icon: Scroll, label: "Квесты", path: "/quests" },
    { icon: Dices, label: "Инструменты", path: "/tools" },
    { icon: Map, label: "Карты", path: "/maps" },
    { icon: Wand2, label: "Homebrew", path: "/homebrew" },
    { icon: MessageSquare, label: "Сообщество", path: "/community" },
    { icon: Shield, label: "GM", path: "/gm" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center gold-glow group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-primary">
              Arcane Nexus
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
              Войти
            </Button>
            <Button size="sm" className="bg-gradient-gold hover:opacity-90">
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
