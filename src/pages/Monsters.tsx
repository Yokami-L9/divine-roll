import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skull, Plus, Search, Flame, Droplet, Wind, Zap, Eye } from "lucide-react";
import MonsterStatBlock from "@/components/MonsterStatBlock";

const Monsters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonster, setSelectedMonster] = useState<number | null>(null);

  const monsters = [
    { name: "Древний Красный Дракон", cr: "24", type: "Дракон", element: "Огонь" },
    { name: "Демон Балор", cr: "19", type: "Инфернал", element: "Огонь" },
    { name: "Личи-маг", cr: "21", type: "Нежить", element: "Некромантия" },
    { name: "Ледяной Гигант", cr: "13", type: "Гигант", element: "Холод" },
    { name: "Грозовой Элементаль", cr: "11", type: "Элементаль", element: "Молния" },
    { name: "Морской Змей", cr: "15", type: "Чудовище", element: "Вода" },
  ];

  const exampleMonster = {
    name: "Древний Красный Дракон",
    type: "дракон",
    size: "Громадный",
    alignment: "хаотичный злой",
    cr: "24",
    xp: 62000,
    ac: 22,
    hp: 546,
    speed: "40 фт., летая 80 фт.",
    stats: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
    skills: ["Восприятие +16", "Скрытность +7"],
    resistances: [],
    immunities: ["огонь"],
    senses: ["слепое зрение 60 фт.", "тёмное зрение 120 фт."],
    languages: ["Общий", "Драконий"],
    abilities: [
      { name: "Легендарное сопротивление (3/день)", description: "Если дракон провалил спасбросок, он может вместо этого преуспеть." },
      { name: "Огненная аура", description: "Существа в пределах 10 фт. получают 10 урона огнём в начале хода дракона." },
    ],
    actions: [
      { name: "Мультиатака", description: "Дракон совершает три атаки: одну укусом и две когтями." },
      { name: "Укус", description: "Рукопашная атака оружием: +17 к попаданию, досягаемость 15 фт.", damage: "2d10+10 колющего + 4d6 огня" },
      { name: "Огненное дыхание (Перезарядка 5–6)", description: "Дракон выдыхает огонь 90-футовым конусом. Спасбросок Лов. СЛ 24.", damage: "26d6 огня" },
    ],
  };

  const getElementIcon = (element: string) => {
    switch (element) {
      case "Огонь": return <Flame className="w-4 h-4" />;
      case "Холод":
      case "Вода": return <Droplet className="w-4 h-4" />;
      case "Молния": return <Zap className="w-4 h-4" />;
      default: return <Wind className="w-4 h-4" />;
    }
  };

  const filteredMonsters = monsters.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Библиотека монстров</h1>
            <p className="text-muted-foreground">Официальные и кастомные существа для ваших приключений</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать монстра
          </Button>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск монстров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" className="border-primary/50">Фильтры</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonsters.map((monster, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-accent/20 group cursor-pointer">
                  <div className="h-40 bg-gradient-danger relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <Skull className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-foreground/20 group-hover:scale-110 transition-transform" />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                      {monster.name}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-accent/20 rounded text-xs font-semibold">CR {monster.cr}</span>
                      <span className="px-2 py-1 bg-secondary/20 rounded text-xs">{monster.type}</span>
                      <span className="px-2 py-1 bg-primary/20 rounded text-xs flex items-center gap-1">
                        {getElementIcon(monster.element)}
                        {monster.element}
                      </span>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-background border-border p-0 overflow-hidden">
                <MonsterStatBlock monster={exampleMonster} />
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-danger text-center">
            <Flame className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Инферналы</h3>
            <p className="text-sm text-muted-foreground">Демоны и дьяволы из бездны</p>
          </Card>
          <Card className="p-6 bg-gradient-arcane text-center">
            <Skull className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Нежить</h3>
            <p className="text-sm text-muted-foreground">Восставшие из мёртвых</p>
          </Card>
          <Card className="p-6 bg-card text-center border-primary/50">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Боссы</h3>
            <p className="text-sm text-muted-foreground">Легендарные противники</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Monsters;
