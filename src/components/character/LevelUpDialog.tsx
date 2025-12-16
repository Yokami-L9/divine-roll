import { useState, useEffect } from "react";
import { useClasses, CharacterClass, Subclass, SubclassFeature } from "@/hooks/useRulebook";
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
import { Separator } from "@/components/ui/separator";
import { Heart, Loader2, Sword, Wand2, Check, AlertTriangle, Sparkles, Star, ChevronRight } from "lucide-react";
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

// Subclass unlock levels by class (PHB)
const SUBCLASS_LEVELS: Record<string, number> = {
  "Бард": 3,
  "Варвар": 3,
  "Воин": 3,
  "Волшебник": 2,
  "Друид": 2,
  "Жрец": 1,
  "Колдун": 1,
  "Монах": 3,
  "Паладин": 3,
  "Плут": 3,
  "Следопыт": 3,
  "Чародей": 1,
  "Изобретатель": 3,
};

// ASI levels (PHB)
const ASI_LEVELS = [4, 8, 12, 16, 19];

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
  characterSubclasses: Record<string, string>;
  onLevelUp: (
    selectedClass: string, 
    newClassLevels: Record<string, number>, 
    hpIncrease: number,
    selectedSubclass: string | null,
    newSubclasses: Record<string, string>
  ) => void;
}

