import { useState, useEffect, useRef } from "react";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Wand2, MessageSquare, Loader2, Cuboid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Figure3DViewer } from "./Figure3DViewer";

interface FigureGeneratorProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

type TaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "EXPIRED";

export function FigureGenerator({ character, updateCharacter }: FigureGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(character.avatar_url);
  const [customDescription, setCustomDescription] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for task status
  useEffect(() => {
    if (!taskId || !isGenerating) return;

    const pollStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-3d-figure", {
          body: { action: "status", taskId }
        });

        if (error) throw error;

        console.log("Poll result:", data);
        setTaskStatus(data.status);
        setProgress(Math.round((data.progress || 0) * 100));

        if (data.status === "SUCCEEDED") {
          setModelUrl(data.modelUrl);
          setThumbnailUrl(data.thumbnailUrl);
          setIsGenerating(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          toast.success("3D-фигурка готова!");
          
          // Save thumbnail as avatar
          if (data.thumbnailUrl) {
            updateCharacter({ avatar_url: data.thumbnailUrl });
          }
        } else if (data.status === "FAILED" || data.status === "EXPIRED") {
          setIsGenerating(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          toast.error("Ошибка генерации 3D-модели");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    pollingRef.current = setInterval(pollStatus, 5000);
    pollStatus(); // Initial poll

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [taskId, isGenerating, updateCharacter]);

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
    setProgress(0);
    setTaskStatus("PENDING");
    setModelUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-3d-figure", {
        body: {
          action: "generate",
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

      setTaskId(data.taskId);
      toast.info("Генерация 3D-модели начата. Это может занять 1-3 минуты.");
    } catch (error) {
      console.error("Error starting generation:", error);
      toast.error(error instanceof Error ? error.message : "Ошибка запуска генерации");
      setIsGenerating(false);
    }
  };

  const getStatusText = () => {
    switch (taskStatus) {
      case "PENDING": return "Ожидание в очереди...";
      case "IN_PROGRESS": return "Генерация модели...";
      case "SUCCEEDED": return "Готово!";
      case "FAILED": return "Ошибка";
      case "EXPIRED": return "Истекло время";
      default: return "";
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
            {thumbnailUrl ? (
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={thumbnailUrl} 
                  alt="3D фигурка персонажа"
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
            3D Генератор фигурки
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 3D Viewer */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Figure3DViewer 
                modelUrl={modelUrl} 
                isLoading={isGenerating}
              />
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{getStatusText()}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Вращайте модель мышкой • Колёсико для масштаба
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
                      Автоматически создаст 3D-фигурку на основе параметров персонажа:
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
                      Сгенерировать 3D-фигурку
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Опишите подробно внешний вид вашего персонажа для 3D-генерации:
                    </p>
                    
                    <Textarea
                      placeholder="Например: Высокий эльф-воин в серебряных доспехах с золотыми узорами. Длинные белые волосы, острые уши. В руках держит светящийся меч. На плече сидит маленький дракон..."
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
                  <strong>О генерации:</strong>
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Генерация занимает 1-3 минуты</li>
                  <li>Результат — полноценная 3D-модель</li>
                  <li>Модель можно вращать и рассматривать со всех сторон</li>
                  <li>Используется Meshy AI для генерации</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
