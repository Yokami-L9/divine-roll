import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Сообщество
          </h1>
          <p className="text-muted-foreground">
            Делитесь контентом, находите вдохновение и общайтесь с другими мастерами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card
              key={item}
              className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="h-48 bg-gradient-arcane"></div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-secondary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Мастер #{item}</span>
                </div>
                <h3 className="text-lg font-serif font-semibold mb-2">
                  Пример карты подземелья
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Детализированная карта древних руин с ловушками и секретами
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">42</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">12</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Community;
