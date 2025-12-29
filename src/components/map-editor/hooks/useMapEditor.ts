// Main Map Editor Hook - Orchestrates all editor functionality

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  MapState, 
  ToolType, 
  TerrainType, 
  BrushSettings,
  TerrainStroke,
  PathPoint,
  MapMode,
  DEFAULT_BRUSH_SETTINGS,
  createEmptyMapState,
  ViewportState
} from '../types';
import { TerrainRenderer } from '../engine/TerrainRenderer';
import { ViewportManager } from '../engine/ViewportManager';
import { HistoryManager } from '../engine/HistoryManager';

interface UseMapEditorProps {
  initialData?: object | null;
  width?: number;
  height?: number;
  mapId?: string;
  onSave?: (data: MapState) => void;
}

export function useMapEditor({
  initialData,
  width = 4096,
  height = 4096,
  mapId,
  onSave
}: UseMapEditorProps) {
  // Core state
  const [mapState, setMapState] = useState<MapState>(() => {
    if (initialData && typeof initialData === 'object' && 'terrainStrokes' in initialData) {
      return initialData as MapState;
    }
    return createEmptyMapState('New Map', 'world', width, height);
  });

  const [isReady, setIsReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType>('grass');
  const [brushSettings, setBrushSettings] = useState<BrushSettings>(DEFAULT_BRUSH_SETTINGS);
  const [viewport, setViewport] = useState<ViewportState>({ x: 0, y: 0, zoom: 1 });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<PathPoint[]>([]);

  // Refs for engines
  const terrainRendererRef = useRef<TerrainRenderer | null>(null);
  const viewportManagerRef = useRef<ViewportManager | null>(null);
  const historyManagerRef = useRef<HistoryManager | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const terrainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize engines
  useEffect(() => {
    terrainRendererRef.current = new TerrainRenderer(width, height);
    historyManagerRef.current = new HistoryManager({
      maxEntries: 100,
      onChange: (undo, redo) => {
        setCanUndo(undo);
        setCanRedo(redo);
      }
    });

    // Render existing strokes
    const renderer = terrainRendererRef.current;
    renderer.clear(mapState.backgroundColor);
    mapState.terrainStrokes.forEach(stroke => {
      renderer.renderStroke(stroke);
    });

    setIsReady(true);

    return () => {
      viewportManagerRef.current?.destroy();
    };
  }, [width, height]);

  // Initialize viewport manager when container is ready
  const initViewport = useCallback((container: HTMLDivElement) => {
    if (!container) return;
    canvasContainerRef.current = container;
    
    const rect = container.getBoundingClientRect();
    viewportManagerRef.current = new ViewportManager(
      rect.width,
      rect.height,
      width,
      height
    );
    viewportManagerRef.current.resetZoom();
    setViewport(viewportManagerRef.current.getState());
  }, [width, height]);

  // Get terrain canvas for rendering
  const getTerrainCanvas = useCallback((): HTMLCanvasElement | null => {
    return terrainRendererRef.current?.getCanvas() ?? null;
  }, []);

  // Convert screen coords to canvas coords
  const screenToCanvas = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    if (!viewportManagerRef.current) return { x: screenX, y: screenY };
    return viewportManagerRef.current.screenToCanvas(screenX, screenY);
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const canvasPoint = screenToCanvas(screenX, screenY);

    if (activeTool === 'pan' || e.button === 1) {
      // Middle mouse or pan tool
      viewportManagerRef.current?.stopInertia();
      return;
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      setIsDrawing(true);
      currentStrokeRef.current = [{ x: canvasPoint.x, y: canvasPoint.y }];
      
      // Immediate preview stroke
      const renderer = terrainRendererRef.current;
      if (renderer) {
        const previewStroke: TerrainStroke = {
          id: 'preview',
          terrain: selectedTerrain,
          points: currentStrokeRef.current,
          brushSettings,
          timestamp: Date.now()
        };
        
        if (activeTool === 'brush') {
          renderer.renderStroke(previewStroke);
        } else {
          renderer.eraseStroke(previewStroke, mapState.backgroundColor);
        }
      }
    }
  }, [activeTool, selectedTerrain, brushSettings, screenToCanvas, mapState.backgroundColor]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const canvasPoint = screenToCanvas(screenX, screenY);

    if ((activeTool === 'pan' || e.buttons === 4) && e.buttons > 0) {
      // Pan mode
      viewportManagerRef.current?.pan(e.movementX, e.movementY);
      setViewport(viewportManagerRef.current?.getState() ?? { x: 0, y: 0, zoom: 1 });
      return;
    }

    if (isDrawing && (activeTool === 'brush' || activeTool === 'eraser')) {
      currentStrokeRef.current.push({ x: canvasPoint.x, y: canvasPoint.y });
      
      // Render stroke incrementally
      const renderer = terrainRendererRef.current;
      if (renderer && currentStrokeRef.current.length >= 2) {
        const lastTwo = currentStrokeRef.current.slice(-2);
        const incrementalStroke: TerrainStroke = {
          id: 'incremental',
          terrain: selectedTerrain,
          points: lastTwo,
          brushSettings,
          timestamp: Date.now()
        };
        
        if (activeTool === 'brush') {
          renderer.renderStroke(incrementalStroke);
        } else {
          renderer.eraseStroke(incrementalStroke, mapState.backgroundColor);
        }
      }
    }
  }, [activeTool, isDrawing, selectedTerrain, brushSettings, screenToCanvas, mapState.backgroundColor]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentStrokeRef.current.length > 0) {
      const newStroke: TerrainStroke = {
        id: crypto.randomUUID(),
        terrain: selectedTerrain,
        points: [...currentStrokeRef.current],
        brushSettings: { ...brushSettings },
        timestamp: Date.now()
      };

      // Add to state
      setMapState(prev => ({
        ...prev,
        terrainStrokes: activeTool === 'brush' 
          ? [...prev.terrainStrokes, newStroke]
          : prev.terrainStrokes,
        updatedAt: new Date().toISOString()
      }));

      // Add to history
      historyManagerRef.current?.push({
        type: 'stroke',
        data: { stroke: newStroke, tool: activeTool }
      });

      currentStrokeRef.current = [];
    }
    setIsDrawing(false);
  }, [isDrawing, selectedTerrain, brushSettings, activeTool]);

  // Handle wheel (zoom)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!canvasContainerRef.current) return;
    
    e.preventDefault();
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    viewportManagerRef.current?.zoomAt(screenX, screenY, e.deltaY);
    setViewport(viewportManagerRef.current?.getState() ?? { x: 0, y: 0, zoom: 1 });
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    viewportManagerRef.current?.zoomIn();
    setViewport(viewportManagerRef.current?.getState() ?? { x: 0, y: 0, zoom: 1 });
  }, []);

  const zoomOut = useCallback(() => {
    viewportManagerRef.current?.zoomOut();
    setViewport(viewportManagerRef.current?.getState() ?? { x: 0, y: 0, zoom: 1 });
  }, []);

  const resetZoom = useCallback(() => {
    viewportManagerRef.current?.resetZoom();
    setViewport(viewportManagerRef.current?.getState() ?? { x: 0, y: 0, zoom: 1 });
  }, []);

  // Undo/Redo
  const undo = useCallback(() => {
    const entry = historyManagerRef.current?.undo();
    if (!entry) return;

    const renderer = terrainRendererRef.current;
    if (!renderer) return;

    // Re-render all strokes except the undone one
    renderer.clear(mapState.backgroundColor);
    const undoStack = historyManagerRef.current?.getUndoStack() ?? [];
    
    setMapState(prev => {
      const newStrokes = prev.terrainStrokes.slice(0, -1);
      newStrokes.forEach(stroke => renderer.renderStroke(stroke));
      return { ...prev, terrainStrokes: newStrokes };
    });
  }, [mapState.backgroundColor]);

  const redo = useCallback(() => {
    const entry = historyManagerRef.current?.redo();
    if (!entry || entry.type !== 'stroke') return;

    const renderer = terrainRendererRef.current;
    if (!renderer) return;

    const strokeData = entry.data as { stroke: TerrainStroke; tool: ToolType };
    if (strokeData.tool === 'brush') {
      renderer.renderStroke(strokeData.stroke);
      setMapState(prev => ({
        ...prev,
        terrainStrokes: [...prev.terrainStrokes, strokeData.stroke]
      }));
    }
  }, []);

  // Fill terrain
  const fillTerrain = useCallback((terrain: TerrainType) => {
    const renderer = terrainRendererRef.current;
    if (!renderer) return;

    renderer.fillTerrain(terrain);
    setMapState(prev => ({
      ...prev,
      backgroundColor: '#000000', // Will be covered by fill
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const renderer = terrainRendererRef.current;
    if (!renderer) return;

    renderer.clear(mapState.backgroundColor);
    setMapState(prev => ({
      ...prev,
      terrainStrokes: [],
      assets: [],
      paths: [],
      labels: [],
      updatedAt: new Date().toISOString()
    }));
    historyManagerRef.current?.clear();
  }, [mapState.backgroundColor]);

  // Save
  const save = useCallback(() => {
    onSave?.(mapState);
  }, [mapState, onSave]);

  // Export as image
  const exportAsImage = useCallback((): string | null => {
    const canvas = terrainRendererRef.current?.getCanvas();
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  // Set map mode
  const setMapMode = useCallback((mode: MapMode) => {
    setMapState(prev => ({
      ...prev,
      mode,
      gridSettings: {
        ...prev.gridSettings,
        enabled: mode === 'battle',
        type: mode === 'battle' ? 'square' : prev.gridSettings.type
      }
    }));
  }, []);

  // Update brush setting
  const updateBrushSetting = useCallback(<K extends keyof BrushSettings>(
    key: K,
    value: BrushSettings[K]
  ) => {
    setBrushSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get terrain texture for preview
  const getTerrainTexture = useCallback((terrain: TerrainType): HTMLCanvasElement | null => {
    return terrainRendererRef.current?.getTerrainTexture(terrain) ?? null;
  }, []);

  return {
    // State
    mapState,
    isReady,
    activeTool,
    selectedTerrain,
    brushSettings,
    viewport,
    canUndo,
    canRedo,
    isDrawing,
    
    // Setters
    setActiveTool,
    setSelectedTerrain,
    setBrushSettings,
    updateBrushSetting,
    setMapMode,
    
    // Canvas operations
    initViewport,
    getTerrainCanvas,
    getTerrainTexture,
    
    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    
    // Actions
    zoomIn,
    zoomOut,
    resetZoom,
    undo,
    redo,
    fillTerrain,
    clearCanvas,
    save,
    exportAsImage,
  };
}
