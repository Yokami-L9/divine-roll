import { useState } from "react";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, MessageSquare, RotateCcw, Loader2, Cuboid, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FigureGeneratorProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

type ViewAngle = "front" | "left" | "right" | "back";

const VIEW_ANGLES: { key: ViewAngle; label: string; prompt: string }[] = [
  { key: "front", label: "Спереди", prompt: "front view, facing camera" },
  { key: "left", label: "Слева", prompt: "left side view, profile" },
  { key: "back", label: "Сзади", prompt: "back view, from behind" },
  { key: "right", label: "Справа", prompt: "right side view, profile" },
];

export function FigureGenerator({ character, updateCharacter }: FigureGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingAngle, setGeneratingAngle] = useState<ViewAngle | null>(null);
  const [figureImages, setFigureImages] = useState<Record<ViewAngle, string | null>>({
    front: character.avatar_url || null,
    left: null,
    right: null,
    back: null,
  });
  const [currentAngle, setCurrentAngle] = useState<ViewAngle>("front");
  const [customDescription, setCustomDescription] = useState("");

  const generateFigure = async (mode: "auto" | "custom", angle: ViewAngle = "front") => {
    if (mode === "custom" && !customDescription.trim()) {
      toast.error("Введите описание персонажа");
      return;
    }

    if (!character.race || !character.class) {
      toast.error("Сначала выберите расу и класс персонажа");
      return;
    }

    setIsGenerating(true);
    setGeneratingAngle(angle);
    
    try {
      const anglePrompt = VIEW_ANGLES.find(a => a.key === angle)?.prompt || "front view";
      
      const { data, error } = await supabase.functions.invoke("generate-figure", {
        body: {
          race: character.race,
          subrace: character.subrace,
          characterClass: character.class,
          equipment: character.equipment,
          customDescription: mode === "custom" ? customDescription : undefined,
          mode,
          anglePrompt
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setFigureImages(prev => ({ ...prev, [angle]: data.imageUrl }));
      setCurrentAngle(angle);
      
      // Save front view as avatar
      if (angle === "front") {
        updateCharacter({ avatar_url: data.imageUrl });
      }
      
      toast.success(`Фигурка (${VIEW_ANGLES.find(a => a.key === angle)?.label}) сгенерирована!`);
    } catch (error) {
      console.error("Error generating figure:", error);
      toast.error(error instanceof Error ? error.message : "Ошибка генерации фигурки");
    } finally {
      setIsGenerating(false);
      setGeneratingAngle(null);
    }
  };

  const generateAllAngles = async (mode: "auto" | "custom") => {
    for (const angle of VIEW_ANGLES) {
      await generateFigure(mode, angle.key);
    }
  };

  const rotateLeft = () => {
    const currentIndex = VIEW_ANGLES.findIndex(a => a.key === currentAngle);
    const newIndex = (currentIndex - 1 + VIEW_ANGLES.length) % VIEW_ANGLES.length;
    setCurrentAngle(VIEW_ANGLES[newIndex].key);
  };

  const rotateRight = () => {
    const currentIndex = VIEW_ANGLES.findIndex(a => a.key === currentAngle);
    const newIndex = (currentIndex + 1) % VIEW_ANGLES.length;
    setCurrentAngle(VIEW_ANGLES[newIndex].key);
  };

  const currentImage = figureImages[currentAngle];
  const hasAnyImage = Object.values(figureImages).some(img => img !== null);
  const allAnglesGenerated = Object.values(figureImages).every(img => img !== null);

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
            {figureImages.front ? (
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={figureImages.front} 
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
                  Нажмите, чтобы сгенерировать<br />фигурку персонажа
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
            <div className="relative aspect-[4/5] rounded-lg bg-gradient-to-b from-muted to-muted/50 overflow-hidden">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={`Фигурка персонажа - ${VIEW_ANGLES.find(a => a.key === currentAngle)?.label}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Cuboid className="h-24 w-24 opacity-30" />
                  <p className="text-center text-sm">
                    {hasAnyImage 
                      ? `Ракурс "${VIEW_ANGLES.find(a => a.key === currentAngle)?.label}" ещё не сгенерирован`
                      : "Сгенерируйте фигурку,\nчтобы увидеть её здесь"}
                  </p>
                </div>
              )}

              {isGenerating && generatingAngle === currentAngle && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Генерация...</p>
                </div>
              )}

              {/* Round Base */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-full opacity-60 blur-sm" />
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={rotateLeft} disabled={!hasAnyImage}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-1">
                {VIEW_ANGLES.map((angle) => (
                  <Button
                    key={angle.key}
                    variant={currentAngle === angle.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentAngle(angle.key)}
                    className="relative"
                  >
                    {angle.label}
                    {figureImages[angle.key] && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    {isGenerating && generatingAngle === angle.key && (
                      <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                    )}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="icon" onClick={rotateRight} disabled={!hasAnyImage}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Используйте кнопки для просмотра с разных ракурсов • Зелёная точка = ракурс сгенерирован
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

                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => generateFigure("auto", currentAngle)}
                        disabled={isGenerating || !character.race || !character.class}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        Сгенерировать ({VIEW_ANGLES.find(a => a.key === currentAngle)?.label})
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={() => generateAllAngles("auto")}
                        disabled={isGenerating || !character.race || !character.class}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Сгенерировать все ракурсы (4 шт)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Опишите подробно, как должен выглядеть ваш персонаж:
                    </p>
                    
                    <Textarea
                      placeholder="Например: Высокий худощавый эльф с длинными серебристыми волосами, заплетёнными в косу. Носит потёртый кожаный плащ с капюшоном..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />

                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => generateFigure("custom", currentAngle)}
                        disabled={isGenerating || !customDescription.trim() || !character.race || !character.class}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Сгенерировать ({VIEW_ANGLES.find(a => a.key === currentAngle)?.label})
                      </Button>

                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={() => generateAllAngles("custom")}
                        disabled={isGenerating || !customDescription.trim() || !character.race || !character.class}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Сгенерировать все ракурсы (4 шт)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Progress */}
            {hasAnyImage && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Сгенерировано ракурсов:</span>
                    <span className="font-medium">
                      {Object.values(figureImages).filter(img => img !== null).length} / 4
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ 
                        width: `${(Object.values(figureImages).filter(img => img !== null).length / 4) * 100}%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
