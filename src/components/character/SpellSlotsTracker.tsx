import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// PHB Spell Slots by Class Level (Full Casters: Wizard, Cleric, Druid, Bard, Sorcerer)
const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1:  [2],
  2:  [3],
  3:  [4, 2],
  4:  [4, 3],
  5:  [4, 3, 2],
  6:  [4, 3, 3],
  7:  [4, 3, 3, 1],
  8:  [4, 3, 3, 2],
  9:  [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Half Casters: Paladin, Ranger (start at level 2)
const HALF_CASTER_SLOTS: Record<number, number[]> = {
  1:  [],
  2:  [2],
  3:  [3],
  4:  [3],
  5:  [4, 2],
  6:  [4, 2],
  7:  [4, 3],
  8:  [4, 3],
  9:  [4, 3, 2],
  10: [4, 3, 2],
  11: [4, 3, 3],
  12: [4, 3, 3],
  13: [4, 3, 3, 1],
  14: [4, 3, 3, 1],
  15: [4, 3, 3, 2],
  16: [4, 3, 3, 2],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2],
};

// Third Casters: Eldritch Knight, Arcane Trickster (start at level 3)
const THIRD_CASTER_SLOTS: Record<number, number[]> = {
  1:  [],
  2:  [],
  3:  [2],
  4:  [3],
  5:  [3],
  6:  [3],
  7:  [4, 2],
  8:  [4, 2],
  9:  [4, 2],
  10: [4, 3],
  11: [4, 3],
  12: [4, 3],
  13: [4, 3, 2],
  14: [4, 3, 2],
  15: [4, 3, 2],
  16: [4, 3, 3],
  17: [4, 3, 3],
  18: [4, 3, 3],
  19: [4, 3, 3, 1],
  20: [4, 3, 3, 1],
};

// Warlock Pact Magic (special - recovers on short rest)
const WARLOCK_SLOTS: Record<number, { slots: number; level: number }> = {
  1:  { slots: 1, level: 1 },
  2:  { slots: 2, level: 1 },
  3:  { slots: 2, level: 2 },
  4:  { slots: 2, level: 2 },
  5:  { slots: 2, level: 3 },
  6:  { slots: 2, level: 3 },
  7:  { slots: 2, level: 4 },
  8:  { slots: 2, level: 4 },
  9:  { slots: 2, level: 5 },
  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },
  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },
  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },
  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },
  20: { slots: 4, level: 5 },
};

const FULL_CASTERS = ["Волшебник", "Жрец", "Друид", "Бард", "Чародей"];
const HALF_CASTERS = ["Паладин", "Следопыт"];
const THIRD_CASTER_SUBCLASSES = ["Мистический рыцарь", "Магический ловкач"];

export interface SpellSlotState {
  max: number[];
  current: number[];
  pactSlots?: { max: number; current: number; level: number };
}

interface SpellSlotsTrackerProps {
  characterClass: string;
  classLevels: Record<string, number>;
  subclasses: Record<string, string>;
  initialState?: SpellSlotState;
  onChange?: (state: SpellSlotState) => void;
}

