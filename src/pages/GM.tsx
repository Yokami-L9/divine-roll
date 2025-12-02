import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, Music, Zap, Lock, Skull, AlertTriangle } from "lucide-react";

const GM = () => {
  const gmTools = [
    {
      icon: Eye,
      title: "Скрытые ветки",
      description: "Тайные сюжетные линии, о которых не знают игроки",
      locked: false,
    },
    {
      icon: Skull,
      title: "Планы угроз",
      description: "Стратегии антагонистов и будущие события",
      locked: false,
    },
    {
      icon: Music,
      title: "Саундборд",
      description: "Управление атмосферной музыкой и звуковыми эффектами",
      locked: false,
    },
    {
      icon: Zap,
      title: "Случайные встречи",
      description: "Генератор случайных событий и встреч",
      locked: false,
    },
  ];

  const threats = [
    {
      name: "Лорд Валериан",
      threat: "Высокая",
      plan: "Захват торгового пути",
      progress: 45,
    },
    {
      name: "Культ Тёмной Луны",
      threat: "Критическая",
      plan: "Призыв демона",
      progress: 78,
    },
    {
      name: "Драконы Севера",
      threat: "Средняя",
      plan: "Расширение территории",
      progress: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 p-6 bg-gradient-danger rounded-lg border-2 border-accent/50">
          <div className="flex items-center gap-4">
            <Lock className="w-12 h-12 text-accent" />
            <div>
              <h2 className="text-2xl font-serif font-bold mb-1">
                Панель мастера
              </h2>
              <p className="text-muted-foreground">
                Эта информация скрыта от игроков
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {gmTools.map((tool, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <tool.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-accent transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{tool.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-serif font-semibold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-accent" />
              Планы угроз
            </h3>
            <Button variant="outline" className="border-accent/50 gap-2">
              <EyeOff className="w-4 h-4" />
              Скрыть от игроков
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-12">
          {threats.map((threat, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-accent/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-serif font-semibold">{threat.name}</h4>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        threat.threat === "Критическая"
                          ? "bg-accent/20 text-accent"
                          : threat.threat === "Высокая"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {threat.threat}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{threat.plan}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс плана</span>
                  <span className="font-semibold">{threat.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-danger transition-all duration-500"
                    style={{ width: `${threat.progress}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-arcane">
          <div className="text-center max-w-2xl mx-auto">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4 gold-glow" />
            <h2 className="text-3xl font-serif font-bold mb-4">
              Саундборд мастера
            </h2>
            <p className="text-muted-foreground mb-6">
              Управляйте атмосферой с помощью музыки и звуковых эффектов
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {["Таверна", "Бой", "Подземелье", "Тревога", "Лес", "Город", "Погоня", "Тишина"].map(
                (scene) => (
                  <Button
                    key={scene}
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/20"
                  >
                    {scene}
                  </Button>
                )
              )}
            </div>
            <Button className="bg-gradient-gold hover:opacity-90 px-8">
              Открыть саундборд
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default GM;
