import { CharacterClass, Subclass } from "@/hooks/useRulebook";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SubclassSelectorProps {
  characterClass: CharacterClass;
  characterLevel: number;
  selectedSubclass: string | null;
  onSelect: (subclassName: string) => void;
}

export function SubclassSelector({
  characterClass,
  characterLevel,
  selectedSubclass,
  onSelect,
}: SubclassSelectorProps) {
  const subclassLevel = SUBCLASS_LEVELS[characterClass.name] || 3;
  const needsSubclass = characterLevel >= subclassLevel;

  if (!needsSubclass || !characterClass.subclasses || characterClass.subclasses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h4 className="font-semibold">Выберите архетип</h4>
        <Badge variant="secondary" className="text-xs">
          Требуется на уровне {subclassLevel}
        </Badge>
      </div>
      
      <ScrollArea className="max-h-[300px]">
        <div className="grid gap-2 pr-4">
          {characterClass.subclasses.map((subclass) => {
            const isSelected = selectedSubclass === subclass.name;
            
            return (
              <Card
                key={subclass.name}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  isSelected && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => onSelect(subclass.name)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{subclass.name}</p>
                        {subclass.name_en && (
                          <span className="text-xs text-muted-foreground">
                            ({subclass.name_en})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {subclass.description}
                      </p>
                      {subclass.features && subclass.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {subclass.features
                            .filter(f => f.level <= characterLevel)
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature.name}
                              </Badge>
                            ))}
                          {subclass.features.filter(f => f.level <= characterLevel).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{subclass.features.filter(f => f.level <= characterLevel).length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export { SUBCLASS_LEVELS };
