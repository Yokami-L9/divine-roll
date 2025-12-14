import { useState } from "react";
import { useClasses, CharacterClass } from "@/hooks/useRulebook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2, Sword, Wand2, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// PHB Multiclass Requirements
const MULTICLASS_REQUIREMENTS: Record<string, { ability: string; minScore: number }[]> = {
  "Бард": [{ ability: "charisma", minScore: 13 }],
  "Варвар": [{ ability: "strength", minScore: 13 }],
  "Воин": [{ ability: "strength", minScore: 13 }, { ability: "dexterity", minScore: 13 }],
  "Волшебник": [{ ability: "intelligence", minScore: 13 }],
  "Друид": [{ ability: "wisdom", minScore: 13 }],
  "Жрец": [{ ability: "wisdom", minScore: 13 }],
  "Изобретатель": [{ ability: "intelligence", minScore: 13 }],
  "Колдун": [{ ability: "charisma", minScore: 13 }],
  "Монах": [{ ability: "dexterity", minScore: 13 }, { ability: "wisdom", minScore: 13 }],
  "Паладин": [{ ability: "strength", minScore: 13 }, { ability: "charisma", minScore: 13 }],
  "Плут": [{ ability: "dexterity", minScore: 13 }],
  "Следопыт": [{ ability: "dexterity", minScore: 13 }, { ability: "wisdom", minScore: 13 }],
  "Чародей": [{ ability: "charisma", minScore: 13 }],
};

const ABILITY_NAMES_RU: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
};

// Import class icons
const classIconsContext = import.meta.glob('@/assets/classes/*.png', { eager: true, import: 'default' });
const classIcons: Record<string, string> = {};
Object.entries(classIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  classIcons[fileName] = module as string;
});

interface LevelUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterName: string;
  currentLevel: number;
  classLevels: Record<string, number>;
  primaryClass: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  onLevelUp: (selectedClass: string, newClassLevels: Record<string, number>, hpIncrease: number) => void;
}

