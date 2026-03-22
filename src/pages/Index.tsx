import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Sparkles,
  Library,
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Мир кампании",
      description: "Создавайте глубокий лор, фракции и историю",
      path: "/world",
    },
    {
      icon: Users,
      title: "Персонажи",
      description: "Генератор и менеджер персонажей",
      path: "/characters",
    },
    {
      icon: Skull,
      title: "NPC и связи",
      description: "База NPC с графом отношений",
      path: "/npc",
    },
    {
      icon: Swords,
      title: "Монстры",
      description: "Библиотека и создание кастомных монстров",
      path: "/monsters",
    },
    {
      icon: Scroll,
      title: "Квесты",
      description: "Управление сюжетными ветками",
      path: "/quests",
    },
    {
      icon: Dices,
      title: "Инструменты",
      description: "Кубики, инициатива, калькуляторы",
      path: "/tools",
    },
    {
      icon: Map,
      title: "Генератор карт",
      description: "Создавайте карты как в Inkarnate",
      path: "/maps",
    },
    {
      icon: Wand2,
      title: "Homebrew",
      description: "Кастомные классы, заклинания, предметы",
      path: "/homebrew",
    },
    {
      icon: Library,
      title: "Энциклопедия",
      description: "Состояния, заклинания, таблицы правил",
      path: "/encyclopedia",
    },
    {
      icon: MessageSquare,
      title: "Сообщество",
      description: "Делитесь контентом с другими",
      path: "/community",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block animate-float">
            <Sparkles className="w-16 h-16 text-primary gold-glow" />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-6 animate-fade-in">
            Divine Roll
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 animate-fade-in">
            Полноценная платформа для Dungeons & Dragons
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Создавайте миры, персонажей и карты. Управляйте кампаниями.
            Все инструменты для игроков и мастеров в одном месте.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/characters">
              <Button
                size="lg"
                className="bg-gradient-gold hover:opacity-90 text-lg px-8 gold-glow"
              >
                Начать приключение
              </Button>
            </Link>
            <Link to="/community">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 text-lg px-8"
              >
                Сообщество
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">
            Всё для вашей кампании
          </h2>
          <p className="text-xl text-muted-foreground">
            Мощные инструменты для игроков и мастеров
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="p-6 h-full bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 group cursor-pointer">
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors gold-glow">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* GM Section */}
      <section className="bg-gradient-arcane py-24">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6 arcane-glow" />
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">
            Инструменты мастера
          </h2>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Скрытые ветки, планы угроз, саундборд и генератор случайных встреч
          </p>
          <Link to="/gm">
            <Button
              size="lg"
              className="bg-gradient-gold hover:opacity-90 text-lg px-8"
            >
              Панель GM
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Divine Roll. Создано для любителей D&D</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
