import { useEffect, useRef, useState } from "react";
import { useMapCanvas } from "./useMapCanvas";
import { useLayers } from "./useLayers";
import { MapToolbar } from "./MapToolbar";
import { LayersPanel } from "./LayersPanel";
import { Minimap } from "./Minimap";
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
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  
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
    undo,
    redo,
    deleteSelected,
    clearCanvas,
    exportAsImage,
    saveMap,
    handleCanvasClick,
    applyTemplate,
    importBackgroundImage,
    copySelected,
    pasteObjects,
    toggleFogOfWar,
  } = useMapCanvas({
    width,
    height,
    initialData,
    onSave,
  });

  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    deleteLayer,
    toggleVisibility,
    toggleLock,
    moveLayer,
    renameLayer,
  } = useLayers();

  // Track viewport size
  useEffect(() => {
    const updateViewportSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

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
        } else if (e.key === 'c') {
          e.preventDefault();
          copySelected();
        } else if (e.key === 'v') {
          e.preventDefault();
          pasteObjects();
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
          case 'f':
            setActiveTool('fill');
            break;
          case 'l':
            setActiveTool('line');
            break;
          case 'r':
            setActiveTool('rect');
            break;
          case 'o':
            setActiveTool('ellipse');
            break;
          case 'p':
            setActiveTool('polygon');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveMap, deleteSelected, setActiveTool, copySelected, pasteObjects]);

  const handleExport = () => {
    const dataUrl = exportAsImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `map-${mapId || 'export'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleNavigate = (x: number, y: number) => {
    setViewportOffset({ x, y });
  };

  return (
    <div className="grid grid-cols-[200px_1fr_180px] gap-4 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left Toolbar */}
      <MapToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeTerrain={activeTerrain}
        setActiveTerrain={setActiveTerrain}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fillColor={fillColor}
        setFillColor={setFillColor}
        fillOpacity={fillOpacity}
        setFillOpacity={setFillOpacity}
        gridSize={gridSize}
        setGridSize={setGridSize}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        showFog={showFog}
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
        onApplyTemplate={applyTemplate}
        onImportImage={importBackgroundImage}
        onCopy={copySelected}
        onPaste={pasteObjects}
        onToggleFog={toggleFogOfWar}
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
              backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
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

        {/* Minimap */}
        {isReady && (
          <Minimap
            canvasRef={canvasRef}
            zoom={zoom}
            viewportWidth={viewportSize.width}
            viewportHeight={viewportSize.height}
            canvasWidth={width}
            canvasHeight={height}
            viewportOffset={viewportOffset}
            onNavigate={handleNavigate}
          />
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
              {activeTool === 'fill' && 'Заливка (F)'}
              {activeTool === 'marker' && 'Маркер (M)'}
              {activeTool === 'text' && 'Текст (T)'}
              {activeTool === 'line' && 'Линия (L)'}
              {activeTool === 'rect' && 'Прямоугольник (R)'}
              {activeTool === 'ellipse' && 'Эллипс (O)'}
              {activeTool === 'polygon' && 'Полигон (P)'}
            </span>
          </span>
        </div>
      </div>

      {/* Right Panel - Layers */}
      <LayersPanel
        layers={layers}
        activeLayerId={activeLayerId}
        onSelectLayer={setActiveLayerId}
        onToggleVisibility={toggleVisibility}
        onToggleLock={toggleLock}
        onAddLayer={addLayer}
        onDeleteLayer={deleteLayer}
        onMoveLayer={moveLayer}
        onRenameLayer={renameLayer}
      />
    </div>
  );
};
