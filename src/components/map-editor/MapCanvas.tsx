import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMapEditor } from './hooks/useMapEditor';
import { useAssetManager } from './hooks/useAssetManager';
import { usePathEditor } from './hooks/usePathEditor';
import { EditorToolbar } from './ui/EditorToolbar';
import { TerrainPanel } from './ui/TerrainPanel';
import { BrushPanel } from './ui/BrushPanel';
import { LayersPanel } from './ui/LayersPanel';
import { AssetLibrary } from './ui/AssetLibrary';
import { PathToolPanel } from './ui/PathToolPanel';
import { LabelToolPanel } from './ui/LabelToolPanel';
import { GridSettingsPanel } from './ui/GridSettingsPanel';
import { EffectsPanel } from './ui/EffectsPanel';
import { MapModeSelector } from './ui/MapModeSelector';
import { PathRenderer } from './engine/PathRenderer';
import { EffectsRenderer } from './engine/EffectsRenderer';
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

  // Asset manager
  const assetManager = useAssetManager({
    assets: editor.mapState.assets,
    onAddAsset: editor.addAsset,
    onUpdateAsset: editor.updateAsset,
    onDeleteAsset: editor.deleteAsset,
  });

  // Path editor
  const pathEditor = usePathEditor({
    paths: editor.mapState.paths,
    addPath: editor.addPath,
    updatePath: editor.updatePath,
    deletePath: editor.deletePath,
  });

  // Path renderer ref
  const pathRendererRef = useRef<PathRenderer | null>(null);
  
  // Effects renderer ref  
  const effectsRendererRef = useRef<EffectsRenderer | null>(null);
  
  // Effects panel toggle
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

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
      
      // Draw paths with PathRenderer
      const pathsLayer = editor.mapState.layers.find(l => l.id === 'paths');
      if (pathsLayer?.visible) {
        ctx.globalAlpha = pathsLayer.opacity;
        
        // Initialize path renderer if needed
        if (!pathRendererRef.current) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          pathRendererRef.current = new PathRenderer(tempCanvas);
        }
        
        // Use PathRenderer with selection support
        const pathRenderer = pathRendererRef.current;
        pathRenderer.renderAllPaths(editor.mapState.paths, {
          selectedPathId: pathEditor.selectedPathId,
          selectedPointIndex: pathEditor.selectedPointIndex,
          hoveredPointIndex: pathEditor.hoveredPointIndex,
          showControlPoints: editor.activeTool === 'select' || editor.activeTool === 'path',
        });
        
        // Draw the path renderer canvas onto main canvas
        const pathCanvas = (pathRenderer as any).canvas;
        if (pathCanvas) {
          ctx.drawImage(pathCanvas, 0, 0);
        } else {
          // Fallback: render directly
          renderPaths(ctx, editor.mapState.paths, pathEditor.selectedPathId);
        }
        
        // Draw current path being drawn
        if (editor.isDrawingPath && editor.currentPath.length > 0) {
          renderCurrentPath(ctx, editor.currentPath, pathSettings);
        }
        
        // Draw path being drawn via pathEditor
        if (pathEditor.isDrawingPath && pathEditor.currentPathPoints.length > 0) {
          pathRenderer.renderCurrentPath(
            pathEditor.currentPathPoints,
            pathEditor.pathSettings.color,
            pathEditor.pathSettings.width
          );
        }
        
        ctx.globalAlpha = 1;
      }
      
      // Draw assets
      const assetsLayer = editor.mapState.layers.find(l => l.id === 'assets');
      if (assetsLayer?.visible) {
        ctx.globalAlpha = assetsLayer.opacity;
        const renderer = assetManager.getAssetRenderer();
        renderer.renderAssets(
          ctx, 
          editor.mapState.assets,
          assetManager.selectedAssetId,
          assetManager.hoveredAssetId
        );
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
      
      // Apply post-processing effects
      const effects = editor.mapState.effects;
      if (effects.paperTexture || effects.vignette || effects.colorGrading.enabled) {
        // Initialize effects renderer if needed
        if (!effectsRendererRef.current && canvasRef.current) {
          effectsRendererRef.current = new EffectsRenderer(canvasRef.current);
        }
        
        if (effectsRendererRef.current) {
          effectsRendererRef.current.renderEffects(effects);
        }
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
    editor.mapState.assets,
    editor.mapState.layers,
    editor.isDrawingPath,
    editor.currentPath,
    editor.activeTool,
    assetManager.selectedAssetId,
    assetManager.hoveredAssetId,
    assetManager.getAssetRenderer,
    pathEditor.selectedPathId,
    pathEditor.selectedPointIndex,
    pathEditor.hoveredPointIndex,
    pathEditor.isDrawingPath,
    pathEditor.currentPathPoints,
    pathEditor.pathSettings,
    pathSettings,
    width, 
    height, 
    gridSettings,
    editor.mapState.effects
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
        case 'a': 
          editor.setActiveTool('asset'); 
          setShowAssetLibrary(true);
          break;
        case 'l': setShowLayersPanel(v => !v); setShowEffectsPanel(false); break;
        case 'x': setShowEffectsPanel(v => !v); setShowLayersPanel(false); break;
        case ' ':
          e.preventDefault();
          editor.setActiveTool('pan');
          break;
        case 'escape':
          if (editor.isDrawingPath) {
            editor.cancelPath();
          }
          if (pathEditor.isDrawingPath) {
            pathEditor.cancelDrawing();
          }
          if (pathEditor.selectedPathId) {
            pathEditor.selectPath(null);
          }
          if (assetManager.placingAssetId) {
            assetManager.cancelPlacement();
          }
          if (assetManager.selectedAssetId) {
            assetManager.setSelectedAssetId(null);
          }
          break;
        case 'enter':
          if (editor.isDrawingPath) {
            editor.finishPath(pathSettings.type, pathSettings.width, pathSettings.color);
          }
          if (pathEditor.isDrawingPath) {
            pathEditor.finishDrawing();
          }
          break;
        case 'r':
          // Rotate selected asset
          if (assetManager.selectedAssetId) {
            e.preventDefault();
            assetManager.rotateSelected(e.shiftKey ? -15 : 15);
          }
          break;
        case 'f':
          // Flip selected asset
          if (assetManager.selectedAssetId) {
            e.preventDefault();
            assetManager.flipSelected();
          }
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          // Delete selected path point first, then path, then asset
          if (pathEditor.selectedPointIndex !== null) {
            pathEditor.deleteSelectedPoint();
          } else if (pathEditor.selectedPathId) {
            pathEditor.deleteSelectedPath();
          } else if (assetManager.selectedAssetId) {
            assetManager.deleteSelected();
          }
          break;
        case '[':
          if (assetManager.selectedAssetId) {
            e.preventDefault();
            assetManager.sendToBack();
          }
          break;
        case ']':
          if (assetManager.selectedAssetId) {
            e.preventDefault();
            assetManager.bringToFront();
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
  }, [editor, pathSettings, assetManager, pathEditor]);

  // Handle canvas click for various tools
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const canvasPoint = editor.screenToCanvas(screenX, screenY);
    
    // Place asset if one is selected
    if (editor.activeTool === 'asset' && assetManager.placingAssetId) {
      assetManager.placeAsset(canvasPoint.x, canvasPoint.y);
      return;
    }
    
    // Handle path/asset selection in select mode
    if (editor.activeTool === 'select') {
      // Try path selection first
      const pathHandled = pathEditor.handleMouseDown(canvasPoint.x, canvasPoint.y);
      if (!pathHandled) {
        // Then try asset selection
        assetManager.handleMouseDown(canvasPoint.x, canvasPoint.y);
      }
      return;
    }
    
    // Eyedropper tool - pick terrain
    if (editor.activeTool === 'eyedropper') {
      const terrain = editor.pickTerrainAt(canvasPoint.x, canvasPoint.y);
      if (terrain) {
        editor.setSelectedTerrain(terrain);
        editor.setActiveTool('brush'); // Switch back to brush after picking
      }
      return;
    }
    
    // Fill tool - flood fill at point
    if (editor.activeTool === 'fill') {
      editor.floodFillAt(canvasPoint.x, canvasPoint.y, editor.selectedTerrain);
      return;
    }
    
    // Place text label
    if (editor.activeTool === 'text' && labelSettings.text.trim()) {
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
  }, [editor, labelSettings, assetManager, pathEditor]);

  // Handle mouse move for assets and paths
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const canvasPoint = editor.screenToCanvas(screenX, screenY);
    
    if (editor.activeTool === 'select') {
      // Handle path editing
      pathEditor.handleMouseMove(canvasPoint.x, canvasPoint.y);
      // Handle asset dragging
      assetManager.handleMouseMove(canvasPoint.x, canvasPoint.y);
    }
    editor.handleMouseMove(e);
  }, [editor, assetManager, pathEditor]);

  // Handle mouse up for assets and paths
  const handleMouseUp = useCallback(() => {
    pathEditor.handleMouseUp();
    assetManager.handleMouseUp();
    editor.handleMouseUp();
  }, [editor, assetManager, pathEditor]);

  // Handle wheel for asset scaling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (assetManager.selectedAssetId && e.ctrlKey) {
      e.preventDefault();
      assetManager.scaleSelected(e.deltaY > 0 ? -0.1 : 0.1);
      return;
    }
    editor.handleWheel(e);
  }, [editor, assetManager]);

  // Determine which right panel to show
  const getRightPanel = () => {
    if (showEffectsPanel) {
      return (
        <EffectsPanel
          effects={editor.mapState.effects}
          onUpdateEffects={editor.updateEffects}
        />
      );
    }
    
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
            onSelectAsset={(assetId) => assetManager.selectAssetForPlacement(assetId)}
            selectedAsset={assetManager.placingAssetId}
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
      
      {/* Map Mode Selector */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#0f1629] border-b border-border">
        <MapModeSelector 
          currentMode={editor.mapState.mode}
          onModeChange={editor.setMapMode}
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button 
            className={`px-2 py-1 rounded hover:bg-muted/20 ${showLayersPanel ? 'bg-muted/30 text-primary' : ''}`}
            onClick={() => { setShowLayersPanel(v => !v); setShowEffectsPanel(false); }}
          >
            Слои (L)
          </button>
          <button 
            className={`px-2 py-1 rounded hover:bg-muted/20 ${showEffectsPanel ? 'bg-muted/30 text-primary' : ''}`}
            onClick={() => { setShowEffectsPanel(v => !v); setShowLayersPanel(false); }}
          >
            Эффекты (X)
          </button>
        </div>
      </div>

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
function renderPaths(ctx: CanvasRenderingContext2D, paths: MapPath[], selectedPathId?: string | null) {
  paths.forEach(path => {
    if (path.points.length < 2) return;
    
    const isSelected = path.id === selectedPathId;
    
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
    
    // Draw glow for selected path
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = path.width + 6;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
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