export function LevelUpDialog({
  open,
  onOpenChange,
  characterName,
  currentLevel,
  classLevels,
  primaryClass,
  abilities,
  characterSubclasses,
  onLevelUp,
}: LevelUpDialogProps) {
  const { data: classes, isLoading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);
  const [tab, setTab] = useState<"current" | "new">("current");
  const [step, setStep] = useState<"class" | "features">("class");

  const maxLevel = 20;
  const canLevelUp = currentLevel < maxLevel;

  // Get current classes
  const currentClasses = Object.keys(classLevels).filter(c => classLevels[c] > 0);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedClass(null);
      setSelectedSubclass(null);
      setTab("current");
      setStep("class");
    }
  }, [open]);

  // Check if character meets multiclass requirements
  const meetsRequirements = (className: string) => {
    const reqs = MULTICLASS_REQUIREMENTS[className];
    if (!reqs) return true;
    
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

  const getClassDetails = (className: string): CharacterClass | undefined => {
    return classes?.find(c => c.name === className);
  };

  // Get new level for selected class
  const getNewClassLevel = (className: string) => {
    return (classLevels[className] || 0) + 1;
  };

  // Check if subclass selection is needed
  const needsSubclassSelection = (className: string) => {
    const newLevel = getNewClassLevel(className);
    const subclassLevel = SUBCLASS_LEVELS[className] || 3;
    const hasSubclass = characterSubclasses[className];
    return newLevel === subclassLevel && !hasSubclass;
  };

  // Get features for the new level
  const getFeaturesForLevel = (className: string): { level: number; name: string; description: string }[] => {
    const cls = getClassDetails(className);
    if (!cls?.features) return [];
    const newLevel = getNewClassLevel(className);
    return cls.features.filter(f => f.level === newLevel);
  };

  // Get subclass features for the new level
  const getSubclassFeaturesForLevel = (className: string): SubclassFeature[] => {
    const cls = getClassDetails(className);
    if (!cls?.subclasses) return [];
    const subclassName = selectedSubclass || characterSubclasses[className];
    if (!subclassName) return [];
    
    const subclass = cls.subclasses.find(s => s.name === subclassName);
    if (!subclass?.features) return [];
    
    const newLevel = getNewClassLevel(className);
    return subclass.features.filter(f => f.level === newLevel);
  };

  // Check if this level grants ASI
  const isASILevel = (className: string) => {
    const newLevel = getNewClassLevel(className);
    // Воин gets extra ASI at 6 and 14
    if (className === "Воин") {
      return ASI_LEVELS.includes(newLevel) || newLevel === 6 || newLevel === 14;
    }
    // Плут gets extra ASI at 10
    if (className === "Плут") {
      return ASI_LEVELS.includes(newLevel) || newLevel === 10;
    }
    return ASI_LEVELS.includes(newLevel);
  };

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    setSelectedSubclass(null);
    
    // If needs subclass selection, go to features step
    if (needsSubclassSelection(className)) {
      setStep("features");
    } else {
      setStep("features");
    }
  };

  const handleLevelUp = () => {
    if (!selectedClass) return;

    const cls = classes?.find(c => c.name === selectedClass);
    if (!cls) return;

    // Check if subclass is needed but not selected
    if (needsSubclassSelection(selectedClass) && !selectedSubclass) {
      return;
    }

    // Calculate HP increase
    const conMod = Math.floor((abilities.constitution - 10) / 2);
    const hpIncrease = Math.floor(cls.hit_die / 2) + 1 + conMod;

    const newClassLevels = {
      ...classLevels,
      [selectedClass]: (classLevels[selectedClass] || 0) + 1,
    };

    const newSubclasses = selectedSubclass
      ? { ...characterSubclasses, [selectedClass]: selectedSubclass }
      : characterSubclasses;

    onLevelUp(selectedClass, newClassLevels, hpIncrease, selectedSubclass, newSubclasses);
    setSelectedClass(null);
    setSelectedSubclass(null);
    setStep("class");
    onOpenChange(false);
  };

  const selectedClassDetails = selectedClass ? getClassDetails(selectedClass) : null;
  const newClassLevel = selectedClass ? getNewClassLevel(selectedClass) : 0;
  const classFeatures = selectedClass ? getFeaturesForLevel(selectedClass) : [];
  const subclassFeatures = selectedClass ? getSubclassFeaturesForLevel(selectedClass) : [];
  const showASI = selectedClass ? isASILevel(selectedClass) : false;
  const showSubclassSelection = selectedClass ? needsSubclassSelection(selectedClass) : false;

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
        ) : step === "class" ? (
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
                      const iconKey = cls?.name_en?.toLowerCase().replace(/\s+/g, '-') || '';
                      const classIcon = classIcons[iconKey];
                      const classLevel = classLevels[className] || 0;
                      const subclassName = characterSubclasses[className];

                      return (
                        <Card
                          key={className}
                          className="cursor-pointer transition-all hover:border-primary/50"
                          onClick={() => handleSelectClass(className)}
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
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline">Уровень {classLevel} → {classLevel + 1}</Badge>
                                  {cls && (
                                    <Badge variant="secondary">
                                      <Heart className="h-3 w-3 mr-1" />+{Math.floor(cls.hit_die / 2) + 1} HP
                                    </Badge>
                                  )}
                                </div>
                                {subclassName && (
                                  <p className="text-xs text-muted-foreground mt-1">{subclassName}</p>
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

              <TabsContent value="new" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="grid gap-3">
                    {classes?.filter(c => !currentClasses.includes(c.name)).map(cls => {
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
                              : "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => canMulticlass && handleSelectClass(cls.name)}
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
                                  {canMulticlass ? (
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                  )}
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
          </>
        ) : (
          // Features step
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {/* Class header */}
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                  <Sword className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedClass}</h3>
                  <p className="text-sm text-muted-foreground">Уровень {newClassLevel}</p>
                </div>
              </div>

              {/* HP Increase */}
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Увеличение хитов</p>
                    <p className="text-sm text-muted-foreground">
                      +{selectedClassDetails ? Math.floor(selectedClassDetails.hit_die / 2) + 1 : 0} + модификатор Телосложения
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subclass Selection */}
              {showSubclassSelection && selectedClassDetails?.subclasses && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Выберите архетип</h4>
                  </div>
                  <div className="grid gap-2">
                    {selectedClassDetails.subclasses.map((subclass) => (
                      <Card
                        key={subclass.name}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedSubclass === subclass.name && "border-primary ring-2 ring-primary/20"
                        )}
                        onClick={() => setSelectedSubclass(subclass.name)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{subclass.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {subclass.description}
                              </p>
                            </div>
                            {selectedSubclass === subclass.name && (
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ASI notification */}
              {showASI && (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Увеличение характеристик</p>
                      <p className="text-sm text-muted-foreground">
                        Увеличьте одну характеристику на 2 или две на 1 (или выберите черту)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Class Features */}
              {classFeatures.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sword className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Способности класса</h4>
                  </div>
                  {classFeatures.map((feature, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-3">
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Subclass Features */}
              {subclassFeatures.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Способности архетипа</h4>
                  </div>
                  {subclassFeatures.map((feature, idx) => (
                    <Card key={idx} className="border-primary/30">
                      <CardContent className="p-3">
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No features message */}
              {classFeatures.length === 0 && subclassFeatures.length === 0 && !showASI && !showSubclassSelection && (
                <p className="text-center text-muted-foreground py-4">
                  На этом уровне нет новых способностей класса
                </p>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="mt-4">
          {step === "features" && (
            <Button variant="outline" onClick={() => setStep("class")}>
              Назад
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          {step === "features" && (
            <Button 
              onClick={handleLevelUp} 
              disabled={showSubclassSelection && !selectedSubclass}
            >
              Повысить уровень
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
