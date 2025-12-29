import React, { useRef, useEffect, useState } from 'react';
import { useMapEditor } from './hooks/useMapEditor';
import { EditorToolbar } from './ui/EditorToolbar';
import { TerrainPanel } from './ui/TerrainPanel';
import { BrushPanel } from './ui/BrushPanel';
import { MapState } from './types';

interface MapCanvasProps {
  width?: number;
  height?: number;
  initialData?: object | null;
  onSave?: (data: MapState) => void;
  mapId?: string;
}

export function MapCanvas({ 
  width = 4096, 
  height = 4096, 
  initialData,
  onSave,
  mapId 
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const editor = useMapEditor({
    initialData,
    width,
    height,
    mapId,
    onSave
  });

  // Initialize viewport when container mounts
  useEffect(() => {
    if (containerRef.current) {
      editor.initViewport(containerRef.current);
    }
  }, [editor.initViewport]);

  // Sync terrain canvas to display canvas
  useEffect(() => {
    if (!editor.isReady || !canvasRef.current) return;
    
    const terrainCanvas = editor.getTerrainCanvas();
    if (!terrainCanvas) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(terrainCanvas, 0, 0);
    };

    render();
    const interval = setInterval(render, 16); // 60fps
    return () => clearInterval(interval);
  }, [editor.isReady, editor.getTerrainCanvas, width, height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    editor.handleMouseDown(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    editor.handleMouseMove(e);
  };

  const handleMouseUp = () => {
    editor.handleMouseUp();
  };

  const handleWheel = (e: React.WheelEvent) => {
    editor.handleWheel(e);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-[#1a1a2e] rounded-lg overflow-hidden border border-border">
      {/* Top Toolbar */}
      <EditorToolbar
        activeTool={editor.activeTool}
        onToolChange={editor.setActiveTool}
        onUndo={editor.undo}
        onRedo={editor.redo}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onZoomIn={editor.zoomIn}
        onZoomOut={editor.zoomOut}
        onResetZoom={editor.resetZoom}
        zoom={editor.viewport.zoom}
        onSave={editor.save}
        onExport={editor.exportAsImage}
        onClear={editor.clearCanvas}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Terrain */}
        <TerrainPanel
          selectedTerrain={editor.selectedTerrain}
          onSelectTerrain={editor.setSelectedTerrain}
          onFillTerrain={editor.fillTerrain}
          getTerrainTexture={editor.getTerrainTexture}
        />

        {/* Main Canvas Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden relative bg-[#0d0d1a] cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div 
            className="absolute origin-top-left"
            style={{
              transform: `translate(${editor.viewport.x}px, ${editor.viewport.y}px) scale(${editor.viewport.zoom})`
            }}
          >
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="block shadow-2xl"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-mono">
            {Math.round(editor.viewport.zoom * 100)}%
          </div>
        </div>

        {/* Right Panel - Brush Settings */}
        <BrushPanel
          brushSettings={editor.brushSettings}
          onUpdateSetting={editor.updateBrushSetting}
          activeTool={editor.activeTool}
        />
      </div>
    </div>
  );
}
