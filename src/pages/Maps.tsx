import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Plus, Pencil, Eye, Library, Trash2, Loader2, LogIn, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MapCanvas, MapState } from "@/components/map-editor";
import { useMaps, MapData } from "@/hooks/useMaps";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Maps = () => {
  const { maps, loading, createMap, updateMap, deleteMap } = useMaps();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");
  const [editingMap, setEditingMap] = useState<MapData | null>(null);
  const [newMap, setNewMap] = useState({
    name: "",
    type: "world",
  });

  const mapTypes = [
    { value: "world", label: "Мировая карта" },
    { value: "city", label: "Городская карта" },
    { value: "dungeon", label: "Подземелье" },
    { value: "location", label: "Локация" },
    { value: "battle", label: "Боевая карта" },
  ];

  const getTypeLabel = (type: string) => {
    return mapTypes.find(t => t.value === type)?.label || type;
  };

  const handleCreateMap = async () => {
    if (!newMap.name.trim()) return;

    const result = await createMap({
      name: newMap.name,
      type: newMap.type,
      data: {},
    });

    if (result) {
      setNewMap({ name: "", type: "world" });
      setIsDialogOpen(false);
      // Open the new map in editor
      setEditingMap(result as MapData);
      setActiveTab("editor");
    }
  };

  const handleOpenMap = (map: MapData) => {
    setEditingMap(map);
    setActiveTab("editor");
  };

  const handleSaveMap = async (data: MapState) => {
    if (!editingMap) return;

    const result = await updateMap(editingMap.id, {
      data: data as unknown as MapData['data'],
    });

    if (result) {
      setEditingMap(prev => prev ? { ...prev, data: data as unknown as MapData['data'] } : null);
      toast({
        title: "Сохранено",
        description: "Карта успешно сохранена",
      });
    }
  };

  const handleBackToGallery = () => {
    setEditingMap(null);
    setActiveTab("gallery");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-12 text-center bg-card border-border">
            <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-serif font-bold mb-2">Войдите для доступа к картам</h2>
            <p className="text-muted-foreground mb-6">
              Создавайте и сохраняйте карты ваших миров
            </p>
            <Link to="/auth">
              <Button className="bg-gradient-gold hover:opacity-90 gap-2">
                <LogIn className="w-4 h-4" />
                Войти
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {editingMap && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToGallery}
                className="h-10 w-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-2">
                {editingMap ? editingMap.name : "Редактор карт"}
              </h1>
              <p className="text-muted-foreground">
                {editingMap
                  ? `${getTypeLabel(editingMap.type)} • Создана ${new Date(editingMap.created_at).toLocaleDateString('ru-RU')}`
                  : "Создавайте карты миров, подземелий и городов"}
              </p>
            </div>
          </div>
          {!editingMap && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-gold hover:opacity-90 gap-2">
                  <Plus className="w-4 h-4" />
                  Новая карта
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-serif">Создать карту</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Название карты</Label>
                    <Input
                      placeholder="Королевство Элдарон"
                      value={newMap.name}
                      onChange={(e) => setNewMap(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Тип карты</Label>
                    <Select
                      value={newMap.type}
                      onValueChange={(value) => setNewMap(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mapTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreateMap}
                    className="w-full bg-gradient-gold hover:opacity-90"
                    disabled={!newMap.name.trim()}
                  >
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {editingMap ? (
          <MapCanvas
            width={1200}
            height={800}
            initialData={editingMap.data as object | null}
            onSave={handleSaveMap}
            mapId={editingMap.id}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="gallery" className="gap-2 data-[state=active]:bg-primary/20">
                <Library className="w-4 h-4" />
                Мои карты
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : maps.length === 0 ? (
                <Card className="p-12 text-center bg-card border-border">
                  <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-serif font-semibold mb-2">Нет сохранённых карт</h3>
                  <p className="text-muted-foreground mb-6">Создайте первую карту вашего мира</p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-gold hover:opacity-90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Создать карту
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {maps.map((map) => (
                    <Card
                      key={map.id}
                      className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
                      onClick={() => handleOpenMap(map)}
                    >
                      <div className="h-40 bg-gradient-arcane relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/40"></div>
                        <Map className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-foreground/20 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMap(map);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMap(map.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                          {map.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{getTypeLabel(map.type)}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(map.created_at).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Maps;
