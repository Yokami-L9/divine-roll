import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dices, Swords, Calculator, Users, Backpack, Sparkles } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      icon: Dices,
      title: "Бросок кубиков",
      description: "Виртуальные кубики с модификаторами и историей бросков",
      color: "bg-primary/20",
    },
    {
      icon: Swords,
      title: "Трекер инициативы",
      description: "Отслеживайте порядок ходов и состояния персонажей в бою",
      color: "bg-accent/20",
    },
    {
      icon: Calculator,
      title: "Калькулятор урона",
      description: "Быстрый подсчёт урона с учётом сопротивлений",
      color: "bg-secondary/20",
    },
    {
      icon: Users,
      title: "Генератор персонажей",
      description: "Создайте персонажа со случайными характеристиками",
      color: "bg-primary/20",
    },
    {
      icon: Backpack,
      title: "Менеджер инвентаря",
      description: "Общий лут группы и распределение добычи",
      color: "bg-secondary/20",
    },
    {
      icon: Sparkles,
      title: "Генератор имён",
      description: "Случайные имена для NPC разных рас",
      color: "bg-accent/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Инструменты игроков
          </h1>
          <p className="text-muted-foreground">
            Всё необходимое для комфортной игры
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
            >
              <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-muted-foreground text-sm">{tool.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="p-8 bg-gradient-arcane">
            <div className="text-center max-w-2xl mx-auto">
              <Dices className="w-16 h-16 text-primary mx-auto mb-6 gold-glow animate-float" />
              <h2 className="text-3xl font-serif font-bold mb-4">
                Бросок кубиков
              </h2>
              <p className="text-muted-foreground mb-6">
                Выберите тип кубика и добавьте модификаторы
              </p>
              <div className="flex gap-3 justify-center flex-wrap mb-6">
                {["d4", "d6", "d8", "d10", "d12", "d20", "d100"].map((dice) => (
                  <Button
                    key={dice}
                    size="lg"
                    className="bg-card hover:bg-primary/20 border border-primary/50 w-16 h-16 text-lg font-bold"
                  >
                    {dice}
                  </Button>
                ))}
              </div>
              <Button className="bg-gradient-gold hover:opacity-90 px-8">
                Бросить кубики
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Tools;
