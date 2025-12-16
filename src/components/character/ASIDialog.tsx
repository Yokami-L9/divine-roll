import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Minus, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ABILITY_NAMES: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
};

interface Feat {
  id: string;
  name: string;
  name_en: string | null;
  description: string;
  prerequisite: string | null;
  benefits: unknown;
}

interface ASIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAbilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  onConfirm: (
    abilityChanges: Record<string, number>,
    selectedFeat: string | null
  ) => void;
}

export function ASIDialog({
  open,
  onOpenChange,
  currentAbilities,
  onConfirm,
}: ASIDialogProps) {
  const [tab, setTab] = useState<"asi" | "feat">("asi");
  const [abilityChanges, setAbilityChanges] = useState<Record<string, number>>({});
  const [selectedFeat, setSelectedFeat] = useState<string | null>(null);

  const { data: feats } = useQuery({
    queryKey: ["feats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feats")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Feat[];
    },
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setAbilityChanges({});
      setSelectedFeat(null);
      setTab("asi");
    }
  }, [open]);

  const totalPoints = Object.values(abilityChanges).reduce((sum, val) => sum + val, 0);
  const canAddMore = totalPoints < 2;

  const handleAbilityChange = (ability: string, delta: number) => {
    const currentChange = abilityChanges[ability] || 0;
    const newChange = currentChange + delta;
    const currentValue = currentAbilities[ability as keyof typeof currentAbilities];
    
    // Can't go below 0 change or above 2 change per ability
    if (newChange < 0 || newChange > 2) return;
    
    // Can't exceed 20
    if (currentValue + newChange > 20) return;
    
    // Check total points
    const newTotal = totalPoints - currentChange + newChange;
    if (newTotal > 2) return;

    setAbilityChanges({
      ...abilityChanges,
      [ability]: newChange,
    });
  };

  const handleConfirm = () => {
    if (tab === "asi") {
      onConfirm(abilityChanges, null);
    } else {
      onConfirm({}, selectedFeat);
    }
    onOpenChange(false);
  };

  const isValid = tab === "asi" ? totalPoints === 2 : selectedFeat !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Увеличение характеристик
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "asi" | "feat")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="asi">Характеристики</TabsTrigger>
            <TabsTrigger value="feat">Черта</TabsTrigger>
          </TabsList>

          <TabsContent value="asi" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Распределите 2 очка: +2 к одной характеристике или +1 к двум
            </p>
            
            <div className="space-y-3">
              {Object.entries(ABILITY_NAMES).map(([key, name]) => {
                const currentValue = currentAbilities[key as keyof typeof currentAbilities];
                const change = abilityChanges[key] || 0;
                const newValue = currentValue + change;
                const canIncrease = canAddMore || change < 2;
                const canDecrease = change > 0;

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      change > 0 && "border-primary bg-primary/5"
                    )}
                  >
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentValue} → {newValue}
                        {change > 0 && (
                          <span className="text-green-500 ml-1">(+{change})</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={!canDecrease}
                        onClick={() => handleAbilityChange(key, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={!canIncrease || newValue >= 20}
                        onClick={() => handleAbilityChange(key, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg text-center">
              <span className="text-sm">
                Очков использовано: <strong>{totalPoints}</strong> / 2
              </span>
            </div>
          </TabsContent>

          <TabsContent value="feat" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Вместо увеличения характеристик вы можете выбрать черту
            </p>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-4">
                {feats?.map((feat) => (
                  <Card
                    key={feat.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedFeat === feat.name && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedFeat(feat.name)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <p className="font-medium">{feat.name}</p>
                          </div>
                          {feat.prerequisite && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Требование: {feat.prerequisite}
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
