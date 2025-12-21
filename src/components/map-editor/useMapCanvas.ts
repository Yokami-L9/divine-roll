import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, FabricText, PencilBrush, IText, Group } from 'fabric';
import type { ToolType, TerrainType, MarkerType, MapState } from './types';
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from './types';
import { toast } from 'sonner';

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
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
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
  const isPanningRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const activeToolRef = useRef(activeTool);
  const zoomRef = useRef(zoom);

  // Keep refs in sync
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

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
      if (mapState.canvasData && Object.keys(mapState.canvasData).length > 0) {
        isLoadingRef.current = true;
        canvas.loadFromJSON(mapState.canvasData).then(() => {
          canvas.renderAll();
          isLoadingRef.current = false;
          saveToHistory();
        });
      } else {
        saveToHistory();
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

    // Pan functionality
    canvas.on('mouse:down', (opt) => {
      if (activeToolRef.current === 'pan') {
        isPanningRef.current = true;
        canvas.selection = false;
        const pointer = canvas.getPointer(opt.e);
        lastPosRef.current = { x: pointer.x, y: pointer.y };
        canvas.defaultCursor = 'grabbing';
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isPanningRef.current && activeToolRef.current === 'pan') {
        const vpt = canvas.viewportTransform;
        const pointer = canvas.getPointer(opt.e);
        if (vpt) {
          vpt[4] += (pointer.x - lastPosRef.current.x) * zoomRef.current;
          vpt[5] += (pointer.y - lastPosRef.current.y) * zoomRef.current;
          canvas.requestRenderAll();
          lastPosRef.current = { x: pointer.x, y: pointer.y };
        }
      }
    });

    canvas.on('mouse:up', () => {
      isPanningRef.current = false;
      canvas.selection = activeToolRef.current === 'select';
      if (activeToolRef.current === 'pan') {
        canvas.defaultCursor = 'grab';
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [saveToHistory]);

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
    switch (activeTool) {
      case 'pan':
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        break;
      case 'brush':
      case 'eraser':
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
      case 'marker':
      case 'text':
        canvas.defaultCursor = 'pointer';
        canvas.hoverCursor = 'pointer';
        break;
      default:
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
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

    // Create marker with circle background
    const circle = new Circle({
      radius: 18,
      fill: config.color,
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    const text = new FabricText(config.icon, {
      fontSize: 18,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    // Create group
    const group = new Group([circle, text], {
      left: x - 18,
      top: y - 18,
      selectable: true,
      hasControls: true,
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  }, [activeMarker]);

  // Add text label
  const addText = useCallback((x: number, y: number, label: string = 'Название') => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new IText(label, {
      left: x,
      top: y,
      fontSize: 18,
      fill: '#ffffff',
      fontFamily: 'Georgia, serif',
      stroke: '#000000',
      strokeWidth: 0.5,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  }, []);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    // Don't add markers/text if there's an active object (user clicked on something)
    if (canvas.getActiveObject()) return;

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
      toast.success('Объекты удалены');
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
    toast.success('Холст очищен');
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
