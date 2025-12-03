import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dices, Swords, Calculator, Users, Backpack, Sparkles } from "lucide-react";
import DiceRoller from "@/components/DiceRoller";
import InitiativeTracker from "@/components/InitiativeTracker";

const Tools = () => {
  const tools = [
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

        <Tabs defaultValue="dice" className="mb-12">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="dice" className="gap-2 data-[state=active]:bg-primary/20">
              <Dices className="w-4 h-4" />
              Кубики
            </TabsTrigger>
            <TabsTrigger value="initiative" className="gap-2 data-[state=active]:bg-primary/20">
              <Swords className="w-4 h-4" />
              Инициатива
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dice">
            <DiceRoller />
          </TabsContent>

          <TabsContent value="initiative">
            <InitiativeTracker />
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-serif font-semibold mb-6">Другие инструменты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-muted-foreground text-sm">{tool.description}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tools;
