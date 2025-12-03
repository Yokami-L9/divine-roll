import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Map,
  Layers,
  Mountain,
  TreePine,
  Home,
  Waves,
  Castle,
  Tent,
  Download,
  ZoomIn,
  ZoomOut,
  Move,
  Pencil,
  Eraser,
  Grid3X3,
  Undo,
  Redo,
  Type,
} from "lucide-react";

const MapEditor = () => {
  const [selectedTool, setSelectedTool] = useState("move");
  const [selectedTerrain, setSelectedTerrain] = useState("grass");
  const [zoom, setZoom] = useState(100);
  const [brushSize, setBrushSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);

  const tools = [
    { id: "move", icon: Move, label: "Перемещение" },
    { id: "draw", icon: Pencil, label: "Рисование" },
    { id: "erase", icon: Eraser, label: "Стирание" },
    { id: "text", icon: Type, label: "Текст" },
  ];

  const terrains = [
    { id: "grass", label: "Трава", color: "bg-green-600" },
    { id: "forest", label: "Лес", color: "bg-green-800" },
    { id: "water", label: "Вода", color: "bg-blue-500" },
    { id: "mountain", label: "Горы", color: "bg-stone-500" },
    { id: "desert", label: "Пустыня", color: "bg-amber-500" },
    { id: "snow", label: "Снег", color: "bg-slate-200" },
  ];

  const markers = [
    { id: "city", icon: Castle, label: "Город" },
    { id: "village", icon: Home, label: "Деревня" },
    { id: "camp", icon: Tent, label: "Лагерь" },
    { id: "mountain", icon: Mountain, label: "Горы" },
    { id: "forest", icon: TreePine, label: "Лес" },
    { id: "water", icon: Waves, label: "Вода" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Toolbar */}
      <Card className="p-4 bg-card border-border lg:col-span-1 space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Инструменты
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTool(tool.id)}
                className={`h-10 w-full ${
                  selectedTool === tool.id
                    ? "bg-primary/20 border border-primary"
                    : "border border-border hover:border-primary/50"
                }`}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-muted-foreground">Сетка</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGrid(!showGrid)}
              className={`h-8 w-8 ${showGrid ? "bg-primary/20" : ""}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">Размер кисти</h4>
          <Slider
            value={[brushSize]}
            onValueChange={([v]) => setBrushSize(v)}
            min={5}
            max={50}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">{brushSize}px</span>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">Ландшафт</h4>
          <div className="grid grid-cols-3 gap-2">
            {terrains.map((terrain) => (
              <Button
                key={terrain.id}
                variant="ghost"
                onClick={() => setSelectedTerrain(terrain.id)}
                className={`h-12 flex-col gap-1 p-1 ${
                  selectedTerrain === terrain.id
                    ? "bg-primary/20 border border-primary"
                    : "border border-border"
                }`}
              >
                <div className={`w-5 h-5 rounded ${terrain.color}`}></div>
                <span className="text-[10px]">{terrain.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">Маркеры</h4>
          <div className="grid grid-cols-3 gap-2">
            {markers.map((marker) => (
              <Button
                key={marker.id}
                variant="ghost"
                className="h-12 flex-col gap-1 p-1 border border-border hover:border-primary/50"
              >
                <marker.icon className="w-4 h-4" />
                <span className="text-[10px]">{marker.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">Масштаб</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
              className="border border-border h-8 w-8"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="flex-1 text-center text-sm">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              className="border border-border h-8 w-8"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-4 bg-card border-border lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Холст</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          className="relative bg-background/50 rounded-lg border border-border overflow-hidden cursor-crosshair"
          style={{ height: "500px" }}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            ></div>
          )}

          {/* Sample terrain patches for demo */}
          <div
            className="absolute rounded-full bg-green-800/60"
            style={{ left: "15%", top: "20%", width: "80px", height: "60px" }}
          ></div>
          <div
            className="absolute rounded-full bg-green-800/60"
            style={{ left: "60%", top: "35%", width: "120px", height: "80px" }}
          ></div>
          <div
            className="absolute rounded-full bg-blue-500/60"
            style={{ left: "35%", top: "50%", width: "150px", height: "40px" }}
          ></div>
          <div
            className="absolute rounded-full bg-stone-500/60"
            style={{ left: "70%", top: "15%", width: "100px", height: "100px" }}
          ></div>

          {/* Sample markers */}
          <div className="absolute" style={{ left: "30%", top: "25%" }}>
            <div className="w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center border-2 border-primary shadow-lg shadow-primary/30 cursor-pointer hover:scale-110 transition-transform">
              <Castle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap bg-background/80 px-1 rounded">
              Столица
            </span>
          </div>

          <div className="absolute" style={{ left: "55%", top: "65%" }}>
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center border-2 border-secondary-foreground/20 cursor-pointer hover:scale-110 transition-transform">
              <Home className="w-3 h-3" />
            </div>
          </div>

          <div className="absolute" style={{ left: "75%", top: "45%" }}>
            <div className="w-6 h-6 bg-accent/80 rounded-full flex items-center justify-center border-2 border-accent cursor-pointer hover:scale-110 transition-transform">
              <Mountain className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              <span className="text-primary font-medium">Совет:</span> Выберите инструмент и кликните на холст
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Размер: 1920 × 1080 • Инструмент: {tools.find(t => t.id === selectedTool)?.label}
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Download className="w-4 h-4" />
            Экспортировать
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MapEditor;
