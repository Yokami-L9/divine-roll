import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Plus, Pencil, Download, Eye, Layers, Library } from "lucide-react";
import MapEditor from "@/components/MapEditor";

const Maps = () => {
  const maps = [
    { name: "Королевство Элдарон", type: "Мировая карта", size: "4096x4096", date: "2024-01-15" },
    { name: "Город Светлый Порт", type: "Городская карта", size: "2048x2048", date: "2024-01-10" },
    { name: "Древние руины", type: "Подземелье", size: "1024x1024", date: "2024-01-05" },
    { name: "Тёмный лес", type: "Локация", size: "2048x2048", date: "2024-01-01" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Редактор карт</h1>
            <p className="text-muted-foreground">Создавайте карты миров, подземелий и городов</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Новая карта
          </Button>
        </div>

        <Tabs defaultValue="editor" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="editor" className="gap-2 data-[state=active]:bg-primary/20">
              <Pencil className="w-4 h-4" />
              Редактор
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2 data-[state=active]:bg-primary/20">
              <Library className="w-4 h-4" />
              Мои карты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <MapEditor />
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {maps.map((map, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-arcane relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <Map className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-foreground/20 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                      {map.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{map.type}</span>
                      <span className="text-xs text-muted-foreground">{map.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Maps;
