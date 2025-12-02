import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCircle, Plus, Search, Network } from "lucide-react";

const NPC = () => {
  const npcList = [
    { name: "Элара Светлокрылая", role: "Торговка", faction: "Гильдия Искателей", relation: "Союзник" },
    { name: "Торгрим Каменное Сердце", role: "Кузнец", faction: "Клан Железной Горы", relation: "Нейтральный" },
    { name: "Лорд Валериан", role: "Дворянин", faction: "Королевский Двор", relation: "Враг" },
    { name: "Зарик Тенебой", role: "Разбойник", faction: "Теневая Гильдия", relation: "Враг" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              База NPC
            </h1>
            <p className="text-muted-foreground">
              Управляйте персонажами и их связями
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-primary/50">
              <Network className="w-4 h-4" />
              Граф связей
            </Button>
            <Button className="bg-gradient-gold hover:opacity-90 gap-2">
              <Plus className="w-4 h-4" />
              Добавить NPC
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени, фракции или роли..."
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {npcList.map((npc, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <UserCircle className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                    {npc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{npc.role}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-secondary/20 rounded text-xs">
                      {npc.faction}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        npc.relation === "Союзник"
                          ? "bg-primary/20 text-primary"
                          : npc.relation === "Враг"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {npc.relation}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-arcane rounded-lg text-center">
          <Network className="w-12 h-12 text-primary mx-auto mb-4 arcane-glow" />
          <h3 className="text-2xl font-serif font-bold mb-2">Граф связей</h3>
          <p className="text-muted-foreground mb-4">
            Визуализируйте отношения между персонажами как в Obsidian или Notion
          </p>
          <Button className="bg-gradient-gold hover:opacity-90">
            Открыть граф
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NPC;
