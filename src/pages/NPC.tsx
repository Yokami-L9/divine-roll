import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Plus, Search, Network, List } from "lucide-react";
import NPCGraph from "@/components/NPCGraph";

const NPC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const npcList = [
    { name: "Элара Светлокрылая", role: "Торговка", faction: "Гильдия Искателей", relation: "Союзник", description: "Владеет лавкой редкостей в порту" },
    { name: "Торгрим Каменное Сердце", role: "Кузнец", faction: "Клан Железной Горы", relation: "Нейтральный", description: "Лучший оружейник в городе" },
    { name: "Лорд Валериан", role: "Дворянин", faction: "Королевский Двор", relation: "Враг", description: "Амбициозный аристократ с тёмными планами" },
    { name: "Зарик Тенебой", role: "Разбойник", faction: "Теневая Гильдия", relation: "Враг", description: "Главарь банды контрабандистов" },
    { name: "Миранда Светозарная", role: "Жрица", faction: "Храм Рассвета", relation: "Союзник", description: "Целительница и хранительница тайн" },
    { name: "Грок Железнозуб", role: "Наёмник", faction: "Вольные клинки", relation: "Нейтральный", description: "Орк-ветеран, готовый на любую работу" },
  ];

  const filteredNPCs = npcList.filter(
    (npc) =>
      npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.faction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Добавить NPC
          </Button>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-primary/20">
              <List className="w-4 h-4" />
              Список
            </TabsTrigger>
            <TabsTrigger value="graph" className="gap-2 data-[state=active]:bg-primary/20">
              <Network className="w-4 h-4" />
              Граф связей
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени, фракции или роли..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNPCs.map((npc, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors flex-shrink-0">
                      <UserCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                        {npc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{npc.role}</p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {npc.description}
                      </p>
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
          </TabsContent>

          <TabsContent value="graph">
            <NPCGraph />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NPC;
