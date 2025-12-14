import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface LevelSelectorProps {
  level: number;
  onChange: (level: number) => void;
  minLevel?: number;
  maxLevel?: number;
}

export function LevelSelector({ 
  level, 
  onChange, 
  minLevel = 1, 
  maxLevel = 20 
}: LevelSelectorProps) {
  const proficiencyBonus = Math.floor((level - 1) / 4) + 2;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Уровень:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChange(Math.max(minLevel, level - 1))}
            disabled={level <= minLevel}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 text-center">
            <span className="text-xl font-bold">{level}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChange(Math.min(maxLevel, level + 1))}
            disabled={level >= maxLevel}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        Бонус мастерства: +{proficiencyBonus}
      </Badge>
    </div>
  );
}
