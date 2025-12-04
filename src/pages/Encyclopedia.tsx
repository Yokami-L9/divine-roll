import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Shield, 
  Flame, 
  Skull, 
  Eye, 
  Zap,
  Heart,
  Wind,
  Snowflake,
  Sun,
  Moon,
  Coins,
  Sword,
  Package
} from "lucide-react";

const Encyclopedia = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const conditions = [
    { name: "Ослепление", icon: Eye, description: "Существо не видит и автоматически проваливает проверки, требующие зрения.", color: "bg-accent/20" },
    { name: "Очарование", icon: Heart, description: "Очарованное существо не может атаковать того, кто его очаровал.", color: "bg-primary/20" },
    { name: "Оглушение", icon: Zap, description: "Существо недееспособно, не может двигаться и едва говорит.", color: "bg-secondary/20" },
    { name: "Испуг", icon: Skull, description: "Существо с помехой к проверкам пока видит источник страха.", color: "bg-accent/20" },
    { name: "Захват", icon: Shield, description: "Скорость существа становится 0, и оно не может получать бонусы к скорости.", color: "bg-secondary/20" },
    { name: "Паралич", icon: Snowflake, description: "Существо парализовано и не может двигаться или говорить.", color: "bg-primary/20" },
    { name: "Окаменение", icon: Moon, description: "Существо превращается в камень вместе со своим снаряжением.", color: "bg-accent/20" },
    { name: "Отравление", icon: Flame, description: "Существо с помехой к броскам атаки и проверкам характеристик.", color: "bg-secondary/20" },
  ];

  const spells = [
    { name: "Огненный шар", level: 3, school: "Вызов", damage: "8d6 огня", range: "150 фт.", casting: "1 действие", components: "В, С, М" },
    { name: "Молния", level: 3, school: "Вызов", damage: "8d6 электричества", range: "100 фт.", casting: "1 действие", components: "В, С, М" },
    { name: "Щит", level: 1, school: "Ограждение", damage: "+5 КД", range: "На себя", casting: "1 реакция", components: "В, С" },
    { name: "Исцеляющее слово", level: 1, school: "Вызов", damage: "1d4+мод", range: "60 фт.", casting: "1 бонусное", components: "В" },
    { name: "Волшебная стрела", level: 1, school: "Вызов", damage: "3×1d4+1", range: "120 фт.", casting: "1 действие", components: "В, С" },
    { name: "Невидимость", level: 2, school: "Иллюзия", damage: "—", range: "Касание", casting: "1 действие", components: "В, С, М" },
    { name: "Телепортация", level: 7, school: "Призыв", damage: "—", range: "10 фт.", casting: "1 действие", components: "В" },
    { name: "Метеоритный рой", level: 9, school: "Вызов", damage: "40d6", range: "1 миля", casting: "1 действие", components: "В, С" },
  ];

  const lootTables = [
    { cr: "0-4", coins: "5d6 зм", gems: "1d6 ×10 зм", magic: "Обычные предметы" },
    { cr: "5-10", coins: "4d6 ×100 зм", gems: "2d6 ×50 зм", magic: "Необычные предметы" },
    { cr: "11-16", coins: "5d6 ×1000 зм", gems: "2d6 ×500 зм", magic: "Редкие предметы" },
    { cr: "17+", coins: "12d6 ×1000 зм", gems: "3d6 ×1000 зм", magic: "Легендарные предметы" },
  ];

  const prices = [
    { item: "Зелье лечения", price: "50 зм", rarity: "Обычный" },
    { item: "Зелье большого лечения", price: "150 зм", rarity: "Необычный" },
    { item: "Свиток 1 уровня", price: "25 зм", rarity: "Обычный" },
    { item: "Свиток 3 уровня", price: "200 зм", rarity: "Необычный" },
    { item: "+1 Оружие", price: "1000 зм", rarity: "Необычный" },
    { item: "+2 Оружие", price: "4000 зм", rarity: "Редкий" },
    { item: "+3 Оружие", price: "16000 зм", rarity: "Очень редкий" },
    { item: "Плащ невидимости", price: "5000 зм", rarity: "Редкий" },
  ];

  const filteredConditions = conditions.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpells = spells.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Энциклопедия правил
          </h1>
          <p className="text-muted-foreground">
            Справочник по состояниям, заклинаниям, луту и ценам
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по энциклопедии..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <Tabs defaultValue="conditions" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="conditions" className="gap-2 data-[state=active]:bg-primary/20">
              <Skull className="w-4 h-4" />
              Состояния
            </TabsTrigger>
            <TabsTrigger value="spells" className="gap-2 data-[state=active]:bg-primary/20">
              <Sparkles className="w-4 h-4" />
              Заклинания
            </TabsTrigger>
            <TabsTrigger value="loot" className="gap-2 data-[state=active]:bg-primary/20">
              <Package className="w-4 h-4" />
              Таблицы лута
            </TabsTrigger>
            <TabsTrigger value="prices" className="gap-2 data-[state=active]:bg-primary/20">
              <Coins className="w-4 h-4" />
              Цены
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conditions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredConditions.map((condition, index) => (
                <Card key={index} className="p-4 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer">
                  <div className={`w-12 h-12 ${condition.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <condition.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                    {condition.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{condition.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spells">
            <div className="space-y-3">
              {filteredSpells.map((spell, index) => (
                <Card key={index} className="p-4 bg-card border-border hover:border-primary/50 transition-all">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-serif font-semibold">{spell.name}</h3>
                        <Badge variant="secondary">{spell.level} ур.</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{spell.school}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-accent" />
                        <span>{spell.damage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4 text-primary" />
                        <span>{spell.range}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-secondary" />
                        <span>{spell.casting}</span>
                      </div>
                      <Badge variant="outline">{spell.components}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="loot">
            <Card className="overflow-hidden bg-card border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/20">
                    <tr>
                      <th className="px-4 py-3 text-left font-serif">CR</th>
                      <th className="px-4 py-3 text-left font-serif">Монеты</th>
                      <th className="px-4 py-3 text-left font-serif">Драгоценности</th>
                      <th className="px-4 py-3 text-left font-serif">Магические предметы</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lootTables.map((row, index) => (
                      <tr key={index} className="border-t border-border hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-primary">{row.cr}</td>
                        <td className="px-4 py-3">{row.coins}</td>
                        <td className="px-4 py-3">{row.gems}</td>
                        <td className="px-4 py-3">{row.magic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="prices">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {prices.map((item, index) => (
                <Card key={index} className="p-4 bg-card border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Sword className="w-5 h-5 text-primary" />
                    <Badge 
                      variant="secondary" 
                      className={
                        item.rarity === "Редкий" ? "bg-accent/20 text-accent" :
                        item.rarity === "Очень редкий" ? "bg-primary/20 text-primary" :
                        item.rarity === "Необычный" ? "bg-secondary/20" : ""
                      }
                    >
                      {item.rarity}
                    </Badge>
                  </div>
                  <h3 className="font-serif font-semibold mb-1">{item.item}</h3>
                  <p className="text-lg text-primary font-bold">{item.price}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Encyclopedia;
