import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MousePointer2,
  Hand,
  Paintbrush,
  Eraser,
  MapPin,
  Type,
  Undo,
  Redo,
  Trash2,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  RotateCcw,
} from "lucide-react";
import type { ToolType, TerrainType, MarkerType } from "./types";
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from "./types";

interface MapToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  activeTerrain: TerrainType;
  setActiveTerrain: (terrain: TerrainType) => void;
  activeMarker: MarkerType;
  setActiveMarker: (marker: MarkerType) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  onSave: () => void;
}

const tools: { id: ToolType; icon: React.ElementType; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Выделение' },
  { id: 'pan', icon: Hand, label: 'Перемещение' },
  { id: 'brush', icon: Paintbrush, label: 'Кисть' },
  { id: 'eraser', icon: Eraser, label: 'Ластик' },
  { id: 'marker', icon: MapPin, label: 'Маркер' },
  { id: 'text', icon: Type, label: 'Текст' },
];

export const MapToolbar = ({
  activeTool,
  setActiveTool,
  activeTerrain,
  setActiveTerrain,
  activeMarker,
  setActiveMarker,
  brushSize,
  setBrushSize,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onExport,
  onSave,
}: MapToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-border h-full overflow-y-auto">
        {/* Tools */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Инструменты</h4>
          <div className="grid grid-cols-3 gap-1">
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveTool(tool.id)}
                    className={`h-10 w-10 ${
                      activeTool === tool.id
                        ? "bg-primary/20 border border-primary text-primary"
                        : "border border-transparent hover:border-border"
                    }`}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tool.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Terrain (only show when brush is active) */}
        {activeTool === 'brush' && (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Ландшафт</h4>
              <div className="grid grid-cols-4 gap-1">
                {TERRAIN_CONFIGS.map((terrain) => (
                  <Tooltip key={terrain.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveTerrain(terrain.id)}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${
                          activeTerrain === terrain.id
                            ? "border-primary scale-110 shadow-lg"
                            : "border-transparent hover:border-border"
                        }`}
                        style={{ backgroundColor: terrain.color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="right">{terrain.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Markers (only show when marker tool is active) */}
        {activeTool === 'marker' && (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Маркеры</h4>
              <div className="grid grid-cols-4 gap-1">
                {MARKER_CONFIGS.map((marker) => (
                  <Tooltip key={marker.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveMarker(marker.id)}
                        className={`w-8 h-8 rounded-md border-2 flex items-center justify-center text-lg transition-all ${
                          activeMarker === marker.id
                            ? "border-primary bg-primary/20"
                            : "border-border hover:border-primary/50 bg-background"
                        }`}
                      >
                        {marker.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{marker.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Brush Size */}
        {(activeTool === 'brush' || activeTool === 'eraser') && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Размер кисти</h4>
                <span className="text-xs text-muted-foreground">{brushSize}px</span>
              </div>
              <Slider
                value={[brushSize]}
                onValueChange={([v]) => setBrushSize(v)}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <Separator />
          </>
        )}

        {/* Zoom */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Масштаб</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="h-8 w-8 border border-border"
              disabled={zoom <= 0.25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="flex-1 text-center text-sm font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="h-8 w-8 border border-border"
              disabled={zoom >= 2}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Grid Toggle */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Сетка</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGrid(!showGrid)}
            className={`h-8 w-8 ${showGrid ? "bg-primary/20 text-primary" : ""}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* History */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">История</h4>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-8 w-8 border border-border"
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Отменить (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-8 w-8 border border-border"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Повторить (Ctrl+Y)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="h-8 w-8 border border-border text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Очистить холст</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onSave}
            className="w-full bg-gradient-gold hover:opacity-90 gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
            className="w-full gap-2"
          >
            <Download className="w-4 h-4" />
            Экспорт PNG
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