export function SpellSlotsTracker({
  characterClass,
  classLevels,
  subclasses,
  initialState,
  onChange,
}: SpellSlotsTrackerProps) {
  const [slots, setSlots] = useState<SpellSlotState>({ max: [], current: [] });

  // Calculate spell slots based on class and level
  useEffect(() => {
    const calculateSlots = () => {
      let maxSlots: number[] = [];
      let pactSlots: { max: number; current: number; level: number } | undefined;

      // Check each class the character has
      Object.entries(classLevels).forEach(([className, level]) => {
        if (level <= 0) return;

        // Warlock has special pact magic
        if (className === "Колдун") {
          const pact = WARLOCK_SLOTS[level];
          pactSlots = { max: pact.slots, current: pact.slots, level: pact.level };
          return;
        }

        let classSlots: number[] = [];
        
        if (FULL_CASTERS.includes(className)) {
          classSlots = FULL_CASTER_SLOTS[level] || [];
        } else if (HALF_CASTERS.includes(className)) {
          classSlots = HALF_CASTER_SLOTS[level] || [];
        } else if (className === "Воин" || className === "Плут") {
          // Check for spellcasting subclass
          const subclass = subclasses[className];
          if (subclass && THIRD_CASTER_SUBCLASSES.includes(subclass)) {
            classSlots = THIRD_CASTER_SLOTS[level] || [];
          }
        }

        // Combine slots (multiclass rules - simplified)
        if (classSlots.length > 0) {
          for (let i = 0; i < classSlots.length; i++) {
            if (i >= maxSlots.length) {
              maxSlots.push(classSlots[i]);
            } else {
              maxSlots[i] = Math.max(maxSlots[i], classSlots[i]);
            }
          }
        }
      });

      // Use initial state if provided, otherwise set current to max
      if (initialState) {
        setSlots({
          max: maxSlots,
          current: initialState.current.slice(0, maxSlots.length),
          pactSlots: pactSlots ? {
            ...pactSlots,
            current: initialState.pactSlots?.current ?? pactSlots.max
          } : undefined,
        });
      } else {
        setSlots({
          max: maxSlots,
          current: [...maxSlots],
          pactSlots,
        });
      }
    };

    calculateSlots();
  }, [classLevels, subclasses, initialState]);

  const useSlot = (level: number) => {
    setSlots(prev => {
      const newCurrent = [...prev.current];
      if (newCurrent[level] > 0) {
        newCurrent[level]--;
      }
      const newState = { ...prev, current: newCurrent };
      onChange?.(newState);
      return newState;
    });
  };

  const restoreSlot = (level: number) => {
    setSlots(prev => {
      const newCurrent = [...prev.current];
      if (newCurrent[level] < prev.max[level]) {
        newCurrent[level]++;
      }
      const newState = { ...prev, current: newCurrent };
      onChange?.(newState);
      return newState;
    });
  };

  const usePactSlot = () => {
    setSlots(prev => {
      if (!prev.pactSlots || prev.pactSlots.current <= 0) return prev;
      const newState = {
        ...prev,
        pactSlots: { ...prev.pactSlots, current: prev.pactSlots.current - 1 }
      };
      onChange?.(newState);
      return newState;
    });
  };

  const restorePactSlot = () => {
    setSlots(prev => {
      if (!prev.pactSlots || prev.pactSlots.current >= prev.pactSlots.max) return prev;
      const newState = {
        ...prev,
        pactSlots: { ...prev.pactSlots, current: prev.pactSlots.current + 1 }
      };
      onChange?.(newState);
      return newState;
    });
  };

  const shortRest = () => {
    setSlots(prev => {
      // Pact slots recover on short rest
      const newState = {
        ...prev,
        pactSlots: prev.pactSlots 
          ? { ...prev.pactSlots, current: prev.pactSlots.max }
          : undefined,
      };
      onChange?.(newState);
      return newState;
    });
  };

  const longRest = () => {
    setSlots(prev => {
      const newState = {
        max: prev.max,
        current: [...prev.max],
        pactSlots: prev.pactSlots 
          ? { ...prev.pactSlots, current: prev.pactSlots.max }
          : undefined,
      };
      onChange?.(newState);
      return newState;
    });
  };

  // No spell slots
  if (slots.max.length === 0 && !slots.pactSlots) {
    return null;
  }

  const SLOT_LEVEL_NAMES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ячейки заклинаний
          </CardTitle>
          <div className="flex gap-2">
            {slots.pactSlots && (
              <Button
                variant="outline"
                size="sm"
                onClick={shortRest}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Короткий отдых
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={longRest}
              className="text-xs"
            >
              <Moon className="h-3 w-3 mr-1" />
              Длинный отдых
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Regular spell slots */}
          {slots.max.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slots.max.map((maxCount, idx) => {
                const currentCount = slots.current[idx] || 0;
                const level = idx + 1;
                
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {level} круг
                      </span>
                      <Badge variant={currentCount > 0 ? "default" : "secondary"}>
                        {currentCount}/{maxCount}
                      </Badge>
                    </div>
                    
                    {/* Slot circles */}
                    <div className="flex gap-1 flex-wrap">
                      {Array.from({ length: maxCount }).map((_, slotIdx) => (
                        <button
                          key={slotIdx}
                          onClick={() => slotIdx < currentCount ? useSlot(idx) : restoreSlot(idx)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all",
                            slotIdx < currentCount
                              ? "bg-primary border-primary hover:bg-primary/80"
                              : "bg-background border-muted-foreground/30 hover:border-primary/50"
                          )}
                          title={slotIdx < currentCount ? "Использовать ячейку" : "Восстановить ячейку"}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-7"
                        onClick={() => useSlot(idx)}
                        disabled={currentCount <= 0}
                      >
                        Использовать
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Warlock Pact Magic */}
          {slots.pactSlots && (
            <div className="border-t pt-4">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-purple-400">
                    Магия договора ({slots.pactSlots.level} круг)
                  </span>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                    {slots.pactSlots.current}/{slots.pactSlots.max}
                  </Badge>
                </div>
                
                {/* Pact slot circles */}
                <div className="flex gap-1">
                  {Array.from({ length: slots.pactSlots.max }).map((_, slotIdx) => (
                    <button
                      key={slotIdx}
                      onClick={() => slotIdx < slots.pactSlots!.current ? usePactSlot() : restorePactSlot()}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        slotIdx < slots.pactSlots!.current
                          ? "bg-purple-500 border-purple-500 hover:bg-purple-400"
                          : "bg-background border-purple-500/30 hover:border-purple-500/50"
                      )}
                      title={slotIdx < slots.pactSlots!.current ? "Использовать ячейку" : "Восстановить ячейку"}
                    />
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-7 border-purple-500/30 hover:bg-purple-500/20"
                    onClick={usePactSlot}
                    disabled={slots.pactSlots.current <= 0}
                  >
                    Использовать
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Восстанавливаются при коротком отдыхе
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