export function LevelUpDialog({
  open,
  onOpenChange,
  characterName,
  currentLevel,
  classLevels,
  primaryClass,
  abilities,
  onLevelUp,
}: LevelUpDialogProps) {
  const { data: classes, isLoading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [tab, setTab] = useState<"current" | "new">("current");

  const maxLevel = 20;
  const canLevelUp = currentLevel < maxLevel;

  // Get current classes
  const currentClasses = Object.keys(classLevels).filter(c => classLevels[c] > 0);

  // Check if character meets multiclass requirements
  const meetsRequirements = (className: string) => {
    const reqs = MULTICLASS_REQUIREMENTS[className];
    if (!reqs) return true;
    
    // Must meet requirements for BOTH current class and new class
    const primaryReqs = MULTICLASS_REQUIREMENTS[primaryClass];
    if (primaryReqs) {
      const meetsPrimary = primaryReqs.every(req => {
        const abilityValue = abilities[req.ability as keyof typeof abilities];
        return abilityValue >= req.minScore;
      });
      if (!meetsPrimary) return false;
    }
    
    return reqs.every(req => {
      const abilityValue = abilities[req.ability as keyof typeof abilities];
      return abilityValue >= req.minScore;
    });
  };

  const getRequirementText = (className: string) => {
    const reqs = MULTICLASS_REQUIREMENTS[className];
    if (!reqs) return "";
    return reqs
      .map(r => `${ABILITY_NAMES_RU[r.ability]} ${r.minScore}+`)
      .join(", ");
  };

  const handleLevelUp = () => {
    if (!selectedClass) return;

    const cls = classes?.find(c => c.name === selectedClass);
    if (!cls) return;

    // Calculate HP increase (average + CON mod for levels after 1st)
    const conMod = Math.floor((abilities.constitution - 10) / 2);
    const isFirstLevelInClass = !classLevels[selectedClass] || classLevels[selectedClass] === 0;
    
    let hpIncrease: number;
    if (isFirstLevelInClass) {
      // First level in a new class (multiclassing): use hit die average
      hpIncrease = Math.floor(cls.hit_die / 2) + 1 + conMod;
    } else {
      // Subsequent levels: use average
      hpIncrease = Math.floor(cls.hit_die / 2) + 1 + conMod;
    }

    const newClassLevels = {
      ...classLevels,
      [selectedClass]: (classLevels[selectedClass] || 0) + 1,
    };

    onLevelUp(selectedClass, newClassLevels, hpIncrease);
    setSelectedClass(null);
    onOpenChange(false);
  };

  const getClassDetails = (className: string) => {
    return classes?.find(c => c.name === className);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Повышение уровня: {characterName}
            <Badge variant="secondary">Уровень {currentLevel} → {currentLevel + 1}</Badge>
          </DialogTitle>
        </DialogHeader>

        {!canLevelUp ? (
          <div className="text-center py-8 text-muted-foreground">
            Персонаж достиг максимального уровня (20)
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "current" | "new")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="current">Текущие классы</TabsTrigger>
                <TabsTrigger value="new">Мультикласс</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="grid gap-3">
                    {currentClasses.map(className => {
                      const cls = getClassDetails(className);
                      const isSelected = selectedClass === className;
                      const iconKey = cls?.name_en?.toLowerCase().replace(/\s+/g, '-') || '';
                      const classIcon = classIcons[iconKey];
                      const classLevel = classLevels[className] || 0;

                      return (
                        <Card
                          key={className}
                          className={cn(
                            "cursor-pointer transition-all hover:border-primary/50",
                            isSelected && "border-primary ring-2 ring-primary/20"
                          )}
                          onClick={() => setSelectedClass(className)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              {classIcon ? (
                                <img src={classIcon} alt={className} className="w-12 h-12 rounded" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                  <Sword className="h-6 w-6" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">{className}</span>
                                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline">Уровень {classLevel}</Badge>
                                  {cls && (
                                    <Badge variant="secondary">
                                      <Heart className="h-3 w-3 mr-1" />+{Math.floor(cls.hit_die / 2) + 1} HP
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="new" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="grid gap-3">
                    {classes?.filter(c => !currentClasses.includes(c.name)).map(cls => {
                      const isSelected = selectedClass === cls.name;
                      const canMulticlass = meetsRequirements(cls.name);
                      const iconKey = cls.name_en?.toLowerCase().replace(/\s+/g, '-') || '';
                      const classIcon = classIcons[iconKey];
                      const hasSpellcasting = cls.spellcasting !== null;

                      return (
                        <Card
                          key={cls.id}
                          className={cn(
                            "transition-all",
                            canMulticlass 
                              ? "cursor-pointer hover:border-primary/50" 
                              : "opacity-50 cursor-not-allowed",
                            isSelected && canMulticlass && "border-primary ring-2 ring-primary/20"
                          )}
                          onClick={() => canMulticlass && setSelectedClass(cls.name)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              {classIcon ? (
                                <img src={classIcon} alt={cls.name} className="w-12 h-12 rounded" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                  <Sword className="h-6 w-6" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">{cls.name}</span>
                                  {isSelected && canMulticlass && <Check className="h-5 w-5 text-primary" />}
                                  {!canMulticlass && <AlertTriangle className="h-5 w-5 text-destructive" />}
                                </div>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  <Badge variant="secondary">
                                    <Heart className="h-3 w-3 mr-1" />к{cls.hit_die}
                                  </Badge>
                                  {hasSpellcasting && (
                                    <Badge variant="default">
                                      <Wand2 className="h-3 w-3 mr-1" />Магия
                                    </Badge>
                                  )}
                                </div>
                                {!canMulticlass && (
                                  <p className="text-xs text-destructive mt-1">
                                    Требуется: {getRequirementText(cls.name)}
                                  </p>
                                )}
                                {canMulticlass && MULTICLASS_REQUIREMENTS[cls.name] && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Требования: {getRequirementText(cls.name)} ✓
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={handleLevelUp} disabled={!selectedClass}>
                Повысить уровень
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
