import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ruler, Settings } from "lucide-react";

interface MeasureToolProps {
  distance: number | null;
  unit: string;
  setUnit: (unit: string) => void;
  pixelsPerUnit: number;
  setPixelsPerUnit: (value: number) => void;
  onClear: () => void;
}

export const MeasureTool = ({
  distance,
  unit,
  setUnit,
  pixelsPerUnit,
  setPixelsPerUnit,
  onClear,
}: MeasureToolProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDistance = distance !== null 
    ? (distance / pixelsPerUnit).toFixed(1) 
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Измерение</h4>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Settings className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Единица измерения</Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="футы, метры, клетки..."
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Пикселей на единицу</Label>
                <Input
                  type="number"
                  value={pixelsPerUnit}
                  onChange={(e) => setPixelsPerUnit(Number(e.target.value) || 40)}
                  min={1}
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {formattedDistance !== null ? (
        <div className="bg-muted/50 rounded-md p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Ruler className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">
              {formattedDistance}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="mt-1 h-6 text-xs"
          >
            Очистить
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Кликните на две точки для измерения расстояния
        </p>
      )}
    </div>
  );
};
