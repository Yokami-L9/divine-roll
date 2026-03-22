import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
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
  Library,
  LogOut,
  User,
} from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: BookOpen, label: "Мир", path: "/world" },
    { icon: Users, label: "Персонажи", path: "/characters" },
    { icon: Skull, label: "NPC", path: "/npc" },
    { icon: Swords, label: "Монстры", path: "/monsters" },
    { icon: Scroll, label: "Квесты", path: "/quests" },
    { icon: Dices, label: "Инструменты", path: "/tools" },
    { icon: Map, label: "Карты", path: "/maps" },
    { icon: Wand2, label: "Homebrew", path: "/homebrew" },
    { icon: Library, label: "База знаний", path: "/rulebook" },
    { icon: MessageSquare, label: "Сообщество", path: "/community" },
    { icon: Shield, label: "GM", path: "/gm" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-3">
          <Link to="/" className="group flex min-w-fit shrink-0 items-center gap-2">
            <img
              src={logo}
              alt="Divine Roll"
              className="h-10 w-10 rounded-full transition-transform group-hover:scale-110"
            />
            <span className="whitespace-nowrap text-xl font-serif font-bold text-primary">
              Divine Roll
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} title={item.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2.5 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="sr-only">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {user ? (
              <>
                <Link to="/profile">
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 transition-colors hover:bg-primary/20 cursor-pointer">
                    <User className="h-4 w-4 text-primary" />
                    <span className="hidden text-sm font-medium text-primary xl:inline">
                      {user.user_metadata?.username || user.email?.split("@")[0]}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/50 gap-2 hover:bg-primary/10"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden 2xl:inline">Выйти</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                    Войти
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-gold hover:opacity-90">
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
