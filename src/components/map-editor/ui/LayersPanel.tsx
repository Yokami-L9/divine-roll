import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, EyeOff, Lock, Unlock, GripVertical,
  Layers, Mountain, MapPin, Route, Type, Sparkles, Grid3X3, CloudFog
} from 'lucide-react';
import { MapLayer } from '../types';
import { cn } from '@/lib/utils';

interface LayersPanelProps {
  layers: MapLayer[];
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

const LAYER_ICONS: Record<MapLayer['type'], React.ReactNode> = {
  terrain: <Mountain className="w-4 h-4" />,
  elevation: <Layers className="w-4 h-4" />,
  assets: <MapPin className="w-4 h-4" />,
  paths: <Route className="w-4 h-4" />,
  labels: <Type className="w-4 h-4" />,
  effects: <Sparkles className="w-4 h-4" />,
  grid: <Grid3X3 className="w-4 h-4" />,
  fog: <CloudFog className="w-4 h-4" />
};

const LAYER_NAMES: Record<MapLayer['type'], string> = {
  terrain: 'Ландшафт',
  elevation: 'Высоты',
  assets: 'Объекты',
  paths: 'Пути',
  labels: 'Надписи',
  effects: 'Эффекты',
  grid: 'Сетка',
  fog: 'Туман войны'
};

export function LayersPanel({
  layers,
  onToggleVisibility,
  onToggleLock,
  onReorder,
  onOpacityChange
}: LayersPanelProps) {
  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);

  return (
    <div className="w-56 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Слои
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedLayers.map((layer, index) => (
            <div
              key={layer.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md transition-colors",
                "hover:bg-white/5",
                !layer.visible && "opacity-50"
              )}
            >
              <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab" />
              
              <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                {LAYER_ICONS[layer.type]}
              </div>
              
              <span className="flex-1 text-sm truncate">
                {LAYER_NAMES[layer.type]}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onToggleVisibility(layer.id)}
              >
                {layer.visible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onToggleLock(layer.id)}
              >
                {layer.locked ? (
                  <Lock className="w-3.5 h-3.5 text-yellow-500" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}