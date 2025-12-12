import { useState } from "react";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wand2, MessageSquare, Loader2, Cuboid, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Figure3DViewer } from "./Figure3DViewer";

interface FigureGeneratorProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

export function FigureGenerator({ character, updateCharacter }: FigureGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [figureImage, setFigureImage] = useState<string | null>(character.avatar_url);
  const [customDescription, setCustomDescription] = useState("");
  const [autoRotate, setAutoRotate] = useState(true);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cuboid className="h-5 w-5" />
              3D Фигурка
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
                    <Cuboid className="h-3 w-3 mr-1" />
                    Открыть 3D
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Cuboid className="h-12 w-12" />
                <p className="text-sm text-center">
                  Нажмите, чтобы создать<br />3D-фигурку персонажа
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cuboid className="h-5 w-5" />
            Генератор 3D-фигурки
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 3D Viewer */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Figure3DViewer 
                imageUrl={figureImage} 
                isLoading={isGenerating}
                autoRotate={autoRotate}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Вращайте фигурку мышкой
              </p>
              <div className="flex items-center gap-2">
                <Switch 
                  id="auto-rotate" 
                  checked={autoRotate} 
                  onCheckedChange={setAutoRotate}
                />
                <Label htmlFor="auto-rotate" className="text-xs cursor-pointer">
                  Автоповорот
                </Label>
              </div>
            </div>
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
                      Автоматически создаст фигурку на основе параметров персонажа:
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
                      Сгенерировать фигурку
                    </Button>

                    {figureImage && (
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={() => generateFigure("auto")}
                        disabled={isGenerating}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Перегенерировать
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Опишите подробно внешний вид вашего персонажа:
                    </p>
                    
                    <Textarea
                      placeholder="Например: Высокий эльф-воин в серебряных доспехах с золотыми узорами. Длинные белые волосы, острые уши. В руках держит светящийся меч..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />

                    <Button 
                      className="w-full" 
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

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Советы:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Опишите позу и выражение лица</li>
                        <li>Укажите детали одежды и брони</li>
                        <li>Добавьте оружие и аксессуары</li>
                        <li>Опишите особые эффекты (свечение, ауру)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Фигурка генерируется в стиле коллекционных миниатюр из полимерной глины 
                  с акварельной раскраской. Изображение отображается на изогнутой 3D-поверхности 
                  с автоматическим вращением для обзора.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
