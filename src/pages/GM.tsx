import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, EyeOff, Music, Zap, Lock, Skull, AlertTriangle } from "lucide-react";
import Soundboard from "@/components/Soundboard";

const GM = () => {
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

  const secretPlots = [
    { title: "Предательство в гильдии", status: "Активно", clues: 2 },
    { title: "Возвращение древнего зла", status: "Скрыто", clues: 0 },
    { title: "Тайный наследник престола", status: "Активно", clues: 1 },
  ];

  const randomEncounters = [
    "Торговый караван атакован бандитами",
    "Странник просит помощи — ловушка?",
    "Древний обелиск излучает магию",
    "Группа беженцев из разрушенной деревни",
    "Дуэль магов на перекрёстке дорог",
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

        <Tabs defaultValue="soundboard" className="mb-12">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="soundboard" className="gap-2 data-[state=active]:bg-accent/20">
              <Music className="w-4 h-4" />
              Саундборд
            </TabsTrigger>
            <TabsTrigger value="threats" className="gap-2 data-[state=active]:bg-accent/20">
              <Skull className="w-4 h-4" />
              Угрозы
            </TabsTrigger>
            <TabsTrigger value="secrets" className="gap-2 data-[state=active]:bg-accent/20">
              <Eye className="w-4 h-4" />
              Секреты
            </TabsTrigger>
            <TabsTrigger value="encounters" className="gap-2 data-[state=active]:bg-accent/20">
              <Zap className="w-4 h-4" />
              Встречи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="soundboard">
            <Soundboard />
          </TabsContent>

          <TabsContent value="threats">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  Планы угроз
                </h3>
                <Button variant="outline" className="border-accent/50 gap-2">
                  <EyeOff className="w-4 h-4" />
                  Скрыть от игроков
                </Button>
              </div>

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
          </TabsContent>

          <TabsContent value="secrets">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Скрытые сюжетные ветки
              </h3>
              <div className="space-y-3">
                {secretPlots.map((plot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{plot.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Улик найдено: {plot.clues}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs ${
                          plot.status === "Активно"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {plot.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="encounters">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Генератор случайных встреч
              </h3>
              <div className="space-y-2 mb-6">
                {randomEncounters.map((encounter, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background/50 rounded border border-border hover:border-accent/30 transition-all cursor-pointer"
                  >
                    <span className="text-muted-foreground mr-2">{index + 1}.</span>
                    {encounter}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-gradient-gold hover:opacity-90">
                <Zap className="w-4 h-4 mr-2" />
                Сгенерировать новую встречу
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GM;
