import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText, PencilBrush, FabricObject } from 'fabric';
import type { ToolType, TerrainType, MarkerType, MapState } from './types';
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from './types';

interface UseMapCanvasOptions {
  width: number;
  height: number;
  initialData?: object | null;
  onSave?: (data: MapState) => void;
}

export const useMapCanvas = ({ width, height, initialData, onSave }: UseMapCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [activeTerrain, setActiveTerrain] = useState<TerrainType>('grass');
  const [activeMarker, setActiveMarker] = useState<MarkerType>('city');
  const [brushSize, setBrushSize] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isLoadingRef = useRef(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#1a1a2e',
      selection: true,
    });

    // Setup brush
    const brush = new PencilBrush(canvas);
    brush.color = TERRAIN_CONFIGS[0].color;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    fabricRef.current = canvas;
    setIsReady(true);

    // Load initial data if provided
    if (initialData && typeof initialData === 'object' && 'canvasData' in initialData) {
      const mapState = initialData as MapState;
      if (mapState.canvasData) {
        isLoadingRef.current = true;
        canvas.loadFromJSON(mapState.canvasData).then(() => {
          canvas.renderAll();
          isLoadingRef.current = false;
          saveToHistory();
        });
      }
    } else {
      saveToHistory();
    }

    // Track changes for undo/redo
    canvas.on('object:added', () => {
      if (!isLoadingRef.current) saveToHistory();
    });
    canvas.on('object:modified', () => {
      if (!isLoadingRef.current) saveToHistory();
    });
    canvas.on('object:removed', () => {
      if (!isLoadingRef.current) saveToHistory();
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Save to history for undo/redo
  const saveToHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    
    // Remove future states if we're not at the end
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history size
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
    
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Undo
  const undo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndexRef.current <= 0) return;

    historyIndexRef.current--;
    isLoadingRef.current = true;
    
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      isLoadingRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current++;
    isLoadingRef.current = true;
    
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      isLoadingRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  // Update tool mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = activeTool === 'brush' || activeTool === 'eraser';
    canvas.selection = activeTool === 'select';

    if (canvas.freeDrawingBrush) {
      if (activeTool === 'eraser') {
        canvas.freeDrawingBrush.color = '#1a1a2e'; // Background color for erasing
        canvas.freeDrawingBrush.width = brushSize;
      } else if (activeTool === 'brush') {
        const terrain = TERRAIN_CONFIGS.find(t => t.id === activeTerrain);
        canvas.freeDrawingBrush.color = terrain?.color || '#4a7c59';
        canvas.freeDrawingBrush.width = brushSize;
      }
    }

    // Update cursor
    const wrapper = canvasRef.current?.parentElement;
    if (wrapper) {
      switch (activeTool) {
        case 'pan':
          wrapper.style.cursor = 'grab';
          break;
        case 'brush':
        case 'eraser':
          wrapper.style.cursor = 'crosshair';
          break;
        case 'marker':
        case 'text':
          wrapper.style.cursor = 'pointer';
          break;
        default:
          wrapper.style.cursor = 'default';
      }
    }
  }, [activeTool, activeTerrain, brushSize]);

  // Update brush size
  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  // Handle zoom
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: width * zoom,
      height: height * zoom,
    });
  }, [zoom, width, height]);

  // Add marker
  const addMarker = useCallback((x: number, y: number, type?: MarkerType) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const markerType = type || activeMarker;
    const config = MARKER_CONFIGS.find(m => m.id === markerType);
    if (!config) return;

    // Create marker group
    const circle = new Circle({
      radius: 20,
      fill: config.color,
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const text = new FabricText(config.icon, {
      fontSize: 20,
      originX: 'center',
      originY: 'center',
    });

    // Position at click
    const group = new FabricObject();
    circle.set({ left: x, top: y });
    text.set({ left: x, top: y });

    canvas.add(circle);
    canvas.add(text);
    canvas.renderAll();
  }, [activeMarker]);

  // Add text label
  const addText = useCallback((x: number, y: number, label: string = 'Название') => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new FabricText(label, {
      left: x,
      top: y,
      fontSize: 16,
      fill: '#ffffff',
      fontFamily: 'serif',
      stroke: '#000000',
      strokeWidth: 0.5,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, []);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (activeTool === 'marker') {
      addMarker(x, y);
    } else if (activeTool === 'text') {
      addText(x, y);
    }
  }, [activeTool, zoom, addMarker, addText]);

  // Delete selected objects
  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#1a1a2e';
    canvas.renderAll();
    saveToHistory();
  }, [saveToHistory]);

  // Export as image
  const exportAsImage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
  }, []);

  // Get map state for saving
  const getMapState = useCallback((): MapState => {
    const canvas = fabricRef.current;
    return {
      width,
      height,
      backgroundColor: '#1a1a2e',
      layers: [],
      canvasData: canvas ? canvas.toJSON() : {},
    };
  }, [width, height]);

  // Save map
  const saveMap = useCallback(() => {
    if (onSave) {
      onSave(getMapState());
    }
  }, [getMapState, onSave]);

  return {
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
    getMapState,
    saveMap,
    handleCanvasClick,
  };
};
