import { useState, useRef } from "react";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, MessageSquare, RotateCcw, ZoomIn, ZoomOut, Loader2, Cuboid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FigureGeneratorProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

export function FigureGenerator({ character, updateCharacter }: FigureGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [figureImage, setFigureImage] = useState<string | null>(character.avatar_url);
  const [customDescription, setCustomDescription] = useState("");
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFigure = async (mode: "auto" | "custom") => {
    if (mode === "custom" && !customDescription.trim()) {
      toast.error("Введите описание персонажа");
      return;
    }

    if (!character.race || !character.class) {
      toast.error("Сначала выберите расу и класс персонажа");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-figure", {
        body: {
          race: character.race,
          subrace: character.subrace,
          characterClass: character.class,
          equipment: character.equipment,
          customDescription: mode === "custom" ? customDescription : undefined,
          mode
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setFigureImage(data.imageUrl);
      updateCharacter({ avatar_url: data.imageUrl });
      toast.success("Фигурка сгенерирована!");
    } catch (error) {
      console.error("Error generating figure:", error);
      toast.error(error instanceof Error ? error.message : "Ошибка генерации фигурки");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation(prev => prev + delta * 0.5);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    setRotation(prev => prev + delta * 0.5);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation(0);
    setScale(1);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cuboid className="h-5 w-5" />
              Фигурка персонажа
            </CardTitle>
          </CardHeader>
          <CardContent>
            {figureImage ? (
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={figureImage} 
                  alt="Фигурка персонажа"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <Button size="sm" variant="secondary">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Изменить
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Cuboid className="h-12 w-12" />
                <p className="text-sm text-center">
                  Нажмите, чтобы сгенерировать<br />3D фигурку персонажа
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cuboid className="h-5 w-5" />
            Генератор фигурки персонажа
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Figure Viewer */}
          <div className="space-y-4">
            <div 
              ref={containerRef}
              className="relative aspect-[4/5] rounded-lg bg-gradient-to-b from-muted to-muted/50 overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {figureImage ? (
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-100"
                  style={{ 
                    transform: `perspective(1000px) rotateY(${rotation}deg) scale(${scale})`,
                  }}
                >
                  <img 
                    src={figureImage} 
                    alt="Фигурка персонажа"
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Cuboid className="h-24 w-24 opacity-30" />
                  <p className="text-center">
                    Сгенерируйте фигурку,<br />чтобы увидеть её здесь
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Генерация фигурки...</p>
                </div>
              )}

              {/* Round Base Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-full opacity-50" />
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 2}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Перетаскивайте для вращения • Используйте кнопки для масштабирования
            </p>
          </div>

          {/* Generation Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="auto" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="auto" className="flex items-center gap-1">
                  <Wand2 className="h-4 w-4" />
                  Авто
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Расширенная
                </TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Автоматически сгенерирует фигурку на основе выбранных параметров персонажа:
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Раса:</span>
                        <span className="font-medium">{character.race || "Не выбрана"} {character.subrace ? `(${character.subrace})` : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Класс:</span>
                        <span className="font-medium">{character.class || "Не выбран"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Снаряжение:</span>
                        <span className="font-medium text-right max-w-48 truncate">
                          {character.equipment.filter(e => e !== "__NO_EQUIPMENT__").length > 0 
                            ? character.equipment.filter(e => e !== "__NO_EQUIPMENT__").slice(0, 3).join(", ")
                            : "Не выбрано"}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => generateFigure("auto")}
                      disabled={isGenerating || !character.race || !character.class}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      Сгенерировать автоматически
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Опишите подробно, как должен выглядеть ваш персонаж. AI учтёт выбранную расу и класс, но сфокусируется на вашем описании.
                    </p>
                    
                    <Textarea
                      placeholder="Например: Высокий худощавый эльф с длинными серебристыми волосами, заплетёнными в косу. Носит потёртый кожаный плащ с капюшоном и зелёную тунику. На поясе висит изящный эльфийский клинок. Лицо украшено сложными татуировками, светящимися слабым магическим светом..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => generateFigure("custom")}
                        disabled={isGenerating || !customDescription.trim() || !character.race || !character.class}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Сгенерировать по описанию
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Советы для описания:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Опишите внешность: рост, телосложение, волосы, глаза</li>
                        <li>Укажите детали одежды и брони</li>
                        <li>Опишите оружие и аксессуары</li>
                        <li>Добавьте особые черты: шрамы, татуировки, украшения</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  Фигурка генерируется в стиле коллекционных дизайнерских игрушек, 
                  выполненных из полимерной глины с акварельной раскраской. 
                  Изображение можно вращать и масштабировать для детального осмотра.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
