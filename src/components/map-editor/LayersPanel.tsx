import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";
import type { MapLayer } from "./types";

interface LayersPanelProps {
  layers: MapLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onRenameLayer: (id: string, name: string) => void;
}

export const LayersPanel = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onAddLayer,
  onDeleteLayer,
  onMoveLayer,
  onRenameLayer,
}: LayersPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Слои</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddLayer}
          className="h-7 w-7"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Нет слоёв
            </div>
          ) : (
            layers.map((layer, index) => (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  activeLayerId === layer.id
                    ? "bg-primary/20 border border-primary/50"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                {/* Visibility Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  className="h-6 w-6 opacity-70 hover:opacity-100"
                >
                  {layer.visible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>

                {/* Lock Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(layer.id);
                  }}
                  className="h-6 w-6 opacity-70 hover:opacity-100"
                >
                  {layer.locked ? (
                    <Lock className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Unlock className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>

                {/* Layer Name */}
                <span
                  className={`flex-1 text-sm truncate ${
                    !layer.visible ? "text-muted-foreground" : ""
                  }`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt("Название слоя:", layer.name);
                    if (newName) onRenameLayer(layer.id, newName);
                  }}
                >
                  {layer.name}
                </span>

                {/* Actions (visible on hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'up');
                    }}
                    disabled={index === 0}
                    className="h-5 w-5"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'down');
                    }}
                    disabled={index === layers.length - 1}
                    className="h-5 w-5"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (layers.length > 1) onDeleteLayer(layer.id);
                    }}
                    disabled={layers.length <= 1}
                    className="h-5 w-5 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
