import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grid3X3, Hexagon } from 'lucide-react';
import { GridSettings } from '../types';

interface GridSettingsPanelProps {
  settings: GridSettings;
  onUpdateSettings: (settings: Partial<GridSettings>) => void;
}

const GRID_COLORS = [
  '#ffffff', '#000000', '#2c3e50', '#7f8c8d',
  '#c0392b', '#27ae60', '#3498db', '#f39c12',
];

export function GridSettingsPanel({ settings, onUpdateSettings }: GridSettingsPanelProps) {
  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" />
          Сетка
        </h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-5">
          {/* Enable Grid */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Показать сетку</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => onUpdateSettings({ enabled })}
            />
          </div>

          {/* Grid Type */}
          <div className="space-y-2">
            <Label className="text-xs">Тип сетки</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={settings.type === 'square' ? 'secondary' : 'outline'}
                size="sm"
                className="h-12 flex-col gap-1"
                onClick={() => onUpdateSettings({ type: 'square' })}
              >
                <Grid3X3 className="w-5 h-5" />
                <span className="text-xs">Квадрат</span>
              </Button>
              <Button
                variant={settings.type === 'hex' ? 'secondary' : 'outline'}
                size="sm"
                className="h-12 flex-col gap-1"
                onClick={() => onUpdateSettings({ type: 'hex' })}
              >
                <Hexagon className="w-5 h-5" />
                <span className="text-xs">Гекс</span>
              </Button>
            </div>
          </div>

          {/* Cell Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Размер ячейки</Label>
              <span className="text-xs text-muted-foreground">{settings.size}px</span>
            </div>
            <Slider
              value={[settings.size]}
              min={20}
              max={200}
              step={5}
              onValueChange={([size]) => onUpdateSettings({ size })}
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Непрозрачность</Label>
              <span className="text-xs text-muted-foreground">{Math.round(settings.opacity * 100)}%</span>
            </div>
            <Slider
              value={[settings.opacity * 100]}
              min={5}
              max={100}
              step={5}
              onValueChange={([v]) => onUpdateSettings({ opacity: v / 100 })}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-xs">Цвет</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRID_COLORS.map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    settings.color === color 
                      ? 'border-primary scale-110' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdateSettings({ color })}
                />
              ))}
            </div>
          </div>

          {/* Snap to Grid */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Привязка к сетке</Label>
            <Switch
              checked={settings.snap}
              onCheckedChange={(snap) => onUpdateSettings({ snap })}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}