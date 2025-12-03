import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll, Plus, Clock, CheckCircle2, AlertCircle, List, GitBranch } from "lucide-react";
import QuestTree from "@/components/QuestTree";

const Quests = () => {
  const quests = [
    { title: "Тайна исчезнувших торговцев", status: "active", type: "Основной", progress: 60, description: "Расследуйте исчезновение караванов на Королевском тракте" },
    { title: "Реликвия Древних", status: "active", type: "Основной", progress: 30, description: "Найдите утерянный артефакт в руинах Элдарона" },
    { title: "Помощь кузнецу", status: "completed", type: "Побочный", progress: 100, description: "Доставьте редкую руду кузнецу Торгриму" },
    { title: "Крысы в подвале", status: "active", type: "Побочный", progress: 0, description: "Очистите подвал таверны от гигантских крыс" },
    { title: "???", status: "hidden", type: "Скрытый", progress: 0, description: "Секретная сюжетная ветка" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "hidden": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary/20 text-primary";
      case "completed": return "bg-green-500/20 text-green-400";
      case "hidden": return "bg-accent/20 text-accent";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Квесты и сюжетные ветки</h1>
            <p className="text-muted-foreground">Отслеживайте основные и побочные задания</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать квест
          </Button>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-primary/20">
              <List className="w-4 h-4" />
              Список
            </TabsTrigger>
            <TabsTrigger value="tree" className="gap-2 data-[state=active]:bg-primary/20">
              <GitBranch className="w-4 h-4" />
              Древо сюжета
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid grid-cols-1 gap-4">
              {quests.map((quest, index) => (
                <Card
                  key={index}
                  className={`p-6 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer ${
                    quest.status === "hidden" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-serif font-semibold group-hover:text-primary transition-colors">
                          {quest.title}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(quest.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(quest.status)}
                            {quest.status === "active" ? "Активный" : quest.status === "completed" ? "Завершён" : "Скрытый"}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="border-primary/50">{quest.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{quest.description}</p>
                      {quest.status !== "hidden" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-semibold">{quest.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-gold transition-all duration-500"
                              style={{ width: `${quest.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Scroll className="w-8 h-8 text-primary/50 ml-4" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tree">
            <QuestTree />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Quests;
