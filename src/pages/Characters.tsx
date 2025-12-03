import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Plus, Backpack, BookText, Users, Sparkles } from "lucide-react";
import CharacterGenerator from "@/components/CharacterGenerator";

const Characters = () => {
  const characters = [
    { name: "Торин Дубощит", race: "Дварф", class: "Воин", level: 5, hp: 45, maxHp: 45 },
    { name: "Эльвира Лунная", race: "Эльф", class: "Маг", level: 5, hp: 28, maxHp: 32 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Персонажи игроков</h1>
            <p className="text-muted-foreground">Управляйте персонажами, их биографиями и развитием</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать персонажа
          </Button>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-primary/20">
              <Users className="w-4 h-4" />
              Мои персонажи
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-2 data-[state=active]:bg-primary/20">
              <Sparkles className="w-4 h-4" />
              Генератор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {characters.map((char, index) => (
                <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-gold rounded-full flex items-center justify-center">
                      <UserCircle className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold group-hover:text-primary">{char.name}</h3>
                      <p className="text-sm text-muted-foreground">{char.race} • {char.class}</p>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">Ур. {char.level}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-gold" style={{ width: `${(char.hp / char.maxHp) * 100}%` }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">HP: {char.hp}/{char.maxHp}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Портрет и био</h3>
                    <p className="text-sm text-muted-foreground">Добавьте изображение и историю персонажа</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Backpack className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Инвентарь</h3>
                    <p className="text-sm text-muted-foreground">Отслеживайте снаряжение и ресурсы</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <BookText className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Дневник</h3>
                    <p className="text-sm text-muted-foreground">Записывайте приключения и открытия</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generator">
            <CharacterGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Characters;
