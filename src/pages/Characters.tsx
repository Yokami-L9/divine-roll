import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Plus, Backpack, BookText } from "lucide-react";

const Characters = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Персонажи игроков
            </h1>
            <p className="text-muted-foreground">
              Управляйте персонажами, их биографиями и развитием
            </p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать персонажа
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-1">Портрет и био</h3>
                <p className="text-sm text-muted-foreground">
                  Добавьте изображение и историю персонажа
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
                <Backpack className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-1">Инвентарь</h3>
                <p className="text-sm text-muted-foreground">
                  Отслеживайте снаряжение и ресурсы
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
                <BookText className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-1">Дневник</h3>
                <p className="text-sm text-muted-foreground">
                  Записывайте приключения и открытия
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Characters;
