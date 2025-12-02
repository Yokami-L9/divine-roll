import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Plus, Pencil, Download, Eye } from "lucide-react";

const Maps = () => {
  const maps = [
    { name: "Королевство Элдарон", type: "Мировая карта", size: "4096x4096" },
    { name: "Город Светлый Порт", type: "Городская карта", size: "2048x2048" },
    { name: "Древние руины", type: "Подземелье", size: "1024x1024" },
    { name: "Тёмный лес", type: "Локация", size: "2048x2048" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Генератор карт
            </h1>
            <p className="text-muted-foreground">
              Создавайте профессиональные карты как в Inkarnate
            </p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать карту
          </Button>
        </div>

        <div className="mb-12 p-8 bg-gradient-arcane rounded-lg">
          <div className="text-center max-w-3xl mx-auto">
            <Map className="w-16 h-16 text-primary mx-auto mb-4 gold-glow" />
            <h2 className="text-3xl font-serif font-bold mb-4">
              Полноценный редактор карт
            </h2>
            <p className="text-muted-foreground mb-6">
              Используйте слои, кисти, текстуры и символы для создания детализированных карт
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {["Ландшафт", "Символы", "Текст", "Эффекты"].map((feature) => (
                <Card key={feature} className="p-4 bg-card border-primary/50">
                  <p className="font-semibold">{feature}</p>
                </Card>
              ))}
            </div>
            <Button className="bg-gradient-gold hover:opacity-90 px-8">
              Открыть редактор
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-serif font-semibold mb-4">Ваши карты</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {maps.map((map, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group"
            >
              <div className="h-48 bg-gradient-arcane relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40"></div>
                <Map className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-foreground/20 group-hover:scale-110 transition-transform" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                  {map.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-secondary/20 rounded text-xs">
                      {map.type}
                    </span>
                    <span className="px-2 py-1 bg-primary/20 rounded text-xs">
                      {map.size}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <Pencil className="w-4 h-4" />
                    Редактировать
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Maps;
