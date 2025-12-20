import { useEffect, useRef } from "react";
import { useMapCanvas } from "./useMapCanvas";
import { MapToolbar } from "./MapToolbar";
import type { MapState } from "./types";

interface MapCanvasProps {
  width?: number;
  height?: number;
  initialData?: object | null;
  onSave?: (data: MapState) => void;
  mapId?: string;
}

export const MapCanvas = ({
  width = 1200,
  height = 800,
  initialData,
  onSave,
  mapId,
}: MapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    canvasRef,
    isReady,
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
    undo,
    redo,
    deleteSelected,
    clearCanvas,
    exportAsImage,
    saveMap,
    handleCanvasClick,
  } = useMapCanvas({
    width,
    height,
    initialData,
    onSave,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        } else if (e.key === 's') {
          e.preventDefault();
          saveMap();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case 'v':
            setActiveTool('select');
            break;
          case 'h':
            setActiveTool('pan');
            break;
          case 'b':
            setActiveTool('brush');
            break;
          case 'e':
            setActiveTool('eraser');
            break;
          case 'm':
            setActiveTool('marker');
            break;
          case 't':
            setActiveTool('text');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveMap, deleteSelected, setActiveTool]);

  const handleExport = () => {
    const dataUrl = exportAsImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `map-${mapId || 'export'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Toolbar */}
      <MapToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeTerrain={activeTerrain}
        setActiveTerrain={setActiveTerrain}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        zoom={zoom}
        setZoom={setZoom}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        onExport={handleExport}
        onSave={saveMap}
      />

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative bg-card rounded-lg border border-border overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            }}
          />
        )}

        {/* Canvas */}
        <canvas ref={canvasRef} className="block" />

        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Tool info */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Размер: {width} × {height} • 
            <span className="ml-2 text-primary">
              {activeTool === 'select' && 'Выделение (V)'}
              {activeTool === 'pan' && 'Перемещение (H)'}
              {activeTool === 'brush' && 'Кисть (B)'}
              {activeTool === 'eraser' && 'Ластик (E)'}
              {activeTool === 'marker' && 'Маркер (M)'}
              {activeTool === 'text' && 'Текст (T)'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
