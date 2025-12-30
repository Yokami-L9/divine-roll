import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Route, Waves, MapPin, Minus } from 'lucide-react';
import { MapPath } from '../types';

interface PathToolPanelProps {
  pathType: MapPath['type'];
  onPathTypeChange: (type: MapPath['type']) => void;
  pathWidth: number;
  onPathWidthChange: (width: number) => void;
  pathColor: string;
  onPathColorChange: (color: string) => void;
  isDrawingPath: boolean;
  onFinishPath: () => void;
  onCancelPath: () => void;
}

const PATH_TYPES: { id: MapPath['type']; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'road', name: 'Дорога', icon: <Route className="w-4 h-4" />, color: '#8B7355' },
  { id: 'river', name: 'Река', icon: <Waves className="w-4 h-4" />, color: '#3498db' },
  { id: 'border', name: 'Граница', icon: <MapPin className="w-4 h-4" />, color: '#c0392b' },
  { id: 'custom', name: 'Произвольный', icon: <Minus className="w-4 h-4" />, color: '#95a5a6' },
];

const PRESET_COLORS = [
  '#8B7355', // Brown (road)
  '#5d4e37', // Dark brown
  '#3498db', // Blue (river)
  '#2980b9', // Dark blue
  '#c0392b', // Red (border)
  '#e74c3c', // Light red
  '#27ae60', // Green
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#34495e', // Dark gray
  '#95a5a6', // Gray
];

export function PathToolPanel({
  pathType,
  onPathTypeChange,
  pathWidth,
  onPathWidthChange,
  pathColor,
  onPathColorChange,
  isDrawingPath,
  onFinishPath,
  onCancelPath
}: PathToolPanelProps) {
  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Route className="w-4 h-4" />
          Пути
        </h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-5">
          {/* Path Type */}
          <div className="space-y-2">
            <Label className="text-xs">Тип пути</Label>
            <div className="grid grid-cols-2 gap-2">
              {PATH_TYPES.map(type => (
                <Button
                  key={type.id}
                  variant={pathType === type.id ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-9 justify-start gap-2"
                  onClick={() => {
                    onPathTypeChange(type.id);
                    onPathColorChange(type.color);
                  }}
                >
                  {type.icon}
                  <span className="text-xs">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Width */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Ширина</Label>
              <span className="text-xs text-muted-foreground">{pathWidth}px</span>
            </div>
            <Slider
              value={[pathWidth]}
              min={2}
              max={30}
              step={1}
              onValueChange={([v]) => onPathWidthChange(v)}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-xs">Цвет</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    pathColor === color 
                      ? 'border-white scale-110' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onPathColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Drawing Instructions */}
          <div className="p-3 bg-background/20 rounded-md">
            <p className="text-xs text-muted-foreground">
              {isDrawingPath 
                ? 'Кликайте, чтобы добавить точки. Дважды кликните, чтобы завершить путь.'
                : 'Кликните на карту, чтобы начать рисовать путь.'}
            </p>
          </div>
        </div>
      </ScrollArea>

      {isDrawingPath && (
        <div className="p-3 border-t border-border flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onCancelPath}
          >
            Отмена
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            onClick={onFinishPath}
          >
            Завершить
          </Button>
        </div>
      )}
    </div>
  );
}