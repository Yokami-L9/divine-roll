import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Plus, Sword, Shield, Scroll, Sparkles, Library, PenTool } from "lucide-react";
import HomebrewCreator from "@/components/HomebrewCreator";

const Homebrew = () => {
  const categories = [
    { icon: Shield, title: "Классы", count: 12, description: "Кастомные классы и подклассы", color: "bg-primary/20" },
    { icon: Sparkles, title: "Заклинания", count: 45, description: "Уникальные заклинания всех уровней", color: "bg-accent/20" },
    { icon: Sword, title: "Предметы", count: 67, description: "Магические и обычные предметы", color: "bg-secondary/20" },
    { icon: Scroll, title: "Монстры", count: 23, description: "Оригинальные существа", color: "bg-primary/20" },
  ];

  const recentContent = [
    { name: "Класс: Тенебой", type: "Класс", author: "Мастер Элрон", rarity: "—" },
    { name: "Меч Вечного Огня", type: "Предмет", author: "Ариэль", rarity: "Легендарный" },
    { name: "Заклинание: Тень Разума", type: "Заклинание", author: "Зарик", rarity: "5 уровень" },
    { name: "Ледяной Тролль", type: "Монстр", author: "Торгрим", rarity: "CR 8" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Homebrew-центр</h1>
            <p className="text-muted-foreground">Создавайте и делитесь кастомным контентом</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать контент
          </Button>
        </div>

        <Tabs defaultValue="library" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="library" className="gap-2 data-[state=active]:bg-primary/20">
              <Library className="w-4 h-4" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="creator" className="gap-2 data-[state=active]:bg-primary/20">
              <PenTool className="w-4 h-4" />
              Редактор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-2">{category.count}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </Card>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-serif font-semibold mb-4">Недавний контент</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {recentContent.map((item, index) => (
                <Card
                  key={index}
                  className="p-4 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">от {item.author}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 bg-primary/20 rounded text-sm">{item.type}</span>
                      {item.rarity !== "—" && (
                        <span className="text-xs text-muted-foreground">{item.rarity}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-8 bg-gradient-arcane rounded-lg text-center">
              <Wand2 className="w-16 h-16 text-primary mx-auto mb-4 gold-glow animate-float" />
              <h2 className="text-3xl font-serif font-bold mb-4">Создайте что-то уникальное</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Используйте мощные инструменты для создания классов, заклинаний, предметов и монстров.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-gold hover:opacity-90">Начать создание</Button>
                <Button variant="outline" className="border-primary/50">Изучить шаблоны</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="creator">
            <HomebrewCreator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Homebrew;
