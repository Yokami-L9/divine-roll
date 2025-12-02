import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Globe, BookOpen, Clock, Shield } from "lucide-react";

const World = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Мир кампании
          </h1>
          <p className="text-muted-foreground">
            Лор, история, фракции и ключевые события вашего мира
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold mb-2">Лор и история</h3>
                <p className="text-muted-foreground mb-4">
                  Создавайте глубокую историю вашего мира, легенды и мифы
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold mb-2">Таймлайн</h3>
                <p className="text-muted-foreground mb-4">
                  Отслеживайте ключевые события и их последовательность
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold mb-2">Фракции</h3>
                <p className="text-muted-foreground mb-4">
                  Управляйте отношениями между фракциями и их целями
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold mb-2">Интерактивная карта</h3>
                <p className="text-muted-foreground mb-4">
                  Исследуйте мир через интерактивную карту с локациями
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default World;
