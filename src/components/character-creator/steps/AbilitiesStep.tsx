import { useState, useEffect, useCallback } from "react";
import { CharacterData, ABILITY_NAMES, STANDARD_ARRAY, POINT_BUY_COSTS } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface AbilitiesStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
  getModifier: (score: number) => number;
}

type AbilityKey = keyof typeof ABILITY_NAMES;

const INITIAL_ASSIGNMENTS: Record<AbilityKey, number | null> = {
  strength: null,
  dexterity: null,
  constitution: null,
  intelligence: null,
  wisdom: null,
  charisma: null,
};

export function AbilitiesStep({ character, updateCharacter, getModifier }: AbilitiesStepProps) {
  const [standardAssignments, setStandardAssignments] = useState<Record<AbilityKey, number | null>>(INITIAL_ASSIGNMENTS);

  const abilities: AbilityKey[] = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  // Reset standard assignments when switching to standard method
  useEffect(() => {
    if (character.abilityMethod === "standard") {
      // Check if current character abilities match standard array
      const charAbilities = abilities.map(a => character[a]).sort((a, b) => b - a);
      const sortedStandard = [...STANDARD_ARRAY].sort((a, b) => b - a);
      const isStandardArray = JSON.stringify(charAbilities) === JSON.stringify(sortedStandard);
      
      if (isStandardArray) {
        // Reconstruct assignments from character data
        const newAssignments: Record<AbilityKey, number | null> = { ...INITIAL_ASSIGNMENTS };
        abilities.forEach(ability => {
          newAssignments[ability] = character[ability];
        });
        setStandardAssignments(newAssignments);
      } else {
        // Reset to empty
        setStandardAssignments(INITIAL_ASSIGNMENTS);
      }
    }
  }, [character.abilityMethod]);

  // Point buy calculations
  const pointsSpent = abilities.reduce((sum, ability) => {
    return sum + (POINT_BUY_COSTS[character[ability]] || 0);
  }, 0);
  const pointsRemaining = 27 - pointsSpent;

  const handleMethodChange = (method: "standard" | "pointbuy" | "manual") => {
    // Reset standard assignments when switching away from standard
    if (method !== "standard") {
      setStandardAssignments(INITIAL_ASSIGNMENTS);
    }
    
    // Reset abilities when changing method
    if (method === "standard") {
      updateCharacter({
        abilityMethod: method,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      });
      setStandardAssignments(INITIAL_ASSIGNMENTS);
    } else if (method === "pointbuy") {
      updateCharacter({
        abilityMethod: method,
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      });
    } else if (method === "manual") {
      updateCharacter({
        abilityMethod: method,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      });
    }
  };

  const handleStandardAssign = (ability: AbilityKey, value: string) => {
    const numValue = parseInt(value);
    
    // Find if this value was already assigned elsewhere
    const previousAbility = Object.entries(standardAssignments).find(
      ([, v]) => v === numValue
    )?.[0] as AbilityKey | undefined;
    
    // Swap or assign
    const newAssignments = { ...standardAssignments };
    
    if (previousAbility && previousAbility !== ability) {
      newAssignments[previousAbility] = standardAssignments[ability];
    }
    
    newAssignments[ability] = numValue;
    setStandardAssignments(newAssignments);
    
    // Update character
    const updates: Partial<CharacterData> = {};
    Object.entries(newAssignments).forEach(([key, val]) => {
      if (val !== null) {
        updates[key as AbilityKey] = val;
      }
    });
    updateCharacter(updates);
  };

  const handlePointBuyChange = (ability: AbilityKey, delta: number) => {
    const currentValue = character[ability];
    const newValue = currentValue + delta;
    
    if (newValue < 8 || newValue > 15) return;
    
    const currentCost = POINT_BUY_COSTS[currentValue];
    const newCost = POINT_BUY_COSTS[newValue];
    const costDelta = newCost - currentCost;
    
    if (pointsRemaining - costDelta < 0) return;
    
    updateCharacter({ [ability]: newValue });
  };

  const handleManualChange = (ability: AbilityKey, value: string) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(20, numValue));
    updateCharacter({ [ability]: clampedValue });
  };

  const getUsedValues = () => {
    return Object.values(standardAssignments).filter((v): v is number => v !== null);
  };

  const getAvailableValues = (currentAbility: AbilityKey) => {
    const used = getUsedValues();
    const currentValue = standardAssignments[currentAbility];
    
    return STANDARD_ARRAY.filter(v => !used.includes(v) || v === currentValue);
  };

  const formatModifier = (mod: number) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Check if all standard array values are assigned
  const allStandardAssigned = abilities.every(ability => standardAssignments[ability] !== null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Характеристики</h2>
        <p className="text-muted-foreground">
          Выберите метод распределения и назначьте значения характеристик.
        </p>
      </div>

      <Tabs 
        value={character.abilityMethod} 
        onValueChange={(v) => handleMethodChange(v as "standard" | "pointbuy" | "manual")}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">Стандартный набор</TabsTrigger>
          <TabsTrigger value="pointbuy">Покупка очков</TabsTrigger>
          <TabsTrigger value="manual">Ручной ввод</TabsTrigger>
        </TabsList>

        {/* Standard Array */}
        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Распределите значения: {STANDARD_ARRAY.join(", ")}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStandardAssignments(INITIAL_ASSIGNMENTS);
                    updateCharacter({
                      strength: 10,
                      dexterity: 10,
                      constitution: 10,
                      intelligence: 10,
                      wisdom: 10,
                      charisma: 10,
                    });
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Сбросить
                </Button>
              </div>
              {!allStandardAssigned && (
                <p className="text-xs text-destructive mt-1">
                  Распределите все 6 значений для продолжения
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {abilities.map((ability) => {
                  const isAssigned = standardAssignments[ability] !== null;
                  return (
                    <div key={ability} className="space-y-2">
                      <Label className={cn(!isAssigned && "text-destructive")}>{ABILITY_NAMES[ability]}</Label>
                      <Select
                        value={standardAssignments[ability]?.toString() || ""}
                        onValueChange={(v) => handleStandardAssign(ability, v)}
                      >
                        <SelectTrigger className={cn(!isAssigned && "border-destructive")}>
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableValues(ability).map((value) => (
                            <SelectItem key={value} value={value.toString()}>
                              {value} ({formatModifier(getModifier(value))})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Point Buy */}
        <TabsContent value="pointbuy" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Покупка очков</CardTitle>
                <Badge variant={pointsRemaining >= 0 ? "default" : "destructive"}>
                  Осталось: {pointsRemaining} / 27
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {abilities.map((ability) => {
                  const value = character[ability];
                  const cost = POINT_BUY_COSTS[value];
                  const canIncrease = value < 15 && pointsRemaining >= (POINT_BUY_COSTS[value + 1] - cost);
                  const canDecrease = value > 8;

                  return (
                    <div key={ability} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{ABILITY_NAMES[ability]}</Label>
                        <span className="text-xs text-muted-foreground">
                          Стоимость: {cost}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!canDecrease}
                          onClick={() => handlePointBuyChange(ability, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold">{value}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatModifier(getModifier(value))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!canIncrease}
                          onClick={() => handlePointBuyChange(ability, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ручной ввод (1-20)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {abilities.map((ability) => (
                  <div key={ability} className="space-y-2">
                    <Label>{ABILITY_NAMES[ability]}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={character[ability]}
                        onChange={(e) => handleManualChange(ability, e.target.value)}
                        className="text-center"
                      />
                      <Badge variant="secondary">
                        {formatModifier(getModifier(character[ability]))}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="bg-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Итоговые характеристики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {abilities.map((ability) => {
              const value = character[ability];
              const mod = getModifier(value);
              
              return (
                <div 
                  key={ability}
                  className="text-center p-3 bg-background rounded-lg border"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {ABILITY_NAMES[ability]}
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    mod > 0 && "text-green-500",
                    mod < 0 && "text-red-500"
                  )}>
                    {formatModifier(mod)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
