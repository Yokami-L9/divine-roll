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
  Ruler,
  Pipette,
  Group,
  Ungroup,
  Lock,
  ArrowUpToLine,
  ArrowDownToLine,
  CopyPlus,
  Route,
  RotateCw,
} from "lucide-react";
import type { ToolType, TerrainType, MarkerType, ObjectNote } from "./types";
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from "./types";
import { ColorPicker } from "./ColorPicker";
import { MapTemplates, type MapTemplate } from "./MapTemplates";
import { MeasureTool } from "./MeasureTool";
import { ObjectNotes } from "./ObjectNotes";
import { ImportExport } from "./ImportExport";
import { PathTool, type PathPoint, type MapPath } from "./PathTool";
import { AssetLibrary, type Asset } from "./AssetLibrary";

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
  measureDistance: number | null;
  measureUnit: string;
  setMeasureUnit: (unit: string) => void;
  pixelsPerUnit: number;
  setPixelsPerUnit: (value: number) => void;
  onClearMeasurement: () => void;
  selectedObjectId: string | null;
  objectNotes: ObjectNote[];
  onAddNote: (objectId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onExportJSON: () => string | null;
  onImportJSON: (data: object) => void;
  cursorPosition: { x: number; y: number };
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  onToggleLock: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  // Path tool props
  isDrawingPath: boolean;
  currentPath: PathPoint[];
  paths: MapPath[];
  pathColor: string;
  setPathColor: (color: string) => void;
  onStartPath: () => void;
  onFinishPath: () => void;
  onCancelPath: () => void;
  onDeletePath: (pathId: string) => void;
  onClearAllPaths: () => void;
  // Asset props
  onAddAsset: (asset: Asset) => void;
  // Snap rotation
  snapRotation: boolean;
  setSnapRotation: (snap: boolean) => void;
}

const tools: { id: ToolType; icon: React.ElementType; label: string; shortcut?: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Выделение', shortcut: 'V' },
  { id: 'pan', icon: Hand, label: 'Перемещение', shortcut: 'H' },
  { id: 'brush', icon: Paintbrush, label: 'Кисть', shortcut: 'B' },
  { id: 'eraser', icon: Eraser, label: 'Ластик', shortcut: 'E' },
  { id: 'fill', icon: PaintBucket, label: 'Заливка', shortcut: 'F' },
  { id: 'marker', icon: MapPin, label: 'Маркер', shortcut: 'M' },
  { id: 'text', icon: Type, label: 'Текст', shortcut: 'T' },
  { id: 'measure', icon: Ruler, label: 'Измерение', shortcut: 'D' },
  { id: 'eyedropper', icon: Pipette, label: 'Пипетка', shortcut: 'I' },
  { id: 'path', icon: Route, label: 'Маршрут', shortcut: 'W' },
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
  measureDistance,
  measureUnit,
  setMeasureUnit,
  pixelsPerUnit,
  setPixelsPerUnit,
  onClearMeasurement,
  selectedObjectId,
  objectNotes,
  onAddNote,
  onDeleteNote,
  onExportJSON,
  onImportJSON,
  cursorPosition,
  onGroup,
  onUngroup,
  onDuplicate,
  onToggleLock,
  onBringToFront,
  onSendToBack,
  isDrawingPath,
  currentPath,
  paths,
  pathColor,
  setPathColor,
  onStartPath,
  onFinishPath,
  onCancelPath,
  onDeletePath,
  onClearAllPaths,
  onAddAsset,
  snapRotation,
  setSnapRotation,
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

        {/* Snap Rotation */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Привязка угла</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSnapRotation(!snapRotation)}
            className={`h-8 w-8 ${snapRotation ? "bg-primary/20 text-primary" : ""}`}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />
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

        {/* Object Operations */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Объекты</h4>
          <div className="grid grid-cols-3 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onGroup}
                  className="h-8 w-8 border border-border"
                >
                  <Group className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Группировать (Ctrl+G)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUngroup}
                  className="h-8 w-8 border border-border"
                >
                  <Ungroup className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Разгруппировать (Ctrl+Shift+G)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDuplicate}
                  className="h-8 w-8 border border-border"
                >
                  <CopyPlus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Дублировать (Ctrl+D)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleLock}
                  className="h-8 w-8 border border-border"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Блокировать/Разблокировать</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBringToFront}
                  className="h-8 w-8 border border-border"
                >
                  <ArrowUpToLine className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>На передний план</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSendToBack}
                  className="h-8 w-8 border border-border"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>На задний план</TooltipContent>
            </Tooltip>
          </div>
        </div>

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

        {/* Path Tool */}
        {activeTool === 'path' && (
          <>
            <PathTool
              isDrawingPath={isDrawingPath}
              currentPath={currentPath}
              paths={paths}
              pathColor={pathColor}
              setPathColor={setPathColor}
              pixelsPerUnit={pixelsPerUnit}
              measureUnit={measureUnit}
              onStartPath={onStartPath}
              onFinishPath={onFinishPath}
              onCancelPath={onCancelPath}
              onDeletePath={onDeletePath}
              onClearAllPaths={onClearAllPaths}
            />
            <Separator />
          </>
        )}

        {/* Measure Tool UI */}
        {activeTool === 'measure' && (
          <>
            <MeasureTool
              distance={measureDistance}
              unit={measureUnit}
              setUnit={setMeasureUnit}
              pixelsPerUnit={pixelsPerUnit}
              setPixelsPerUnit={setPixelsPerUnit}
              onClear={onClearMeasurement}
            />
            <Separator />
          </>
        )}

        {/* Object Notes */}
        <ObjectNotes
          notes={objectNotes}
          selectedObjectId={selectedObjectId}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
        />

        <Separator />

        {/* JSON Import/Export */}
        <ImportExport
          onExportJSON={onExportJSON}
          onImportJSON={onImportJSON}
        />

        <Separator />

        {/* Cursor Position */}
        <div className="bg-muted/50 rounded-md p-2 text-center">
          <span className="text-xs text-muted-foreground">
            X: {cursorPosition.x} Y: {cursorPosition.y}
          </span>
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
          <AssetLibrary onSelectAsset={onAddAsset} />
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
