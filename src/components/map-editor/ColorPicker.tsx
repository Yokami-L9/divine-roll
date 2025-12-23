import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Palette, Pipette } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  label?: string;
}

const PRESET_COLORS = [
  // Nature
  '#4a7c59', '#2d5a3d', '#22c55e', '#84cc16',
  // Water
  '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6',
  // Earth
  '#78716c', '#a3a3a3', '#d4a373', '#92400e',
  // Snow/Sand
  '#e2e8f0', '#f5f5f4', '#fef3c7', '#fde68a',
  // Special
  '#eab308', '#f97316', '#ef4444', '#ec4899',
  '#8b5cf6', '#6366f1', '#1e293b', '#0f172a',
];

export const ColorPicker = ({
  color,
  onChange,
  opacity = 100,
  onOpacityChange,
  label = "Цвет",
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(color);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9"
        >
          <div
            className="w-5 h-5 rounded-md border border-border"
            style={{ 
              backgroundColor: color,
              opacity: opacity / 100,
            }}
          />
          <span className="text-xs text-muted-foreground flex-1 text-left truncate">
            {label}
          </span>
          <Palette className="w-4 h-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          {/* Preset colors */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Готовые цвета
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => onChange(presetColor)}
                  className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                    color === presetColor
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-border"
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>

          {/* Custom color picker */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Свой цвет
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-10 h-10 rounded-md cursor-pointer border-0"
                />
                <Pipette className="w-3 h-3 absolute bottom-1 right-1 text-white/70 pointer-events-none" />
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 h-8 px-2 text-xs bg-muted border border-border rounded-md font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Opacity slider */}
          {onOpacityChange && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-muted-foreground">
                  Прозрачность
                </h4>
                <span className="text-xs text-muted-foreground">{opacity}%</span>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={([v]) => onOpacityChange(v)}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          )}

          {/* Preview */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div
                className="w-full h-8 rounded-md border border-border"
                style={{
                  backgroundColor: color,
                  opacity: opacity / 100,
                }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
