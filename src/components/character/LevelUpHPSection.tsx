import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dices, Edit3, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelUpHPSectionProps {
  hitDie: number;
  constitutionMod: number;
  onHPChange: (hp: number) => void;
  selectedHP: number | null;
}

export function LevelUpHPSection({
  hitDie,
  constitutionMod,
  onHPChange,
  selectedHP,
}: LevelUpHPSectionProps) {
  const [method, setMethod] = useState<"average" | "roll" | "manual">("average");
  const [rolledValue, setRolledValue] = useState<number | null>(null);
  const [manualValue, setManualValue] = useState<string>("");
  const [isRolling, setIsRolling] = useState(false);

  // Average HP (PHB rule: half die + 1)
  const averageHP = Math.floor(hitDie / 2) + 1 + constitutionMod;
  
  // Minimum HP is 1 (even with negative CON mod)
  const calculateFinalHP = (baseRoll: number) => Math.max(1, baseRoll + constitutionMod);

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rolls = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * hitDie) + 1;
      setRolledValue(tempRoll);
      rolls++;
      
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        const finalRoll = Math.floor(Math.random() * hitDie) + 1;
        setRolledValue(finalRoll);
        onHPChange(calculateFinalHP(finalRoll));
      }
    }, 80);
  };

  const handleMethodChange = (newMethod: "average" | "roll" | "manual") => {
    setMethod(newMethod);
    setRolledValue(null);
    setManualValue("");
    
    if (newMethod === "average") {
      onHPChange(averageHP);
    } else {
      onHPChange(0);
    }
  };

  const handleManualChange = (value: string) => {
    setManualValue(value);
    const num = parseInt(value, 10);
    
    if (!isNaN(num) && num >= 1 && num <= hitDie) {
      onHPChange(calculateFinalHP(num));
    } else {
      onHPChange(0);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="font-medium">Увеличение хитов</span>
          <Badge variant="secondary">к{hitDie}</Badge>
        </div>

        <RadioGroup
          value={method}
          onValueChange={(v) => handleMethodChange(v as "average" | "roll" | "manual")}
          className="space-y-3"
        >
          {/* Average option */}
          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
              method === "average" 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleMethodChange("average")}
          >
            <RadioGroupItem value="average" id="average" />
            <Label htmlFor="average" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Среднее значение (PHB)</span>
                </div>
                <Badge variant={method === "average" ? "default" : "secondary"}>
                  +{averageHP} HP
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.floor(hitDie / 2) + 1} (половина к{hitDie} + 1) + {constitutionMod >= 0 ? "+" : ""}{constitutionMod} (Тел)
              </p>
            </Label>
          </div>

          {/* Roll option */}
          <div
            className={cn(
              "p-3 rounded-lg border transition-all",
              method === "roll" 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleMethodChange("roll")}
            >
              <RadioGroupItem value="roll" id="roll" />
              <Label htmlFor="roll" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dices className="h-4 w-4 text-amber-500" />
                    <span>Бросок кубика</span>
                  </div>
                  {method === "roll" && rolledValue && !isRolling && (
                    <Badge variant="default">
                      +{calculateFinalHP(rolledValue)} HP
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Бросок к{hitDie} + модификатор Телосложения
                </p>
              </Label>
            </div>

            {method === "roll" && (
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rollDice}
                  disabled={isRolling}
                  className="min-w-[120px]"
                >
                  <Dices className={cn("h-4 w-4 mr-2", isRolling && "animate-spin")} />
                  {isRolling ? "Бросок..." : "Бросить к" + hitDie}
                </Button>
                
                {rolledValue !== null && (
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center font-bold text-lg",
                      isRolling && "animate-pulse"
                    )}>
                      {rolledValue}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      + {constitutionMod >= 0 ? "+" : ""}{constitutionMod} = {calculateFinalHP(rolledValue)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manual option */}
          <div
            className={cn(
              "p-3 rounded-lg border transition-all",
              method === "manual" 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleMethodChange("manual")}
            >
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-blue-500" />
                    <span>Ручной ввод</span>
                  </div>
                  {method === "manual" && manualValue && parseInt(manualValue) >= 1 && parseInt(manualValue) <= hitDie && (
                    <Badge variant="default">
                      +{calculateFinalHP(parseInt(manualValue))} HP
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Введите результат броска вручную (1-{hitDie})
                </p>
              </Label>
            </div>

            {method === "manual" && (
              <div className="mt-3 flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={hitDie}
                  value={manualValue}
                  onChange={(e) => handleManualChange(e.target.value)}
                  placeholder={`1-${hitDie}`}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  + {constitutionMod >= 0 ? "+" : ""}{constitutionMod} (Тел)
                </span>
                {manualValue && (parseInt(manualValue) < 1 || parseInt(manualValue) > hitDie) && (
                  <span className="text-sm text-destructive">
                    Значение от 1 до {hitDie}
                  </span>
                )}
              </div>
            )}
          </div>
        </RadioGroup>

        {selectedHP !== null && selectedHP > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Итоговое увеличение HP:</span>
              <span className="font-bold text-green-500">+{selectedHP}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
