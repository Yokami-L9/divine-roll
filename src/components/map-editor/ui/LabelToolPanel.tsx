import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type } from 'lucide-react';

interface LabelToolPanelProps {
  labelText: string;
  onLabelTextChange: (text: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
  labelColor: string;
  onLabelColorChange: (color: string) => void;
  outlineColor: string;
  onOutlineColorChange: (color: string) => void;
  outlineWidth: number;
  onOutlineWidthChange: (width: number) => void;
  onPlaceLabel: () => void;
}

const FONTS = [
  { value: 'serif', label: 'Serif (классический)' },
  { value: 'sans-serif', label: 'Sans-serif (современный)' },
  { value: 'cursive', label: 'Cursive (рукописный)' },
  { value: 'fantasy', label: 'Fantasy (декоративный)' },
  { value: 'monospace', label: 'Monospace (моноширинный)' },
];

const PRESET_COLORS = [
  '#ffffff', '#f5f5dc', '#daa520', '#8b4513',
  '#2c3e50', '#1a1a2e', '#c0392b', '#27ae60',
  '#3498db', '#9b59b6', '#f39c12', '#000000',
];

export function LabelToolPanel({
  labelText,
  onLabelTextChange,
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  labelColor,
  onLabelColorChange,
  outlineColor,
  onOutlineColorChange,
  outlineWidth,
  onOutlineWidthChange,
  onPlaceLabel
}: LabelToolPanelProps) {
  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Type className="w-4 h-4" />
          Надписи
        </h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {/* Text Input */}
          <div className="space-y-2">
            <Label className="text-xs">Текст</Label>
            <Input
              value={labelText}
              onChange={(e) => onLabelTextChange(e.target.value)}
              placeholder="Введите название..."
              className="bg-background/50"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label className="text-xs">Шрифт</Label>
            <Select value={fontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Размер</Label>
              <span className="text-xs text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              min={12}
              max={72}
              step={1}
              onValueChange={([v]) => onFontSizeChange(v)}
            />
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-xs">Цвет текста</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    labelColor === color 
                      ? 'border-primary scale-110' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onLabelColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Outline Color */}
          <div className="space-y-2">
            <Label className="text-xs">Цвет обводки</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    outlineColor === color 
                      ? 'border-primary scale-110' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onOutlineColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Outline Width */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Толщина обводки</Label>
              <span className="text-xs text-muted-foreground">{outlineWidth}px</span>
            </div>
            <Slider
              value={[outlineWidth]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={([v]) => onOutlineWidthChange(v)}
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-background/20 rounded-md text-center">
            <span
              style={{
                fontFamily,
                fontSize: `${Math.min(fontSize, 32)}px`,
                color: labelColor,
                textShadow: outlineWidth > 0 
                  ? `${outlineWidth}px ${outlineWidth}px 0 ${outlineColor}, -${outlineWidth}px -${outlineWidth}px 0 ${outlineColor}, ${outlineWidth}px -${outlineWidth}px 0 ${outlineColor}, -${outlineWidth}px ${outlineWidth}px 0 ${outlineColor}`
                  : 'none'
              }}
            >
              {labelText || 'Превью'}
            </span>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={onPlaceLabel}
          disabled={!labelText.trim()}
        >
          Разместить на карте
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Или кликните на карту
        </p>
      </div>
    </div>
  );
}