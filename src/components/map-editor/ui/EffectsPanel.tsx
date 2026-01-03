import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Sun, Contrast, Droplets } from 'lucide-react';
import { EffectSettings } from '../types';

interface EffectsPanelProps {
  effects: EffectSettings;
  onUpdateEffects: (updates: Partial<EffectSettings>) => void;
}

export function EffectsPanel({ effects, onUpdateEffects }: EffectsPanelProps) {
  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Эффекты
        </h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-5">
          {/* Paper Texture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-2">
                <span>📜</span> Текстура бумаги
              </Label>
              <Switch
                checked={effects.paperTexture}
                onCheckedChange={(checked) => 
                  onUpdateEffects({ paperTexture: checked })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Добавляет эффект старой бумаги
            </p>
          </div>

          <Separator />

          {/* Vignette */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-2">
                <span>🔲</span> Виньетка
              </Label>
              <Switch
                checked={effects.vignette}
                onCheckedChange={(checked) => 
                  onUpdateEffects({ vignette: checked })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Затемнение по краям карты
            </p>
          </div>

          <Separator />

          {/* Fog of War */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-2">
                <Droplets className="w-3 h-3" />
                Туман войны
              </Label>
              <Switch
                checked={effects.fogOfWar.enabled}
                onCheckedChange={(checked) => 
                  onUpdateEffects({ 
                    fogOfWar: { ...effects.fogOfWar, enabled: checked } 
                  })
                }
              />
            </div>
            
            {effects.fogOfWar.enabled && (
              <div className="space-y-3 pl-2">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Непрозрачность</Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(effects.fogOfWar.opacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[effects.fogOfWar.opacity]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={([v]) => 
                      onUpdateEffects({ 
                        fogOfWar: { ...effects.fogOfWar, opacity: v } 
                      })
                    }
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Цвет</Label>
                  <div className="grid grid-cols-5 gap-1">
                    {['#1a1a2e', '#0d0d1a', '#2d3436', '#000000', '#1e3a5f'].map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 transition-all ${
                          effects.fogOfWar.color === color 
                            ? 'border-white scale-110' 
                            : 'border-transparent hover:border-white/50'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => 
                          onUpdateEffects({ 
                            fogOfWar: { ...effects.fogOfWar, color } 
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Color Grading */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-2">
                <Sun className="w-3 h-3" />
                Цветокоррекция
              </Label>
              <Switch
                checked={effects.colorGrading.enabled}
                onCheckedChange={(checked) => 
                  onUpdateEffects({ 
                    colorGrading: { ...effects.colorGrading, enabled: checked } 
                  })
                }
              />
            </div>
            
            {effects.colorGrading.enabled && (
              <div className="space-y-3 pl-2">
                {/* Warmth */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Теплота</Label>
                    <span className="text-xs text-muted-foreground">
                      {effects.colorGrading.warmth > 0 ? '+' : ''}{Math.round(effects.colorGrading.warmth * 100)}
                    </span>
                  </div>
                  <Slider
                    value={[effects.colorGrading.warmth]}
                    min={-0.5}
                    max={0.5}
                    step={0.05}
                    onValueChange={([v]) => 
                      onUpdateEffects({ 
                        colorGrading: { ...effects.colorGrading, warmth: v } 
                      })
                    }
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Насыщенность</Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(effects.colorGrading.saturation * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[effects.colorGrading.saturation]}
                    min={0}
                    max={2}
                    step={0.05}
                    onValueChange={([v]) => 
                      onUpdateEffects({ 
                        colorGrading: { ...effects.colorGrading, saturation: v } 
                      })
                    }
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs flex items-center gap-1">
                      <Contrast className="w-3 h-3" />
                      Контраст
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(effects.colorGrading.contrast * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[effects.colorGrading.contrast]}
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    onValueChange={([v]) => 
                      onUpdateEffects({ 
                        colorGrading: { ...effects.colorGrading, contrast: v } 
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
