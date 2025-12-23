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
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  RotateCcw,
  Minus,
  Square,
  Circle,
  Pentagon,
  PaintBucket,
  Image,
  Copy,
  Clipboard,
  CloudFog,
  Magnet,
} from "lucide-react";
import type { ToolType, TerrainType, MarkerType } from "./types";
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from "./types";
import { ColorPicker } from "./ColorPicker";
import { MapTemplates, type MapTemplate } from "./MapTemplates";

interface MapToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  activeTerrain: TerrainType;
  setActiveTerrain: (terrain: TerrainType) => void;
  activeMarker: MarkerType;
  setActiveMarker: (marker: MarkerType) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  strokeWidth: number;
  setStrokeWidth: (size: number) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  fillOpacity: number;
  setFillOpacity: (opacity: number) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  showFog: boolean;
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
  onApplyTemplate: (template: MapTemplate) => void;
  onImportImage: (file: File) => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleFog: () => void;
}

const tools: { id: ToolType; icon: React.ElementType; label: string; shortcut?: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Выделение', shortcut: 'V' },
  { id: 'pan', icon: Hand, label: 'Перемещение', shortcut: 'H' },
  { id: 'brush', icon: Paintbrush, label: 'Кисть', shortcut: 'B' },
  { id: 'eraser', icon: Eraser, label: 'Ластик', shortcut: 'E' },
  { id: 'fill', icon: PaintBucket, label: 'Заливка', shortcut: 'F' },
  { id: 'marker', icon: MapPin, label: 'Маркер', shortcut: 'M' },
  { id: 'text', icon: Type, label: 'Текст', shortcut: 'T' },
];

const shapeTools: { id: ToolType; icon: React.ElementType; label: string; shortcut?: string }[] = [
  { id: 'line', icon: Minus, label: 'Линия', shortcut: 'L' },
  { id: 'rect', icon: Square, label: 'Прямоугольник', shortcut: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Эллипс', shortcut: 'O' },
  { id: 'polygon', icon: Pentagon, label: 'Полигон', shortcut: 'P' },
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
  strokeWidth,
  setStrokeWidth,
  fillColor,
  setFillColor,
  fillOpacity,
  setFillOpacity,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  showFog,
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
  onApplyTemplate,
  onImportImage,
  onCopy,
  onPaste,
  onToggleFog,
}: MapToolbarProps) => {
  const isShapeTool = ['line', 'rect', 'ellipse', 'polygon'].includes(activeTool);
  const showColorPicker = activeTool === 'brush' || activeTool === 'fill' || isShapeTool;
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportImage(file);
      e.target.value = '';
    }
  };
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-border h-full overflow-y-auto">
        {/* Basic Tools */}
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
                <TooltipContent side="right">
                  {tool.label} {tool.shortcut && `(${tool.shortcut})`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shape Tools */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Фигуры</h4>
          <div className="grid grid-cols-4 gap-1">
            {shapeTools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveTool(tool.id)}
                    className={`h-9 w-9 ${
                      activeTool === tool.id
                        ? "bg-primary/20 border border-primary text-primary"
                        : "border border-transparent hover:border-border"
                    }`}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {tool.label} {tool.shortcut && `(${tool.shortcut})`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Terrain (show for brush, fill and shape tools) */}
        {showColorPicker && (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Ландшафт / Цвет</h4>
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

            {/* Custom color picker */}
            <ColorPicker
              color={fillColor}
              onChange={setFillColor}
              opacity={fillOpacity}
              onOpacityChange={setFillOpacity}
              label="Свой цвет"
            />
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

        {/* Stroke Width for shapes */}
        {isShapeTool && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Толщина линии</h4>
                <span className="text-xs text-muted-foreground">{strokeWidth}px</span>
              </div>
              <Slider
                value={[strokeWidth]}
                onValueChange={([v]) => setStrokeWidth(v)}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>
            <Separator />
          </>
        )}

        {/* Polygon hint */}
        {activeTool === 'polygon' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
              Кликайте для добавления точек. Двойной клик для завершения полигона.
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

        {/* Grid Settings */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Сетка</h4>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGrid(!showGrid)}
              className={`h-8 w-8 ${showGrid ? "bg-primary/20 text-primary" : ""}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`h-8 w-8 ${snapToGrid ? "bg-primary/20 text-primary" : ""}`}
            >
              <Magnet className="w-4 h-4" />
            </Button>
          </div>
          {showGrid && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Размер:</span>
              <Slider
                value={[gridSize]}
                onValueChange={([v]) => setGridSize(v)}
                min={20}
                max={100}
                step={10}
                className="flex-1"
              />
              <span className="text-xs w-8">{gridSize}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Fog of War */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Туман войны</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFog}
            className={`h-8 w-8 ${showFog ? "bg-primary/20 text-primary" : ""}`}
          >
            <CloudFog className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Copy/Paste */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Буфер обмена</h4>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCopy}
                  className="h-8 w-8 border border-border"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Копировать (Ctrl+C)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPaste}
                  className="h-8 w-8 border border-border"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Вставить (Ctrl+V)</TooltipContent>
            </Tooltip>
          </div>
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
          {/* Import Image */}
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button variant="outline" className="w-full gap-2" asChild>
              <span>
                <Image className="w-4 h-4" />
                Импорт фона
              </span>
            </Button>
          </label>
          <MapTemplates onSelectTemplate={onApplyTemplate} />
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
