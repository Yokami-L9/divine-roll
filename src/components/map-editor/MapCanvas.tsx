import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMapEditor } from './hooks/useMapEditor';
import { EditorToolbar } from './ui/EditorToolbar';
import { TerrainPanel } from './ui/TerrainPanel';
import { BrushPanel } from './ui/BrushPanel';
import { LayersPanel } from './ui/LayersPanel';
import { AssetLibrary } from './ui/AssetLibrary';
import { PathToolPanel } from './ui/PathToolPanel';
import { LabelToolPanel } from './ui/LabelToolPanel';
import { GridSettingsPanel } from './ui/GridSettingsPanel';
import { MapState, ToolType, MapPath, GridSettings } from './types';

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
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // UI State
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [pathSettings, setPathSettings] = useState({
    type: 'road' as MapPath['type'],
    width: 8,
    color: '#8B7355'
  });
  const [labelSettings, setLabelSettings] = useState({
    text: '',
    fontSize: 24,
    fontFamily: 'serif',
    color: '#f5f5dc',
    outlineColor: '#1a1a2e',
    outlineWidth: 2
  });
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    type: 'square',
    size: 50,
    opacity: 0.3,
    color: '#ffffff',
    snap: false
  });
  const [showLayersPanel, setShowLayersPanel] = useState(false);

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

  // Render main canvas + overlays
  useEffect(() => {
    if (!editor.isReady || !canvasRef.current) return;
    
    const terrainCanvas = editor.getTerrainCanvas();
    if (!terrainCanvas) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw terrain layer
      if (editor.mapState.layers.find(l => l.id === 'terrain')?.visible) {
        ctx.drawImage(terrainCanvas, 0, 0);
      }
      
      // Draw paths
      const pathsLayer = editor.mapState.layers.find(l => l.id === 'paths');
      if (pathsLayer?.visible) {
        ctx.globalAlpha = pathsLayer.opacity;
        renderPaths(ctx, editor.mapState.paths);
        
        // Draw current path being drawn
        if (editor.isDrawingPath && editor.currentPath.length > 0) {
          renderCurrentPath(ctx, editor.currentPath, pathSettings);
        }
        ctx.globalAlpha = 1;
      }
      
      // Draw labels
      const labelsLayer = editor.mapState.layers.find(l => l.id === 'labels');
      if (labelsLayer?.visible) {
        ctx.globalAlpha = labelsLayer.opacity;
        renderLabels(ctx, editor.mapState.labels);
        ctx.globalAlpha = 1;
      }
      
      // Draw grid overlay if enabled
      if (gridSettings.enabled) {
        renderGrid(ctx, gridSettings, width, height);
      }
    };

    render();
    const interval = setInterval(render, 16);
    return () => clearInterval(interval);
  }, [
    editor.isReady, 
    editor.getTerrainCanvas, 
    editor.mapState.paths, 
    editor.mapState.labels, 
    editor.mapState.layers,
    editor.isDrawingPath,
    editor.currentPath,
    pathSettings,
    width, 
    height, 
    gridSettings
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'v': editor.setActiveTool('select'); break;
        case 'b': editor.setActiveTool('brush'); break;
        case 'e': editor.setActiveTool('eraser'); break;
        case 'g': editor.setActiveTool('fill'); break;
        case 'i': editor.setActiveTool('eyedropper'); break;
        case 'p': editor.setActiveTool('path'); break;
        case 't': editor.setActiveTool('text'); break;
        case 'l': setShowLayersPanel(v => !v); break;
        case ' ':
          e.preventDefault();
          editor.setActiveTool('pan');
          break;
        case 'escape':
          if (editor.isDrawingPath) {
            editor.cancelPath();
          }
          break;
        case 'enter':
          if (editor.isDrawingPath) {
            editor.finishPath(pathSettings.type, pathSettings.width, pathSettings.color);
          }
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              editor.redo();
            } else {
              editor.undo();
            }
          }
          break;
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            editor.redo();
          }
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            editor.save();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        editor.setActiveTool('brush');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor, pathSettings]);

  // Handle canvas click for text tool
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (editor.activeTool === 'text' && labelSettings.text.trim()) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasPoint = editor.screenToCanvas(screenX, screenY);
      
      editor.addLabel({
        text: labelSettings.text,
        x: canvasPoint.x,
        y: canvasPoint.y,
        fontSize: labelSettings.fontSize,
        fontFamily: labelSettings.fontFamily,
        color: labelSettings.color,
        outlineColor: labelSettings.outlineColor,
        outlineWidth: labelSettings.outlineWidth,
        rotation: 0
      });
      
      setLabelSettings(s => ({ ...s, text: '' }));
    }
  }, [editor, labelSettings]);

  // Determine which right panel to show
  const getRightPanel = () => {
    if (showLayersPanel) {
      return (
        <LayersPanel
          layers={editor.mapState.layers}
          onToggleVisibility={editor.toggleLayerVisibility}
          onToggleLock={editor.toggleLayerLock}
          onReorder={editor.reorderLayers}
          onOpacityChange={editor.setLayerOpacity}
        />
      );
    }
    
    switch (editor.activeTool) {
      case 'brush':
      case 'eraser':
        return (
          <BrushPanel
            brushSettings={editor.brushSettings}
            onUpdateSetting={editor.updateBrushSetting}
            activeTool={editor.activeTool}
          />
        );
      case 'path':
        return (
          <PathToolPanel
            pathType={pathSettings.type}
            onPathTypeChange={(type) => setPathSettings(s => ({ ...s, type }))}
            pathWidth={pathSettings.width}
            onPathWidthChange={(w) => setPathSettings(s => ({ ...s, width: w }))}
            pathColor={pathSettings.color}
            onPathColorChange={(color) => setPathSettings(s => ({ ...s, color }))}
            isDrawingPath={editor.isDrawingPath}
            onFinishPath={() => editor.finishPath(pathSettings.type, pathSettings.width, pathSettings.color)}
            onCancelPath={() => editor.cancelPath()}
          />
        );
      case 'text':
        return (
          <LabelToolPanel
            labelText={labelSettings.text}
            onLabelTextChange={(text) => setLabelSettings(s => ({ ...s, text }))}
            fontSize={labelSettings.fontSize}
            onFontSizeChange={(fontSize) => setLabelSettings(s => ({ ...s, fontSize }))}
            fontFamily={labelSettings.fontFamily}
            onFontFamilyChange={(fontFamily) => setLabelSettings(s => ({ ...s, fontFamily }))}
            labelColor={labelSettings.color}
            onLabelColorChange={(color) => setLabelSettings(s => ({ ...s, color }))}
            outlineColor={labelSettings.outlineColor}
            onOutlineColorChange={(outlineColor) => setLabelSettings(s => ({ ...s, outlineColor }))}
            outlineWidth={labelSettings.outlineWidth}
            onOutlineWidthChange={(outlineWidth) => setLabelSettings(s => ({ ...s, outlineWidth }))}
            onPlaceLabel={() => {}}
          />
        );
      case 'asset':
        return (
          <AssetLibrary
            onSelectAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
            isExpanded={showAssetLibrary}
            onToggleExpanded={() => setShowAssetLibrary(v => !v)}
          />
        );
      default:
        return (
          <GridSettingsPanel
            settings={gridSettings}
            onUpdateSettings={(updates) => setGridSettings(s => ({ ...s, ...updates }))}
          />
        );
    }
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
          onMouseDown={(e) => {
            editor.handleMouseDown(e);
            handleCanvasClick(e);
          }}
          onMouseMove={(e) => editor.handleMouseMove(e)}
          onMouseUp={() => editor.handleMouseUp()}
          onMouseLeave={() => editor.handleMouseUp()}
          onWheel={(e) => editor.handleWheel(e)}
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
          
          {/* Status indicators */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-mono">
            {Math.round(editor.viewport.zoom * 100)}%
          </div>

          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-mono">
            {width} × {height}
          </div>
          
          {editor.isDrawingPath && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm">
              Клик для добавления точек • Enter для завершения • Esc для отмены
            </div>
          )}
        </div>

        {/* Right Panel - Context-sensitive */}
        {getRightPanel()}
      </div>
    </div>
  );
}

