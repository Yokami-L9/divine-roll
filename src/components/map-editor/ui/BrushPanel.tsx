import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrushSettings, ToolType } from '../types';

interface BrushPanelProps {
  brushSettings: BrushSettings;
  onUpdateSetting: <K extends keyof BrushSettings>(key: K, value: BrushSettings[K]) => void;
  activeTool: ToolType;
}

export function BrushPanel({ brushSettings, onUpdateSetting, activeTool }: BrushPanelProps) {
  if (activeTool !== 'brush' && activeTool !== 'eraser') {
    return (
      <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm">Настройки</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Выберите кисть или ластик для настройки
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm">
          {activeTool === 'brush' ? 'Кисть' : 'Ластик'}
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-5">
          {/* Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Размер</Label>
              <span className="text-xs text-muted-foreground">{brushSettings.size}px</span>
            </div>
            <Slider
              value={[brushSettings.size]}
              min={5}
              max={300}
              step={1}
              onValueChange={([v]) => onUpdateSetting('size', v)}
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Непрозрачность</Label>
              <span className="text-xs text-muted-foreground">{Math.round(brushSettings.opacity * 100)}%</span>
            </div>
            <Slider
              value={[brushSettings.opacity * 100]}
              min={1}
              max={100}
              step={1}
              onValueChange={([v]) => onUpdateSetting('opacity', v / 100)}
            />
          </div>

          {/* Hardness */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Жёсткость</Label>
              <span className="text-xs text-muted-foreground">{Math.round(brushSettings.hardness * 100)}%</span>
            </div>
            <Slider
              value={[brushSettings.hardness * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([v]) => onUpdateSetting('hardness', v / 100)}
            />
          </div>

          {/* Flow */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Нажим</Label>
              <span className="text-xs text-muted-foreground">{Math.round(brushSettings.flow * 100)}%</span>
            </div>
            <Slider
              value={[brushSettings.flow * 100]}
              min={1}
              max={100}
              step={1}
              onValueChange={([v]) => onUpdateSetting('flow', v / 100)}
            />
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Интервал</Label>
              <span className="text-xs text-muted-foreground">{Math.round(brushSettings.spacing * 100)}%</span>
            </div>
            <Slider
              value={[brushSettings.spacing * 100]}
              min={1}
              max={100}
              step={1}
              onValueChange={([v]) => onUpdateSetting('spacing', v / 100)}
            />
          </div>

          {/* Jitter */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Дрожание</Label>
              <span className="text-xs text-muted-foreground">{Math.round(brushSettings.jitter * 100)}%</span>
            </div>
            <Slider
              value={[brushSettings.jitter * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([v]) => onUpdateSetting('jitter', v / 100)}
            />
          </div>

          {/* Random Rotation */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Случ. поворот</Label>
            <Switch
              checked={brushSettings.randomRotation}
              onCheckedChange={(v) => onUpdateSetting('randomRotation', v)}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