// Helper function to render paths
function renderPaths(ctx: CanvasRenderingContext2D, paths: MapPath[]) {
  paths.forEach(path => {
    if (path.points.length < 2) return;
    
    ctx.save();
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (path.style === 'dashed') {
      ctx.setLineDash([path.width * 2, path.width]);
    } else if (path.style === 'dotted') {
      ctx.setLineDash([path.width / 2, path.width]);
    }
    
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    
    // Smooth Bezier curve through points
    for (let i = 1; i < path.points.length - 1; i++) {
      const xc = (path.points[i].x + path.points[i + 1].x) / 2;
      const yc = (path.points[i].y + path.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(path.points[i].x, path.points[i].y, xc, yc);
    }
    
    if (path.points.length > 1) {
      const last = path.points[path.points.length - 1];
      ctx.lineTo(last.x, last.y);
    }
    
    ctx.stroke();
    ctx.restore();
  });
}

// Helper function to render current path being drawn
function renderCurrentPath(
  ctx: CanvasRenderingContext2D, 
  points: { x: number; y: number }[], 
  settings: { type: string; width: number; color: string }
) {
  if (points.length < 1) return;
  
  ctx.save();
  ctx.strokeStyle = settings.color;
  ctx.lineWidth = settings.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([5, 5]);
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.stroke();
  
  // Draw points
  points.forEach((point, i) => {
    ctx.fillStyle = i === 0 ? '#22c55e' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(point.x, point.y, settings.width / 2 + 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
}

// Helper function to render labels
function renderLabels(ctx: CanvasRenderingContext2D, labels: import('./types').MapLabel[]) {
  labels.forEach(label => {
    ctx.save();
    ctx.translate(label.x, label.y);
    ctx.rotate((label.rotation * Math.PI) / 180);
    
    ctx.font = `${label.fontSize}px ${label.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Outline
    if (label.outlineWidth > 0 && label.outlineColor) {
      ctx.strokeStyle = label.outlineColor;
      ctx.lineWidth = label.outlineWidth * 2;
      ctx.lineJoin = 'round';
      ctx.strokeText(label.text, 0, 0);
    }
    
    // Fill
    ctx.fillStyle = label.color;
    ctx.fillText(label.text, 0, 0);
    
    ctx.restore();
  });
}

// Helper function to render grid
function renderGrid(ctx: CanvasRenderingContext2D, settings: GridSettings, width: number, height: number) {
  ctx.save();
  ctx.globalAlpha = settings.opacity;
  ctx.strokeStyle = settings.color;
  ctx.lineWidth = 1;

  if (settings.type === 'square') {
    ctx.beginPath();
    for (let x = 0; x <= width; x += settings.size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += settings.size) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  } else {
    // Hex grid
    const size = settings.size;
    const hexHeight = size * Math.sqrt(3);
    const hexWidth = size * 2;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 0.75;

    ctx.beginPath();
    for (let row = -1; row <= height / vertDist + 1; row++) {
      for (let col = -1; col <= width / horizDist + 1; col++) {
        const offset = col % 2 === 0 ? 0 : vertDist / 2;
        const cx = col * horizDist;
        const cy = row * vertDist + offset;

        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = cx + size * Math.cos(angle);
          const y = cy + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
    }
    ctx.stroke();
  }

  ctx.restore();
}
